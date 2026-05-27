import { VerifyTokenServiceImpl } from '../../../../src/usecases/auth/verify-token/service/VerifyTokenServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeUserRepository', () => {
  return {
    SequelizeUserRepository: jest.fn().mockImplementation(() => {
      return {
        findByInvitationToken: jest.fn().mockImplementation((token) => {
          if (token === 'valid-token') {
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 2);
            return Promise.resolve({
              id: 'user-123',
              token_expires_at: futureDate.toISOString(),
              privileges: '["admin_read"]'
            });
          }
          if (token === 'expired-token') {
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 2);
            return Promise.resolve({
              id: 'user-456',
              token_expires_at: pastDate.toISOString(),
              privileges: '["client"]'
            });
          }
          return Promise.resolve(null);
        })
      };
    })
  };
});

describe('VerifyTokenServiceImpl', () => {
  let verifyTokenService: VerifyTokenServiceImpl;

  beforeEach(() => {
    verifyTokenService = new VerifyTokenServiceImpl();
  });

  it('should verify a valid token and parse privileges', async () => {
    const result = await verifyTokenService.execute('valid-token');
    expect(result.id).toBe('user-123');
    expect(result.privileges).toEqual(['admin_read']);
  });

  it('should reject an invalid token', async () => {
    await expect(verifyTokenService.execute('invalid-token')).rejects.toThrow('Token inválido ou não encontrado.');
  });

  it('should reject an expired token', async () => {
    await expect(verifyTokenService.execute('expired-token')).rejects.toThrow('Este convite expirou.');
  });
});
