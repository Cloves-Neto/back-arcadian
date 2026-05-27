import UpdateProfileServiceImpl from '../../../../../src/usecases/profiles/update/service/UpdateProfileServiceImpl';

jest.mock('../../../../../../src/repositories/database/SequelizeProfileRepository', () => {
  return {
    SequelizeProfileRepository: jest.fn().mockImplementation(() => {
      return {
        upsert: jest.fn().mockResolvedValue({ id: 'profile-1', full_name: 'Updated Name' }),
        updateAvatar: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

describe('UpdateProfileServiceImpl', () => {
  let updateProfileService: UpdateProfileServiceImpl;

  beforeEach(() => {
    updateProfileService = new UpdateProfileServiceImpl();
  });

  it('should upsert profile data', async () => {
    const result = await updateProfileService.execute('user-123', { full_name: 'Updated Name' });
    expect(result).toEqual({ id: 'profile-1', full_name: 'Updated Name' });
  });

  it('should update avatar url', async () => {
    await expect(updateProfileService.updateAvatar('user-123', 'http://example.com/avatar.png')).resolves.toBeUndefined();
  });
});
