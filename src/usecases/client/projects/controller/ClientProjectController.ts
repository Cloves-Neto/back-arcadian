import { Request, Response } from 'express';
import ClientProjectService from '../service/ClientProjectService';
import { ProfileSequelize } from '../../../../models/database/SequelizeProfile';

export default class ClientProjectController {
  private service: ClientProjectService;

  constructor() {
    this.service = new ClientProjectService();
  }

  public async getClientProjects(req: any, res: Response): Promise<void> {
    try {
      let profileId = req.user.profile_id;

      if (!profileId && req.user.id) {
        const profile = await ProfileSequelize.findOne({ where: { user_id: req.user.id } });
        if (profile) {
          profileId = profile.id;
        }
      }

      if (!profileId) {
        res.status(401).json({ error: 'Sessão desatualizada. Por favor, faça login novamente.' });
        return;
      }
      const projects = await this.service.getClientProjects(profileId);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async addTaskAttachment(req: any, res: Response): Promise<void> {
    try {
      let profileId = req.user.profile_id;

      if (!profileId && req.user.id) {
        const profile = await ProfileSequelize.findOne({ where: { user_id: req.user.id } });
        if (profile) {
          profileId = profile.id;
        }
      }

      if (!profileId) {
        res.status(401).json({ error: 'Sessão desatualizada. Por favor, faça login novamente.' });
        return;
      }
      const { taskId } = req.params;
      const { url } = req.body;

      if (!url) {
        res.status(400).json({ error: 'A URL do anexo é obrigatória.' });
        return;
      }

      const task = await this.service.addAttachmentToTask(taskId, profileId, url);
      
      if (!task) {
        res.status(404).json({ error: 'Tarefa não encontrada ou acesso negado.' });
        return;
      }

      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
