// @ts-nocheck
import { BillingRepository } from '../../../src/repositories/BillingRepository';

export class MockBillingRepository implements BillingRepository {
  public installments: any[] = [];

  async findByContractId(contractId: string): Promise<any[]> {
    return this.installments.filter(i => i.contract_id === contractId);
  }

  async findById(id: string): Promise<any | null> {
    return this.installments.find(i => i.id === id) || null;
  }

  async updateStatus(id: string, status: string): Promise<any> {
    const installment = this.installments.find(i => i.id === id);
    if (installment) {
      installment.status = status;
    }
    return installment;
  }

  async toggleUpfrontStatus(contractId: string, status: boolean): Promise<any> {
    const installment = this.installments.find(i => i.contract_id === contractId);
    if (installment) {
      installment.is_upfront = status;
    }
    return installment;
  }

  async createInstallments(installments: any[]): Promise<any[]> {
    this.installments.push(...installments);
    return installments;
  }

  async listAll(): Promise<any[]> {
    return this.installments;
  }
}
