import { Request, Response } from 'express';
import { UserServiceImpl } from '../service/UserServiceImpl';

export class UserController {
  private service: UserServiceImpl;

  constructor() {
    this.service = new UserServiceImpl();
  }

  async create(req: Request, res: Response) {
    try {
      const { email, full_name, role, privileges, client_data, ddd, phone } = req.body;

      if (!email || !full_name || !role) {
        return res.status(400).json({ status: 'error', message: 'Email, nome e cargo são obrigatórios.' });
      }

      const user = await this.service.create({ email, full_name, role, privileges, client_data, ddd, phone });
      return res.status(201).json({ status: 'success', data: user });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async invite(req: Request, res: Response) {
    return this.create(req, res);
  }

  async list(req: Request, res: Response) {
    try {
      const users = await this.service.list();
      return res.status(200).json({ status: 'success', data: users });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { full_name, role, privileges } = req.body;

    try {
      const user = await this.service.update(id, { full_name, role, privileges });
      return res.json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    try {
      await this.service.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async find(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const user = await this.service.find(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ data: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateSettings(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { settings } = req.body;
      const updatedUser = await this.service.updateSettings(userId, settings);
      return res.json({ status: 'success', data: updatedUser });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
