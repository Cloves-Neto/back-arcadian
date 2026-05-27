import { ClientDashboardService } from './ClientDashboardService';
import { ClientDashboardRepository } from '../../../../repositories/ClientDashboardRepository';
import { SequelizeClientDashboardRepository } from '../../../../repositories/database/SequelizeClientDashboardRepository';

export class ClientDashboardServiceImpl implements ClientDashboardService {
  private repository: ClientDashboardRepository;

  constructor() {
    this.repository = new SequelizeClientDashboardRepository();
  }

  async execute(userId: string) {
    try {
      const profile = await this.repository.getClientProfileWithAssociations(userId);

      if (!profile) {
        throw new Error('Profile not found');
      }

      const clientId = (profile as any).client?.id;
      if (!clientId) {
        throw new Error('Client record not found');
      }

      const contracts = await this.repository.getActiveContractsWithInstallments(clientId);
      const contractIds = contracts.map((c: any) => c.id);
      const projects = await this.repository.getProjectsByContractIds(contractIds);

      const stats = this.calculateStats(contracts, projects);
      const recentActivity = this.getRecentActivity(contracts, projects);

      return {
        success: true,
        data: {
          profile: {
            id: profile.id,
            user_id: profile.user_id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            phone: profile.phone,
            tax_id: profile.tax_id,
            email: (profile as any).user?.email,
            address: `${profile.street || ''}, ${profile.number || ''} - ${profile.city || ''}`,
            cep: profile.cep,
            street: profile.street,
            number: profile.number,
            complement: profile.complement,
            neighborhood: profile.neighborhood,
            city: profile.city,
            onboarding: profile.onboarding,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          },
          client: (profile as any).client ? {
            id: (profile as any).client.id,
            profile_id: (profile as any).client.profile_id,
            company_name: (profile as any).client.company_name,
            company_category: (profile as any).client.company_category,
            service_ids: (profile as any).client.service_ids,
            package_ids: (profile as any).client.package_ids,
            created_at: (profile as any).client.createdAt,
            updated_at: (profile as any).client.updatedAt
          } : null,
          contracts: contracts.map((c: any) => ({
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
            items: c.items ? c.items.map((i: any) => ({ 
              item_type: i.item_type, 
              name: i.service?.name || i.subscription?.name || 'Serviço Contratado' 
            })) : [],
            installments: c.installments ? c.installments.map((inst: any) => ({
              id: inst.id,
              number: inst.installment_number,
              value: parseFloat(inst.value as any),
              due_date: inst.due_date,
              status: inst.status,
              paid_date: inst.paid_date,
              paid_amount: inst.paid_amount ? parseFloat(inst.paid_amount as any) : null,
              created_at: inst.createdAt,
              updated_at: inst.updatedAt
            })) : []
          })),
          projects: projects.slice(0, 5).map((p: any) => ({
            id: p.id,
            contract_id: p.contract_id,
            name: p.name,
            status: p.status,
            progress: p.progress,
            created_at: p.created_at,
            updated_at: p.updated_at
          })),
          stats,
          recentActivity
        }
      };
    } catch (error: any) {
      console.error('Error fetching client dashboard:', error);
      throw error;
    }
  }

  private calculateStats(contracts: any[], projects: any[]) {
    const activeProjects = projects.filter(p => p.status !== 'Finalizado').length;
    let unpaidInvoices = 0;
    let totalUnpaidValue = 0;

    contracts.forEach((contract: any) => {
      if (!contract.upfront_paid && contract.upfront_value > 0) {
        unpaidInvoices += 1;
        totalUnpaidValue += parseFloat(contract.upfront_value);
      }

      if (contract.installments) {
        contract.installments.forEach((inst: any) => {
          if (inst.status !== 'paid') {
            unpaidInvoices += 1;
            totalUnpaidValue += parseFloat(inst.value);
          }
        });
      }
    });

    const totalContractValue = contracts.reduce((sum, c) => sum + parseFloat(c.total_value), 0);

    const totalPaidValue = contracts.reduce((sum, c) => {
      let paid = c.upfront_paid ? parseFloat(c.upfront_value) : 0;
      if (c.installments) {
        paid += c.installments
          .filter((i: any) => i.status === 'paid')
          .reduce((s: number, i: any) => s + parseFloat(i.value), 0);
      }
      return sum + paid;
    }, 0);

    return {
      active_projects: activeProjects,
      total_contracts: contracts.length,
      total_contract_value: totalContractValue,
      total_paid_value: totalPaidValue,
      unpaid_invoices: unpaidInvoices,
      total_unpaid_value: totalUnpaidValue,
      projects_count: projects.length
    };
  }

  private getRecentActivity(contracts: any[], projects: any[]) {
    const activities: any[] = [];

    contracts.forEach((c: any) => {
      if (c.installments) {
        c.installments
          .filter((i: any) => i.updatedAt)
          .slice(0, 3)
          .forEach((inst: any) => {
            activities.push({
              type: 'installment',
              title: `${c.name} - Parcela ${inst.installment_number}`,
              status: inst.status,
              date: inst.updatedAt
            });
          });
      }
    });

    projects
      .filter((p: any) => p.updated_at)
      .slice(0, 3)
      .forEach((p: any) => {
        activities.push({
          type: 'project',
          title: p.name,
          status: p.status,
          date: p.updated_at
        });
      });

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }
}
