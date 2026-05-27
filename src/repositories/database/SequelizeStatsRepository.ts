import { UserSequelize } from '../../models/database/SequelizeUser';
import { ClientSequelize } from '../../models/database/SequelizeClient';
import { ServiceSequelize } from '../../models/database/SequelizeService';
import { PaymentSequelize } from '../../models/database/SequelizePayment';
import { TaskSequelize } from '../../models/database/SequelizeTask';
import { Op } from 'sequelize';

import { StatsRepository } from '../StatsRepository';

export class SequelizeStatsRepository implements StatsRepository {
  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const usersCount = await UserSequelize.count();
    const clientsCount = await ClientSequelize.count();
    const servicesCount = await ServiceSequelize.count();

    const payments = await PaymentSequelize.findAll({
      where: { status: 'paid' },
      attributes: ['amount']
    });
    
    const revenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const pendingTasks = await TaskSequelize.findAll({
      where: {
        status: { [Op.ne]: 'done' },
        due_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      attributes: ['due_date']
    });

    const pendingStepsCount = pendingTasks.length;
    const dots = [...new Set(pendingTasks.map(t => {
      if (!t.due_date) return null as any;
      return new Date(t.due_date).toISOString().split('T')[0];
    }).filter(Boolean) as string[])];

    return {
      total_users: usersCount || 0,
      total_clients: clientsCount || 0,
      total_services: servicesCount || 0,
      total_revenue: revenue || 0,
      pending_steps_this_month: pendingStepsCount || 0,
      calendar_dots: dots || []
    };
  }
}
