import { ProfileSequelize } from '../../../../models/database/SequelizeProfile';
import { ClientSequelize } from '../../../../models/database/SequelizeClient';

export interface ClientProfileService {
  getProfile(userId: string): Promise<any>;
  updateProfile(userId: string, data: any): Promise<any>;
}
