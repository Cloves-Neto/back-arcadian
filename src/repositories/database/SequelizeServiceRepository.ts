import { ServiceSequelize } from '../../models/database/SequelizeService';
import { SubscriptionSequelize } from '../../models/database/SequelizeSubscription';

import { ServiceRepository } from '../ServiceRepository';

export class SequelizeServiceRepository implements ServiceRepository {
  async listServices(): Promise<any[]> {
    const services = await ServiceSequelize.findAll({
      order: [['name', 'ASC']]
    });
    return services.map(s => s.get({ plain: true }));
  }

  async createService(data: any): Promise<any> {
    const service = await ServiceSequelize.create(data);
    return service.get({ plain: true });
  }

  async updateService(id: string, data: any): Promise<any> {
    const service = await ServiceSequelize.findByPk(id);
    if (!service) throw new Error('Service not found');
    await service.update(data);
    return service.get({ plain: true });
  }

  async deleteService(id: string): Promise<void> {
    const service = await ServiceSequelize.findByPk(id);
    if (service) {
      await service.destroy();
    }
  }

  async listSubscriptions(): Promise<any[]> {
    const subs = await SubscriptionSequelize.findAll({
      order: [['name', 'ASC']]
    });
    return subs.map(s => s.get({ plain: true }));
  }

  async createSubscription(data: any): Promise<any> {
    const sub = await SubscriptionSequelize.create(data);
    return sub.get({ plain: true });
  }

  async updateSubscription(id: string, data: any): Promise<any> {
    const sub = await SubscriptionSequelize.findByPk(id);
    if (!sub) throw new Error('Subscription not found');
    await sub.update(data);
    return sub.get({ plain: true });
  }

  async deleteSubscription(id: string): Promise<void> {
    const sub = await SubscriptionSequelize.findByPk(id);
    if (sub) {
      await sub.destroy();
    }
  }
}
