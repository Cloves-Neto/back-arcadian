import { Service } from '../models/database/Service';
import { Subscription } from '../models/database/Subscription';

export interface ServiceRepository {
  listServices(): Promise<Service[]>;
  createService(data: Partial<Service>): Promise<Service>;
  updateService(id: string, data: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  listSubscriptions(): Promise<Subscription[]>;
  createSubscription(data: Partial<Subscription>): Promise<Subscription>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription>;
  deleteSubscription(id: string): Promise<void>;
}
