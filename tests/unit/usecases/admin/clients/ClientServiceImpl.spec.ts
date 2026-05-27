import { ClientServiceImpl } from '../../../../../src/usecases/admin/clients/service/ClientServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeClientRepository', () => {
  return {
    SequelizeClientRepository: jest.fn().mockImplementation(() => {
      return {
        list: jest.fn().mockResolvedValue([{ id: 'client-1' }]),
        update: jest.fn().mockResolvedValue({ id: 'client-1', company_name: 'Updated Co.' }),
        delete: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

jest.mock('../../../../../src/usecases/admin/users/service/UserServiceImpl', () => {
  return {
    UserServiceImpl: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockResolvedValue({ id: 'user-1', email: 'client@domain.com' })
      };
    })
  };
});

describe('ClientServiceImpl', () => {
  let clientService: ClientServiceImpl;

  beforeEach(() => {
    clientService = new ClientServiceImpl();
  });

  it('should list clients', async () => {
    const clients = await clientService.list();
    expect(clients).toEqual([{ id: 'client-1' }]);
  });

  it('should create a client via user creation', async () => {
    const result = await clientService.create({
      email: 'client@domain.com',
      name: 'Client Name',
      company_name: 'Client Co.'
    });
    expect(result).toEqual({ id: 'user-1', email: 'client@domain.com' });
  });

  it('should update a client', async () => {
    const result = await clientService.update('client-1', { company_name: 'Updated Co.' });
    expect(result).toEqual({ id: 'client-1', company_name: 'Updated Co.' });
  });

  it('should delete a client', async () => {
    await expect(clientService.delete('client-1')).resolves.toBeUndefined();
  });
});
