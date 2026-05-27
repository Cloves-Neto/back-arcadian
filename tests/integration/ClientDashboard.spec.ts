import request from 'supertest';
import app from '../../src/app';

jest.mock('../../src/config/database/SequelizeSingletonConnection', () => {
  return {
    SequelizeSingletonConnection: {
      getInstance: jest.fn().mockResolvedValue({
        authenticate: jest.fn(),
        sync: jest.fn()
      })
    }
  };
});

jest.mock('../../src/utils/jwt', () => {
  return {
    __esModule: true,
    default: {
      verify: jest.fn().mockReturnValue({ id: 'user-123', role: 'client' }),
      generate: jest.fn().mockReturnValue('mocked-token')
    }
  };
});

jest.mock('../../src/repositories/database/SequelizeClientDashboardRepository', () => {
  return {
    SequelizeClientDashboardRepository: jest.fn().mockImplementation(() => {
      return {
        getClientProfileWithAssociations: jest.fn().mockResolvedValue({
          id: 'profile-1',
          user_id: 'user-123',
          full_name: 'Test Client User',
          client: {
            id: 'client-1',
            company_name: 'Client Company'
          }
        }),
        getActiveContractsWithInstallments: jest.fn().mockResolvedValue([
          {
            id: 'contract-1',
            total_value: 1000,
            upfront_value: 0,
            installments: []
          }
        ]),
        getProjectsByContractIds: jest.fn().mockResolvedValue([])
      };
    })
  };
});

describe('Integration: Client Dashboard E2E', () => {
  it('should retrieve dashboard data (GET /api/v1/client/dashboard)', async () => {
    const res = await request(app)
      .get('/api/v1/client/dashboard')
      .set('Authorization', 'Bearer mocked-client-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.full_name).toBe('Test Client User');
    expect(res.body.data.client.company_name).toBe('Client Company');
    expect(res.body.data.contracts).toHaveLength(1);
    expect(res.body.data.contracts[0].id).toBe('contract-1');
  });

  it('should block unauthenticated access', async () => {
    const res = await request(app)
      .get('/api/v1/client/dashboard');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
