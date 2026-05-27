import { ProfileSequelize } from '../../models/database/SequelizeProfile';
import { ProfileRepository } from '../ProfileRepository';

export class SequelizeProfileRepository implements ProfileRepository {
  async findByUserId(userId: string): Promise<any> {
    const res = await ProfileSequelize.findOne({ where: { user_id: userId } });
    return res ? res.get({ plain: true }) as any : null;
  }

  async upsert(userId: string, data: any): Promise<any> {
    const [profile] = await ProfileSequelize.upsert({ user_id: userId, ...data });
    return profile.get({ plain: true }) as any;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<any> {
    const profile = await ProfileSequelize.findOne({ where: { user_id: userId } });
    if (profile) {
      await profile.update({ avatar_url: avatarUrl });
      return profile.get({ plain: true }) as any;
    }
    return null;
  }
}
