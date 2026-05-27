import { GetProfileService } from './GetProfileService';
import { SequelizeProfileRepository } from '../../../../repositories/database/SequelizeProfileRepository';

export default class GetProfileServiceImpl implements GetProfileService {
  private repository: SequelizeProfileRepository;

  constructor() {
    this.repository = new SequelizeProfileRepository();
  }

  async execute(userId: string) {
    return await this.repository.findByUserId(userId);
  }
}
