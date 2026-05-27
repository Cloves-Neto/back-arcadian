import LoginServiceImpl from '../../../../src/usecases/auth/login/service/LoginServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeUserRepository', () => {
  return {
    SequelizeUserRepository: jest.fn().mockImplementation(() => {
      return {
        findByEmail: jest.fn().mockImplementation((email) => {
          if (email === 'test@example.com') {
            return Promise.resolve({
              id: '123',
              email: 'test@example.com',
              password: 'hashed-password',
              role: 'admin',
              must_change_password: false
            });
          }
          return Promise.resolve(null);
        })
      };
    })
  };
});

jest.mock('../../../../../src/utils/bcrypt', () => {
  return {
    __esModule: true,
    default: {
      compare: jest.fn().mockImplementation((plain, hash) => Promise.resolve(plain === 'correct-password' && hash === 'hashed-password'))
    }
  };
});

jest.mock('../../../../../src/utils/jwt', () => {
  return {
    __esModule: true,
    default: {
      generate: jest.fn().mockReturnValue('mocked-jwt-token')
    }
  };
});

describe('LoginServiceImpl', () => {
  let loginService: LoginServiceImpl;

  beforeEach(() => {
    loginService = new LoginServiceImpl();
  });

  it('should authenticate a valid user', async () => {
    const result = await loginService.authenticate('test@example.com', 'correct-password');
    expect(result).not.toBeNull();
    expect(result?.token).toBe('mocked-jwt-token');
    expect(result?.user.email).toBe('test@example.com');
  });

  it('should reject invalid password', async () => {
    const result = await loginService.authenticate('test@example.com', 'wrong-password');
    expect(result).toBeNull();
  });

  it('should reject non-existent user', async () => {
    const result = await loginService.authenticate('nonexistent@example.com', 'any-password');
    expect(result).toBeNull();
  });
});
