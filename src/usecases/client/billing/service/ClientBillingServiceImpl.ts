import { ClientBillingService } from './ClientBillingService';
import { ClientDashboardRepository } from '../../../../repositories/ClientDashboardRepository';
import { SequelizeClientDashboardRepository } from '../../../../repositories/database/SequelizeClientDashboardRepository';

export class ClientBillingServiceImpl implements ClientBillingService {
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
    
    // Busca os projetos vinculados aos contratos para associar às faturas
    const contractIds = contracts.map((c: any) => c.id);
    const projects = await this.repository.getProjectsByContractIds(contractIds);

    const projectsByContract: Record<string, any[]> = {};
    projects.forEach((proj: any) => {
      if (proj.contract_id) {
        if (!projectsByContract[proj.contract_id]) {
          projectsByContract[proj.contract_id] = [];
        }
        projectsByContract[proj.contract_id].push({
          id: proj.id,
          name: proj.name
        });
      }
    });
    
    // Extrai todas as parcelas de todos os contratos
    const allInstallments: any[] = [];
    
    contracts.forEach((contract: any) => {
      if (contract.installments && Array.isArray(contract.installments)) {
        contract.installments.forEach((inst: any) => {
          allInstallments.push({
            id: inst.id,
            contract_id: contract.id,
            contract_name: contract.name,
            installment_number: inst.installment_number,
            total_installments: inst.total_installments,
            value: parseFloat(inst.value),
            due_date: inst.due_date,
            status: inst.status,
            paid_date: inst.payment_date,
            paid_amount: inst.paid_amount ? parseFloat(inst.paid_amount) : null,
            projects: projectsByContract[contract.id] || [],
            created_at: inst.createdAt,
            updated_at: inst.updatedAt
          });
        });
      }
    });

    // Ordena por data de vencimento em ordem crescente (mais antigo/vence primeiro)
    allInstallments.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    return allInstallments;
  }
}

