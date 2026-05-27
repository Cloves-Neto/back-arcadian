import { ClientProfileServiceImpl } from '../../../../../src/usecases/client/profile/service/ClientProfileServiceImpl';

jest.mock('../../../../../src/models/database/SequelizeProfile', () => {
  return {
    ProfileSequelize: {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.user_id === 'user-123') {
          return Promise.resolve({
            get: () => ({ id: 'profile-1', full_name: 'Test User' }),
            client: { get: () => ({ id: 'client-1' }) }
          });
        }
        return Promise.resolve(null);
      }),
      findOrCreate: jest.fn().mockResolvedValue([
        {
          id: 'profile-1',
          full_name: 'Test User',
          update: jest.fn().mockResolvedValue(true),
          get: () => ({ id: 'profile-1', full_name: 'Test User' })
        }
      ])
    }
  };
});

jest.mock('../../../../../src/models/database/SequelizeClient', () => {
  return {
    ClientSequelize: {
      findOrCreate: jest.fn().mockResolvedValue([
        {
          id: 'client-1',
          company_name: 'Test Co.',
          update: jest.fn().mockResolvedValue(true),
          get: () => ({ id: 'client-1', company_name: 'Test Co.' })
        }
      ])
    }
  };
});

jest.mock('../../../../../src/models/database/SequelizeUser', () => {
  return {
    UserSequelize: {
      update: jest.fn().mockResolvedValue([1])
    }
  };
});

describe('ClientProfileServiceImpl', () => {
  let profileService: ClientProfileServiceImpl;

  beforeEach(() => {
    profileService = new ClientProfileServiceImpl();
  });

  it('should get profile for a user', async () => {
    const result = await profileService.getProfile('user-123');
    expect(result.id).toBe('profile-1');
    expect(result.client.id).toBe('client-1');
  });

  it('should throw error if profile not found on getProfile', async () => {
    await expect(profileService.getProfile('user-404')).rejects.toThrow('Profile not found');
  });

  it('should update profile and create/update client associations', async () => {
    const result = await profileService.updateProfile('user-123', {
      full_name: 'New Name',
      tax_id: '123.456.789-00',
      company_name: 'New Co.'
    });

    expect(result.id).toBe('profile-1');
    expect(result.client.id).toBe('client-1');
  });
});
