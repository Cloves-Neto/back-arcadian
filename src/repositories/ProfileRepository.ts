import { Profile } from '../models/database/Profile';

export interface ProfileRepository {
  upsert(userId: string, data: Partial<Profile>): Promise<Profile>;
  updateAvatar(userId: string, avatarUrl: string): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
}
