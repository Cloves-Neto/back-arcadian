import { StatsService } from './StatsService';
import { SequelizeStatsRepository } from '../../../../repositories/database/SequelizeStatsRepository';

export class StatsServiceImpl implements StatsService {
  private repository: SequelizeStatsRepository;

  constructor() {
    this.repository = new SequelizeStatsRepository();
  }

  async execute() {
    return await this.repository.getStats();
  }
}
