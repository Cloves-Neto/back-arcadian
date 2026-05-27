import { ClientDashboardServiceImpl } from '../../../../../src/usecases/client/dashboard/service/ClientDashboardServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeClientDashboardRepository', () => {
  return {
    SequelizeClientDashboardRepository: jest.fn().mockImplementation(() => {
      return {
        getClientProfileWithAssociations: jest.fn().mockImplementation((userId) => {
          if (userId === 'user-123') {
            return Promise.resolve({
              id: 'profile-1',
              user_id: 'user-123',
              client: { id: 'client-1' }
            });
          }
          return Promise.resolve(null);
        }),
        getActiveContractsWithInstallments: jest.fn().mockResolvedValue([
          {
            id: 'contract-1',
            total_value: 1000,
            upfront_value: 100,
            upfront_paid: false,
            installments: [
              { status: 'pending', value: 900 }
            ]
          }
        ]),
        getProjectsByContractIds: jest.fn().mockResolvedValue([])
      };
    })
  };
});

describe('ClientDashboardServiceImpl', () => {
  let clientDashboardService: ClientDashboardServiceImpl;

  beforeEach(() => {
    clientDashboardService = new ClientDashboardServiceImpl();
  });

  it('should get client dashboard data and calculate stats', async () => {
    const result = await clientDashboardService.execute('user-123');
    expect(result.success).toBe(true);
    expect(result.data.profile.id).toBe('profile-1');
    expect(result.data.stats.total_contract_value).toBe(1000);
    expect(result.data.stats.total_unpaid_value).toBe(1000); // 100 upfront + 900 installment
  });

  it('should throw error if profile is not found', async () => {
    await expect(clientDashboardService.execute('user-404')).rejects.toThrow('Profile not found');
  });
});
