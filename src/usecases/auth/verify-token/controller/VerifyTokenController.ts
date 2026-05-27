import { Request, Response } from 'express';
import { VerifyTokenServiceImpl } from '../service/VerifyTokenServiceImpl';

export class VerifyTokenController {
  async handle(req: Request, res: Response) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token é obrigatório.' });
    }

    const service = new VerifyTokenServiceImpl();

    try {
      const user = await service.execute(token);
      return res.json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
