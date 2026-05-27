import { UserServiceImpl } from '../../../src/usecases/admin/users/service/UserServiceImpl';
import { MockUserRepository } from '../mocks/MockUserRepository';
import { MockProfileRepository } from '../mocks/MockProfileRepository';
import { MockClientRepository } from '../mocks/MockClientRepository';

// Mock dependencies
jest.mock('../../../src/repositories/database/SequelizeUserRepository', () => {
  return { SequelizeUserRepository: jest.fn().mockImplementation(() => new MockUserRepository()) };
});
jest.mock('../../../src/repositories/database/SequelizeProfileRepository', () => {
  return { SequelizeProfileRepository: jest.fn().mockImplementation(() => new MockProfileRepository()) };
});
jest.mock('../../../src/repositories/database/SequelizeClientRepository', () => {
  return { SequelizeClientRepository: jest.fn().mockImplementation(() => new MockClientRepository()) };
});
jest.mock('../../../src/usecases/admin/logs/service/LogServiceImpl', () => {
  return { LogServiceImpl: jest.fn().mockImplementation(() => ({ record: jest.fn() })) };
});
jest.mock('../../../src/utils/EmailService', () => ({
  EmailService: { sendInvitation: jest.fn() }
}));

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl;

  beforeEach(() => {
    userService = new UserServiceImpl();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an admin user successfully', async () => {
      const data = {
        email: 'admin@test.com',
        full_name: 'Admin Test',
        role: 'admin',
        ddd: '11',
        phone: '987654321',
        privileges: ['all']
      };

      const user = await userService.create(data);

      expect(user).toBeDefined();
      expect(user.email).toBe('admin@test.com');
      expect(user.role).toBe('admin');
      expect((user as any).password).toBeUndefined(); // Password should not be returned
    });

    it('should throw an error for invalid email', async () => {
      const data = {
        email: 'invalid-email',
        full_name: 'Admin Test',
        role: 'admin',
        ddd: '11',
        phone: '987654321',
        privileges: ['all']
      };

      await expect(userService.create(data)).rejects.toThrow('Formato de e-mail inválido.');
    });

    it('should throw an error for missing privileges on admin', async () => {
      const data = {
        email: 'admin@test.com',
        full_name: 'Admin Test',
        role: 'admin',
        ddd: '11',
        phone: '987654321'
        // privileges is missing
      };

      await expect(userService.create(data)).rejects.toThrow('Selecione pelo menos um privilégio para o administrador.');
    });
  });
});
