import { ProfileRepository } from '../../../src/repositories/ProfileRepository';
import { Profile } from '../../../src/models/database/Profile';

export class MockProfileRepository implements ProfileRepository {
  private profiles: Profile[] = [];

  async upsert(userId: string, data: Partial<Profile>): Promise<Profile> {
    const idx = this.profiles.findIndex(p => p.user_id === userId);
    if (idx !== -1) {
      this.profiles[idx] = { ...this.profiles[idx], ...data };
      return this.profiles[idx];
    }
    const newProfile = { id: `prof-${userId}`, user_id: userId, ...data } as Profile;
    this.profiles.push(newProfile);
    return newProfile;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<Profile> {
    return this.upsert(userId, { avatar_url: avatarUrl });
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profiles.find(p => p.user_id === userId) || null;
  }
}
