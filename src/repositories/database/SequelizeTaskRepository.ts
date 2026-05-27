import { TaskRepository } from '../TaskRepository';
import { TaskSequelize } from '../../models/database/SequelizeTask';

export class SequelizeTaskRepository implements TaskRepository {
  async findAll(): Promise<any[]> {
    const tasks = await TaskSequelize.findAll({ order: [['created_at', 'DESC']] });
    return tasks.map(t => t.toJSON());
  }

  async findById(id: string): Promise<any> {
    const task = await TaskSequelize.findByPk(id);
    return task ? task.toJSON() : null;
  }

  async create(data: any): Promise<any> {
    const task = await TaskSequelize.create(data);
    return task.toJSON();
  }

  async update(id: string, data: any): Promise<any> {
    const task = await TaskSequelize.findByPk(id);
    if (!task) throw new Error('Task not found');
    await task.update(data);
    return task.toJSON();
  }

  async delete(id: string): Promise<void> {
    const task = await TaskSequelize.findByPk(id);
    if (!task) throw new Error('Task not found');
    await task.destroy();
  }
}
