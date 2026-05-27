import { ServiceService } from './ServiceService';
import { SequelizeServiceRepository } from '../../../../repositories/database/SequelizeServiceRepository';

export class ServiceServiceImpl implements ServiceService {
  private repository: SequelizeServiceRepository;

  constructor() {
    this.repository = new SequelizeServiceRepository();
  }

  async listServices() {
    return await this.repository.listServices();
  }

  async createService(data: any) {
    return await this.repository.createService(data);
  }

  async updateService(id: string, data: any) {
    return await this.repository.updateService(id, data);
  }

  async deleteService(id: string) {
    await this.repository.deleteService(id);
  }

  async listSubscriptions() {
    return await this.repository.listSubscriptions();
  }

  async createSubscription(data: any) {
    return await this.repository.createSubscription(data);
  }

  async updateSubscription(id: string, data: any) {
    return await this.repository.updateSubscription(id, data);
  }

  async deleteSubscription(id: string) {
    await this.repository.deleteSubscription(id);
  }
}
