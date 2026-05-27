import { Request, Response } from 'express';
import TaskService from '../services/TaskService';
import TaskServiceImpl from '../services/TaskServiceImpl';

export default class TaskController {
  private service: TaskService;

  constructor() {
    this.service = new TaskServiceImpl();
  }

  public async list(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.service.list();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.service.getById(req.params.id as string);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.service.create(req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.service.update(req.params.id as string, req.body);
      res.json(task);
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
