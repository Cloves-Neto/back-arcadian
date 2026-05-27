export interface ServiceService {
  listServices(): Promise<any>;
  createService(data: any): Promise<any>;
  updateService(id: string, data: any): Promise<any>;
  deleteService(id: string): Promise<void>;

  listSubscriptions(): Promise<any>;
  createSubscription(data: any): Promise<any>;
  updateSubscription(id: string, data: any): Promise<any>;
  deleteSubscription(id: string): Promise<void>;
}
