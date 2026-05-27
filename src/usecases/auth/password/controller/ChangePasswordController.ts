import { Request, Response } from 'express';
import ChangePasswordServiceImpl from '../service/ChangePasswordServiceImpl';
import { LogServiceImpl } from '../../../admin/logs/service/LogServiceImpl';

export default class ChangePasswordController {
  private service: ChangePasswordServiceImpl;

  constructor() {
    this.service = new ChangePasswordServiceImpl();
  }

  async change(req: Request, res: Response) {
    try {
      const { userId, token, newPassword } = req.body;

      if ((!userId && !token) || !newPassword) {
        return res.status(400).json({ status: 'error', message: 'Identificação do usuário e nova senha são obrigatórios.' });
      }

      const email = await this.service.execute(newPassword, userId, token);

      await new LogServiceImpl().record({
        user_id: userId,
        action: 'PASSWORD_CHANGED',
        details: token ? 'Usuário ativou conta via convite.' : 'Usuário alterou sua senha.',
        ip_address: req.ip
      });

      return res.status(200).json({ status: 'success', message: 'Senha alterada com sucesso.', email });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
