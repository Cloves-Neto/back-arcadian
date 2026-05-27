import TaskService from './TaskService';
import { SequelizeTaskRepository } from '../../../../repositories/database/SequelizeTaskRepository';
import { TaskRepository } from '../../../../repositories/TaskRepository';

export default class TaskServiceImpl implements TaskService {
  private repository: TaskRepository;

  constructor() {
    this.repository = new SequelizeTaskRepository();
  }

  async list(): Promise<any[]> {
    return await this.repository.findAll();
  }

  async getById(id: string): Promise<any> {
    return await this.repository.findById(id);
  }

  async create(data: any): Promise<any> {
    return await this.repository.create(data);
  }

  async update(id: string, data: any): Promise<any> {
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
