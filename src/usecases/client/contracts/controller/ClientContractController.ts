import { Request, Response } from 'express';
import { ClientContractServiceImpl } from '../service/ClientContractServiceImpl';

export class ClientContractController {
  private service: ClientContractServiceImpl;

  constructor() {
    this.service = new ClientContractServiceImpl();
  }

  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const contracts = await this.service.listByClient(userId);

      return res.status(200).json({ success: true, data: contracts });
    } catch (error: any) {
      console.error('Client Contract list error:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
