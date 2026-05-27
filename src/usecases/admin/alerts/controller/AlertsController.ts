import { Request, Response } from 'express';
import { AlertsServiceImpl } from '../service/AlertsServiceImpl';

export default class AlertsController {
  private service: AlertsServiceImpl;

  constructor() {
    this.service = new AlertsServiceImpl();
  }

  async createBanner(req: Request, res: Response) {
    try {
      const result = await this.service.createBanner(req.body);
      return res.status(201).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async listBanners(req: Request, res: Response) {
    try {
      const banners = await this.service.listBanners();
      return res.status(200).json({ status: 'success', data: banners });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateBanner(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const banner = await this.service.updateBanner(id as string, req.body);
      return res.status(200).json({ status: 'success', data: banner });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async deleteBanner(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteBanner(id as string);
      return res.status(200).json({ status: 'success', message: 'Banner excluído.' });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async createNotification(req: Request, res: Response) {
    try {
      const result = await this.service.createNotification(req.body);
      return res.status(201).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async listNotifications(req: Request, res: Response) {
    try {
      const notifications = await this.service.listNotifications();
      return res.status(200).json({ status: 'success', data: notifications });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteNotification(id as string);
      return res.status(200).json({ status: 'success', message: 'Notificação excluída.' });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
