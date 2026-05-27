// @ts-nocheck
import { StatsRepository } from '../../../src/repositories/StatsRepository';

export class MockStatsRepository implements StatsRepository {
  public stats: any = {
    totalClients: 0,
    totalRevenue: 0,
    activeContracts: 0
  };

  async getGlobalStats(): Promise<any> {
    return this.stats;
  }
}
