import { Request, Response } from 'express';
import { ServiceServiceImpl } from '../service/ServiceServiceImpl';

export default class ServiceController {
  private service: ServiceServiceImpl;

  constructor() {
    this.service = new ServiceServiceImpl();
  }

  async list(req: Request, res: Response) {
    try {
      const services = await this.service.listServices();
      return res.status(200).json({ status: 'success', data: services });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description, base_price, category, upfront_price } = req.body;
      const service = await this.service.createService({ name, description, base_price, category, upfront_price });
      return res.status(201).json({ status: 'success', data: service });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const service = await this.service.updateService(id as string, data);
      return res.status(200).json({ status: 'success', data: service });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteService(id as string);
      return res.status(200).json({ status: 'success', message: 'Serviço excluído.' });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Subscriptions
  async listSubscriptions(req: Request, res: Response) {
    try {
      const subscriptions = await this.service.listSubscriptions();
      return res.status(200).json({ status: 'success', data: subscriptions });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async createSubscription(req: Request, res: Response) {
    try {
      const data = req.body;
      const sub = await this.service.createSubscription(data);
      return res.status(201).json({ status: 'success', data: sub });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const sub = await this.service.updateSubscription(id as string, data);
      return res.status(200).json({ status: 'success', data: sub });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteSubscription(id as string);
      return res.status(200).json({ status: 'success', message: 'Assinatura excluída.' });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
