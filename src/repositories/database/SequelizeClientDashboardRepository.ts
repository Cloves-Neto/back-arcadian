import { ContractSequelize } from '../../models/database/SequelizeContract';
import { InstallmentSequelize } from '../../models/database/SequelizeInstallment';
import { ClientSequelize } from '../../models/database/SequelizeClient';
import { ProfileSequelize } from '../../models/database/SequelizeProfile';
import { UserSequelize } from '../../models/database/SequelizeUser';
import { ContractItemSequelize } from '../../models/database/SequelizeContractItem';
import { ServiceSequelize } from '../../models/database/SequelizeService';
import { SubscriptionSequelize } from '../../models/database/SequelizeSubscription';
import { supabase } from '../../utils/supabase';
import { ClientDashboardRepository } from '../ClientDashboardRepository';

export class SequelizeClientDashboardRepository implements ClientDashboardRepository {
  async getClientProfileWithAssociations(userId: string): Promise<any> {
    const res = await ProfileSequelize.findOne({
      where: { user_id: userId },
      include: [
        { model: ClientSequelize, as: 'client' },
        { model: UserSequelize, as: 'user' }
      ]
    });
    return res ? res.get({ plain: true }) as any : null;
  }

  async getActiveContractsWithInstallments(clientId: string): Promise<any> {
    const res = await ContractSequelize.findAll({
      where: { client_id: clientId },
      include: [
        { model: InstallmentSequelize, as: 'installments' },
        {
          model: ContractItemSequelize as any,
          as: 'items',
          include: [
            { model: ServiceSequelize, as: 'service' },
            { model: SubscriptionSequelize, as: 'subscription' }
          ]
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [{ model: InstallmentSequelize, as: 'installments' }, 'installment_number', 'ASC']
      ]
    });
    return res.map(r => r.get({ plain: true })) as any;
  }

  async getProjectsByContractIds(contractIds: string[]): Promise<any> {
    if (contractIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .in('contract_id', contractIds);

    if (error) {
      console.warn('Error fetching projects from Supabase:', error);
      return [];
    }

    return data || [];
  }
}
