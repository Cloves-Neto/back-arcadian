import { ClientData } from './database/SequelizeClientRepository';

export interface ClientRepository {
  list(): Promise<ClientData[]>;
  create(data: { profile_id: string; company_name: string; company_category: string }): Promise<any>;
  update(id: string, data: Partial<any>): Promise<any>;
  delete(id: string): Promise<void>;
}
