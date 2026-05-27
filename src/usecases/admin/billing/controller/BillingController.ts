import { Request, Response } from 'express';
import { BillingServiceImpl } from '../service/BillingServiceImpl';

export class BillingController {
  private service: BillingServiceImpl;

  constructor() {
    this.service = new BillingServiceImpl();
  }

  async listAll(req: Request, res: Response) {
    try {
      const contracts = await this.service.listAll();
      return res.json({ success: true, data: contracts });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getInstallments(req: Request, res: Response) {
    try {
      const { contractId } = req.params as { contractId: string };
      const installments = await this.service.getInstallments(contractId);
      return res.json({ success: true, data: installments });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { status, paid_amount, payment_date } = req.body;
      const result = await this.service.updateStatus(id, status, paid_amount, payment_date);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleUpfrontStatus(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { upfront_paid } = req.body;
      const result = await this.service.toggleUpfrontStatus(id, upfront_paid);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async charge(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await this.service.charge(id);
      return res.json({ success: true, message: 'Charge email triggered successfully' });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
