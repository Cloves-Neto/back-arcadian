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
      verify: jest.fn().mockReturnValue({ id: 'admin-id', role: 'admin' }),
      generate: jest.fn().mockReturnValue('mocked-token')
    }
  };
});

jest.mock('../../src/repositories/database/SequelizeContractRepository', () => {
  return {
    SequelizeContractRepository: jest.fn().mockImplementation(() => {
      return {
        createContract: jest.fn().mockResolvedValue({
          id: 'contract-e2e',
          client_id: 'client-1',
          total_value: 1200,
          installments_count: 12,
          installment_value: 100
        }),
        createContractItems: jest.fn().mockResolvedValue([]),
      };
    })
  };
});

jest.mock('../../src/repositories/database/SequelizeBillingRepository', () => {
  return {
    SequelizeBillingRepository: jest.fn().mockImplementation(() => {
      return {
        bulkCreateInstallments: jest.fn().mockResolvedValue([]),
        updateInstallment: jest.fn().mockResolvedValue({
          id: 'inst-1',
          status: 'paid'
        }),
        findInstallmentById: jest.fn().mockResolvedValue({
          id: 'inst-1',
          contract_id: 'contract-e2e',
          value: 100,
          installment_number: 1,
          due_date: new Date()
        }),
        findContractWithItems: jest.fn().mockResolvedValue(null)
      };
    })
  };
});

describe('Integration: Admin Contracts and Billing E2E', () => {
  it('should successfully create a contract (POST /api/v1/admin/contracts)', async () => {
    const res = await request(app)
      .post('/api/v1/admin/contracts')
      .set('Authorization', 'Bearer mocked-admin-token')
      .send({
        client_id: 'client-1',
        total_value: 1200,
        installments_count: 12,
        installment_value: 100,
        start_date: '2026-05-23'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('contract-e2e');
  });

  it('should successfully pay an installment (PATCH /api/v1/admin/billing/:id/status)', async () => {
    const res = await request(app)
      .patch('/api/v1/admin/billing/inst-1/status')
      .set('Authorization', 'Bearer mocked-admin-token')
      .send({
        status: 'paid'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('paid');
  });
});
