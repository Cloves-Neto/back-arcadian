import { StatsServiceImpl } from '../../../../../src/usecases/admin/stats/service/StatsServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeStatsRepository', () => {
  return {
    SequelizeStatsRepository: jest.fn().mockImplementation(() => {
      return {
        getStats: jest.fn().mockResolvedValue({
          totalClients: 10,
          totalRevenue: 5000,
          activeContracts: 5
        })
      };
    })
  };
});

describe('StatsServiceImpl', () => {
  let statsService: StatsServiceImpl;

  beforeEach(() => {
    statsService = new StatsServiceImpl();
  });

  it('should get global stats', async () => {
    const stats = await statsService.execute();
    expect(stats).toEqual({
      totalClients: 10,
      totalRevenue: 5000,
      activeContracts: 5
    });
  });
});
