import GetProfileServiceImpl from '../../../../../src/usecases/profiles/get/service/GetProfileServiceImpl';

jest.mock('../../../../../../src/repositories/database/SequelizeProfileRepository', () => {
  return {
    SequelizeProfileRepository: jest.fn().mockImplementation(() => {
      return {
        findByUserId: jest.fn().mockImplementation((userId) => {
          if (userId === 'user-123') {
            return Promise.resolve({ id: 'profile-1', full_name: 'Test Profile' });
          }
          return Promise.resolve(null);
        })
      };
    })
  };
});

describe('GetProfileServiceImpl', () => {
  let getProfileService: GetProfileServiceImpl;

  beforeEach(() => {
    getProfileService = new GetProfileServiceImpl();
  });

  it('should get profile by user id', async () => {
    const result = await getProfileService.execute('user-123');
    expect(result).toEqual({ id: 'profile-1', full_name: 'Test Profile' });
  });

  it('should return null if profile not found', async () => {
    const result = await getProfileService.execute('user-404');
    expect(result).toBeNull();
  });
});
