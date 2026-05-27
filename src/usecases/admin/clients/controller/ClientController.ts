import { Request, Response } from 'express';
import { ClientServiceImpl } from '../service/ClientServiceImpl';

export default class ClientController {
  private service: ClientServiceImpl;

  constructor() {
    this.service = new ClientServiceImpl();
  }

  async list(req: Request, res: Response) {
    try {
      const clients = await this.service.list();
      return res.status(200).json({ status: 'success', data: clients });
    } catch (error: any) {
      console.error('[ClientController.list] Error:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await this.service.create(data);
      return res.status(201).json({ status: 'success', data: result });
    } catch (error: any) {
      console.error('[ClientController.create] Error:', error);
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const client = await this.service.update(id as string, data);
      return res.status(200).json({ status: 'success', data: client });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.delete(id as string);
      return res.status(200).json({ status: 'success', message: 'Cliente excluído.' });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
