import request from 'supertest';
import { app } from '../../src/server';

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

jest.mock('../../src/repositories/database/SequelizeUserRepository', () => {
  return {
    SequelizeUserRepository: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockResolvedValue({
          id: 'user-client-1',
          email: 'client@company.com',
          role: 'client'
        }),
        findByEmail: jest.fn().mockResolvedValue(null)
      };
    })
  };
});

jest.mock('../../src/repositories/database/SequelizeClientRepository', () => {
  return {
    SequelizeClientRepository: jest.fn().mockImplementation(() => {
      return {
        list: jest.fn().mockResolvedValue([])
      };
    })
  };
});

jest.mock('../../src/repositories/database/SequelizeServiceRepository', () => {
  return {
    SequelizeServiceRepository: jest.fn().mockImplementation(() => {
      return {
        createService: jest.fn().mockResolvedValue({
          id: 'service-1',
          name: 'SEO Management',
          description: 'Monthly SEO services',
          price: 500
        })
      };
    })
  };
});

describe('Integration: Admin Clients and Services E2E', () => {
  it('should successfully create a client (POST /api/v1/admin/clients)', async () => {
    const res = await request(app)
      .post('/api/v1/admin/clients')
      .set('Authorization', 'Bearer mocked-admin-token')
      .send({
        email: 'client@company.com',
        name: 'John Doe',
        company_name: 'Company Inc',
        tax_id: '12345678901',
        category: 'Technology'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('client@company.com');
  });

  it('should successfully create a service (POST /api/v1/admin/services)', async () => {
    const res = await request(app)
      .post('/api/v1/admin/services')
      .set('Authorization', 'Bearer mocked-admin-token')
      .send({
        name: 'SEO Management',
        description: 'Monthly SEO services',
        price: 500
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('SEO Management');
  });
});
