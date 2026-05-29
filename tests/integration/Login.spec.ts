import request from 'supertest';
import { app } from '../../src/server';

// Mock DB connection
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

// Mock the UserRepository to simulate an existing user
jest.mock('../../src/repositories/database/SequelizeUserRepository', () => {
  return {
    SequelizeUserRepository: jest.fn().mockImplementation(() => {
      return {
        findByEmail: jest.fn().mockImplementation((email) => {
          if (email === 'test@login.com') {
            return Promise.resolve({
              id: 'mock-user-id',
              email: 'test@login.com',
              // hash of 'Password123!'
              password: '$2a$12$Kk0Gf1.xJ4n.q1sE6aYc6eO2K6Wv/7UvM3R1n6pY4qT0gM9gN6f2C',
              role: 'admin',
              must_change_password: false,
              is_admin_created: false
            });
          }
          return Promise.resolve(null);
        }),
        update: jest.fn()
      };
    })
  };
});

// We must also mock ProfileRepository for the login service
jest.mock('../../src/repositories/database/SequelizeProfileRepository', () => {
  return {
    SequelizeProfileRepository: jest.fn().mockImplementation(() => {
      return {
        findByUserId: jest.fn().mockResolvedValue({
          id: 'mock-profile-id',
          user_id: 'mock-user-id',
          full_name: 'Test Login User'
        })
      };
    })
  };
});

jest.mock('../../src/utils/bcrypt', () => {
  return {
    __esModule: true,
    default: {
      compare: jest.fn().mockImplementation((plain, hash) => {
        return plain === 'Password123!';
      })
    }
  };
});

describe('POST /api/v1/auth/login', () => {
  it('should authenticate a valid user and return a token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@login.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('test@login.com');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@login.com',
        password: 'WrongPassword'
      });

    expect(res.status).toBe(401);
  });
});
