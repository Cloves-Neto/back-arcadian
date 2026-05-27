import { ActivityLogSequelize } from '../../models/database/SequelizeActivityLog';
import { UserSequelize } from '../../models/database/SequelizeUser';

import { LogRepository } from '../LogRepository';

export class SequelizeLogRepository implements LogRepository {
  async list() {
    try {
      const logs = await ActivityLogSequelize.findAll({
        include: [{
          model: UserSequelize,
          as: 'user',
          attributes: ['email']
        }],
        order: [['created_at', 'DESC']],
        limit: 100
      });
      return logs.map(log => log.get({ plain: true }));
    } catch (error: any) {
      console.error('SequelizeLogRepository Error:', error.message);
      return []; 
    }
  }

  async record(data: {
    user_id?: string;
    action: string;
    details: string;
    ip_address?: string;
  }) {
    try {
      const { details, ...rest } = data;
      await ActivityLogSequelize.create({
        ...rest,
        metadata: { details }
      } as any);
    } catch (err) {
      console.error("Erro ao registrar log:", err);
    }
  }
}
