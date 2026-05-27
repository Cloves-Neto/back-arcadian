import { BillingService } from './BillingService';
import { BillingRepository } from '../../../../repositories/BillingRepository';
import { SequelizeBillingRepository } from '../../../../repositories/database/SequelizeBillingRepository';
import { EmailService } from '../../../../utils/EmailService';
import { logger } from '../../../../utils/logger';

export class BillingServiceImpl implements BillingService {
  private repository: BillingRepository;

  constructor() {
    this.repository = new SequelizeBillingRepository();
  }

  async listAll() {
    return await this.repository.findAllContractsWithDetails();
  }

  async getInstallments(contractId: string) {
    return await this.repository.findInstallmentsByContractId(contractId);
  }

  async updateStatus(id: string, status: string, paid_amount?: number, payment_date?: string | Date) {
    if (status === 'paid') {
      return await this.markAsPaid(id, paid_amount, payment_date ? new Date(payment_date) : undefined);
    }

    const installment = await this.repository.updateInstallment(id, {
      status: status as 'pending' | 'paid' | 'overdue',
      paid_amount,
      payment_date: payment_date ? new Date(payment_date) : undefined
    });

    if (!installment) throw new Error('Installment not found');
    return installment;
  }

  async toggleUpfrontStatus(id: string, upfront_paid: boolean) {
    const contract = await this.repository.updateContract(id, { upfront_paid });
    if (!contract) throw new Error('Contract not found');
    return contract;
  }

  async generateInstallments(contract: any) {
    const installments = [];
    const { 
      id: contract_id, 
      installments_count, 
      installment_value, 
      start_date, 
      billing_day, 
      billing_frequency,
      upfront_value
    } = contract;

    const startDate = new Date(start_date);

    // Check if the contract is for a service or subscription to handle setup offset
    const items = await this.repository.findContractItems(contract_id);
    const hasService = items.some((item: any) => item.item_type === 'service');
    const hasSubscription = items.some((item: any) => item.item_type === 'subscription');

    const startOffset = (hasService && !hasSubscription && upfront_value > 0) ? 1 : 0;

    for (let i = 1; i <= installments_count; i++) {
      const dueDate = new Date(startDate);
      
      let monthsToAdd = startOffset;
      if (billing_frequency === 'monthly') monthsToAdd += i - 1;
      else if (billing_frequency === 'quarterly') monthsToAdd += (i - 1) * 3;
      else if (billing_frequency === 'semi-annual') monthsToAdd += (i - 1) * 6;
      else if (billing_frequency === 'annual') monthsToAdd += (i - 1) * 12;

      dueDate.setMonth(startDate.getMonth() + monthsToAdd);
      dueDate.setDate(billing_day);

      installments.push({
        contract_id,
        installment_number: i,
        total_installments: installments_count,
        due_date: dueDate,
        value: installment_value,
        status: 'pending' as 'pending'
      });
    }

    const created = await this.repository.bulkCreateInstallments(installments);
    logger.info(`Geradas ${installments.length} parcelas para o contrato [ContratoID: ${contract_id}]`);
    return created;
  }

  async markAsPaid(installmentId: string, paidAmount?: number, paymentDate?: Date) {
    const installment = await this.repository.findInstallmentById(installmentId);
    if (!installment) throw new Error('Installment not found');

    const updatedInstallment = await this.repository.updateInstallment(installmentId, {
      status: 'paid',
      paid_amount: paidAmount || installment.value,
      payment_date: paymentDate || new Date()
    });

    const contract = await this.repository.findContractWithItems(installment.contract_id);

    if (contract) {
      const isSubscription = (contract as any).items?.some((item: any) => item.item_type === 'subscription');
      
      if (isSubscription) {
        const nextInstallmentNumber = installment.installment_number + 1;
        
        const existingNext = await this.repository.findSpecificInstallment(contract.id as string, nextInstallmentNumber);

        if (!existingNext) {
          const nextDueDate = new Date(installment.due_date);
          
          let monthsToAdd = 1;
          if (contract.billing_frequency === 'monthly') monthsToAdd = 1;
          else if (contract.billing_frequency === 'quarterly') monthsToAdd = 3;
          else if (contract.billing_frequency === 'semi-annual') monthsToAdd = 6;
          else if (contract.billing_frequency === 'annual') monthsToAdd = 12;

          nextDueDate.setMonth(nextDueDate.getMonth() + monthsToAdd);

          await this.repository.createInstallment({
            contract_id: contract.id as string,
            installment_number: nextInstallmentNumber,
            total_installments: nextInstallmentNumber,
            due_date: nextDueDate,
            value: installment.value,
            status: 'pending'
          });
          
          await this.repository.updateContract(contract.id as string, { installments_count: nextInstallmentNumber });
        }
      }
    }

    logger.info(`Parcela marcada como paga [ParcelaID: ${installmentId}, ContratoID: ${installment.contract_id}, Valor Pago: ${updatedInstallment?.paid_amount}]`);

    return updatedInstallment;
  }

  async charge(installmentId: string) {
    const installment = await this.repository.findInstallmentById(installmentId);
    if (!installment) throw new Error('Installment not found');

    const contract = await this.repository.findContractWithProfileAndUser(installment.contract_id);
    if (!contract) throw new Error('Contract not found');

    const isOverdue = new Date(installment.due_date) < new Date() && installment.status !== 'paid';
    
    await this.repository.updateInstallment(installmentId, { last_charged_at: new Date() });

    const emailResult = await EmailService.sendBillingEmail(contract, installment, isOverdue);
    logger.info(`Fatura cobrada via e-mail [ParcelaID: ${installmentId}, ContratoID: ${installment.contract_id}]`);

    return emailResult;
  }
}
