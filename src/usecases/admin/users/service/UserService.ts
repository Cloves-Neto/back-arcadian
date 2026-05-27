import { User } from '../../../../models/database/User';

export interface UserService {
  create(data: { 
    email: string; 
    full_name: string; 
    role: 'admin' | 'client'; 
    privileges?: string[];
    ddd?: string;
    phone?: string;
    client_data?: {
      company_name: string;
      tax_id: string;
      phone: string;
      phone_ddd?: string;
      phone_number?: string;
      cep: string;
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      category: string;
    }
  }): Promise<User>;
  update(userId: string, data: { full_name?: string, role?: string, privileges?: string[] }): Promise<User>;
  delete(userId: string): Promise<boolean>;
  list(): Promise<User[]>;
  find(userId: string): Promise<User | null>;
}
