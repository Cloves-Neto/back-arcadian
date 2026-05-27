import { Request, Response } from 'express';
import { ClientBillingServiceImpl } from '../service/ClientBillingServiceImpl';

export class ClientBillingController {
  private service: ClientBillingServiceImpl;

  constructor() {
    this.service = new ClientBillingServiceImpl();
  }

  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const installments = await this.service.listByClient(userId);

      return res.status(200).json({ success: true, data: installments });
    } catch (error: any) {
      console.error('Client Billing list error:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
