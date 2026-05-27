import { UpdateProfileService } from './UpdateProfileService';
import { SequelizeProfileRepository } from '../../../../repositories/database/SequelizeProfileRepository';

export default class UpdateProfileServiceImpl implements UpdateProfileService {
  private repository: SequelizeProfileRepository;

  constructor() {
    this.repository = new SequelizeProfileRepository();
  }

  async execute(userId: string, data: any) {
    return await this.repository.upsert(userId, data);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    await this.repository.updateAvatar(userId, avatarUrl);
  }
}
