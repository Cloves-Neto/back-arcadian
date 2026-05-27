import { ClientContractService } from './ClientContractService';
import { ClientDashboardRepository } from '../../../../repositories/ClientDashboardRepository';
import { SequelizeClientDashboardRepository } from '../../../../repositories/database/SequelizeClientDashboardRepository';

export class ClientContractServiceImpl implements ClientContractService {
  private repository: ClientDashboardRepository;

  constructor() {
    this.repository = new SequelizeClientDashboardRepository();
  }

  async listByClient(userId: string) {
    const profile = await this.repository.getClientProfileWithAssociations(userId);
    
    if (!profile) {
      throw new Error('Profile not found');
    }

    const clientId = (profile as any).client?.id;
    if (!clientId) {
      throw new Error('Client record not found');
    }

    const contracts = await this.repository.getActiveContractsWithInstallments(clientId);
    
    return contracts.map((c: any) => ({
      id: c.id,
      name: c.name,
      total_value: parseFloat(c.total_value as any),
      upfront_value: parseFloat(c.upfront_value as any),
      upfront_paid: c.upfront_paid,
      installments_count: c.installments_count,
      installment_value: parseFloat(c.installment_value as any),
      status: c.status,
      billing_frequency: c.billing_frequency,
      billing_day: c.billing_day,
      start_date: c.start_date,
      items: c.items || [],
      installments: c.installments || []
    }));
  }
}
