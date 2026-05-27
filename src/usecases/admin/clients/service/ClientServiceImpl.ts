import { ClientService } from './ClientService';
import { SequelizeClientRepository } from '../../../../repositories/database/SequelizeClientRepository';
import { UserServiceImpl } from '../../users/service/UserServiceImpl';
import { logger } from '../../../../utils/logger';

export class ClientServiceImpl implements ClientService {
  private repository: SequelizeClientRepository;
  private createUserService: UserServiceImpl;

  constructor() {
    this.repository = new SequelizeClientRepository();
    this.createUserService = new UserServiceImpl();
  }

  async list() {
    return await this.repository.list();
  }

  async create(data: any) {
    const user = await this.createUserService.create({
      email: data.email,
      full_name: data.name,
      role: 'client',
      client_data: {
        company_name: data.company_name || data.name,
        tax_id: data.tax_id,
        phone: data.phone || '',
        cep: data.cep || '',
        street: data.street || '',
        number: data.number || '',
        complement: data.complement || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        category: data.category
      }
    });

    logger.info(`Novo cliente/usuário criado com sucesso [ID: ${user.id}, Email: ${user.email}]`);

    return user;
  }

  async update(id: string, data: any) {
    return await this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }
}
