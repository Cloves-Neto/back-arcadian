import { Request, Response } from 'express';
import { ClientProfileServiceImpl } from '../service/ClientProfileServiceImpl';

export class ClientProfileController {
  private service: ClientProfileServiceImpl;

  constructor() {
    this.service = new ClientProfileServiceImpl();
  }

  async get(req: any, res: Response) {
    try {
      const data = await this.service.getProfile(req.user.id);
      return res.status(200).json({ data });
    } catch (error: any) {
      console.error('Error fetching client profile:', error);
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: any, res: Response) {
    try {
      const data = await this.service.updateProfile(req.user.id, req.body);
      return res.status(200).json({ 
        message: 'Perfil atualizado com sucesso',
        data 
      });
    } catch (error: any) {
      console.error('Error updating client profile:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}
