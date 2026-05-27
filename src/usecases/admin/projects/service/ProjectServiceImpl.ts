import ProjectService from './ProjectService';
import ProjectRepository from '../repository/ProjectRepository';

export default class ProjectServiceImpl implements ProjectService {
  private repository: ProjectRepository;

  constructor() {
    this.repository = new ProjectRepository();
  }

  public async create(data: any): Promise<any> {
    return this.repository.create(data);
  }

  public async list(): Promise<any[]> {
    return this.repository.findAll();
  }

  public async getById(id: string): Promise<any | null> {
    return this.repository.findById(id);
  }

  public async update(id: string, data: any): Promise<any | null> {
    return this.repository.update(id, data);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
