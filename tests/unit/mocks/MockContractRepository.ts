// @ts-nocheck
import { ContractRepository } from '../../../src/repositories/ContractRepository';

export class MockContractRepository implements ContractRepository {
  public contracts: any[] = [];

  async create(data: any): Promise<any> {
    const newContract = { id: 'mock-contract-' + Date.now(), ...data };
    this.contracts.push(newContract);
    return newContract;
  }

  async findById(id: string): Promise<any | null> {
    return this.contracts.find(c => c.id === id) || null;
  }

  async list(): Promise<any[]> {
    return this.contracts;
  }

  async updateStatus(id: string, status: string): Promise<any> {
    const contract = this.contracts.find(c => c.id === id);
    if (contract) {
      contract.status = status;
    }
    return contract;
  }

  async delete(id: string): Promise<void> {
    this.contracts = this.contracts.filter(c => c.id !== id);
  }
}
