import { ContractService } from './ContractService';
import { ContractRepository } from '../../../../repositories/ContractRepository';
import { SequelizeContractRepository } from '../../../../repositories/database/SequelizeContractRepository';
import { BillingServiceImpl } from '../../billing/service/BillingServiceImpl';
import { logger } from '../../../../utils/logger';

export class ContractServiceImpl implements ContractService {
  private repository: ContractRepository;
  private billingService: BillingServiceImpl;

  constructor() {
    this.repository = new SequelizeContractRepository();
    this.billingService = new BillingServiceImpl();
  }

  async createFullContract(data: any) {
    const total_value = Number(data.total_value || 0);
    const upfront_value = Number(data.upfront_value || 0);
    const installment_value = Number(data.installment_value || 0);
    const installments_count = Number(data.installments_count || 1);
    const setup_amount = Number(data.setup_amount || data.upfront_value || 0);

    if (!data.client_id) {
      throw new Error("ID do cliente é obrigatório para gerar o vínculo.");
    }

    const contractData = {
      client_id: data.client_id,
      name: data.name || null,
      total_value: isNaN(total_value) ? 0 : total_value,
      upfront_value: isNaN(upfront_value) ? 0 : upfront_value,
      installments_count: isNaN(installments_count) ? 1 : installments_count,
      installment_value: isNaN(installment_value) ? 0 : installment_value,
      has_interest: !!data.has_interest,
      status: 'active' as 'active',
      billing_frequency: (data.billing_frequency || 'monthly') as any,
      billing_day: Number(data.billing_day || 1),
      start_date: data.start_date ? new Date(data.start_date) : new Date(),
      setup_amount: isNaN(setup_amount) ? 0 : setup_amount
    };

    const contract = await this.repository.createContract(contractData);

    if (data.items && Array.isArray(data.items)) {
      const itemsToInsert = data.items.map((i: any) => ({
        contract_id: contract.id,
        item_type: i.item_type,
        service_id: i.service_id || null,
        subscription_id: i.subscription_id || null,
        price: Number(i.price || 0)
      }));

      await this.repository.createContractItems(itemsToInsert);
    }

    await this.billingService.generateInstallments(contract);

    logger.info(`Novo contrato gerado [ContratoID: ${contract.id}, ClienteID: ${contract.client_id}, Valor: ${total_value}]`);

    return contract;
  }

  async listAll() {
    return await this.repository.findAllWithDetails();
  }

  async deleteContract(id: string) {
    await this.repository.deleteInstallmentsByContractId(id);
    await this.repository.deleteContractItemsByContractId(id);
    await this.repository.deleteContract(id);
    
    logger.info(`Contrato excluído [ContratoID: ${id}]`);

    return { success: true };
  }

  async updateContract(id: string, data: any) {
    await this.repository.updateContract(id, data);
    logger.info(`Contrato atualizado [ContratoID: ${id}]`);
    return { success: true };
  }
}
