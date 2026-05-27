import { Request, Response } from 'express';
import ProjectService from '../service/ProjectService';
import ProjectServiceImpl from '../service/ProjectServiceImpl';

export default class ProjectController {
  private service: ProjectService;

  constructor() {
    this.service = new ProjectServiceImpl();
  }

  public async list(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.service.list();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.service.getById(req.params.id as string);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.service.create(req.body);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.service.update(req.params.id as string, req.body);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.service.delete(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
