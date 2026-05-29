import { LogService } from './LogService';
import { SequelizeLogRepository } from '../../../../repositories/database/SequelizeLogRepository';

export class LogServiceImpl implements LogService {
  private repository: SequelizeLogRepository;

  constructor() {
    this.repository = new SequelizeLogRepository();
  }

  async executeList() {
    return await this.repository.list();
  }

  async record(data: {
    user_id?: string;
    action: string;
    details: string;
    ip_address?: string;
  }) {
    await this.repository.record(data);
  }
}
