import type { Request, Response } from 'express';
import type LoginService from '../service/LoginService';
import LoginServiceImpl from '../service/LoginServiceImpl';
import { LogServiceImpl } from '../../../admin/logs/service/LogServiceImpl';

export default class LoginController {
  private service: LoginService;

  public constructor() {
    this.service = new LoginServiceImpl();
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const result = await this.service.authenticate(email, password);

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      await new LogServiceImpl().record({
        user_id: (result as any).user.id,
        action: 'LOGIN',
        details: `Usuário acessou o sistema: ${email}`,
        ip_address: req.ip
      });

      return res.status(200).json({ data: result });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
