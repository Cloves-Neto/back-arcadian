import ChangePasswordServiceImpl from '../../../../src/usecases/auth/password/service/ChangePasswordServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeUserRepository', () => {
  return {
    SequelizeUserRepository: jest.fn().mockImplementation(() => {
      return {
        findByInvitationToken: jest.fn().mockImplementation((token) => {
          if (token === 'valid-token') {
            return Promise.resolve({ id: 'user-123' });
          }
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation((id, data) => {
          return Promise.resolve({ email: 'updated@example.com', ...data });
        })
      };
    })
  };
});

jest.mock('../../../../../src/utils/bcrypt', () => {
  return {
    __esModule: true,
    default: {
      hash: jest.fn().mockResolvedValue('hashed-new-password')
    }
  };
});

describe('ChangePasswordServiceImpl', () => {
  let changePasswordService: ChangePasswordServiceImpl;

  beforeEach(() => {
    changePasswordService = new ChangePasswordServiceImpl();
  });

  it('should change password using user ID', async () => {
    const result = await changePasswordService.execute('newPassword123', 'user-123');
    expect(result).toBe('updated@example.com');
  });

  it('should change password using valid token', async () => {
    const result = await changePasswordService.execute('newPassword123', undefined, 'valid-token');
    expect(result).toBe('updated@example.com');
  });

  it('should reject invalid token', async () => {
    await expect(changePasswordService.execute('newPassword123', undefined, 'invalid-token')).rejects.toThrow('Token inválido ou expirado.');
  });

  it('should reject if no ID and no token are provided', async () => {
    await expect(changePasswordService.execute('newPassword123')).rejects.toThrow('Usuário não identificado.');
  });
});
