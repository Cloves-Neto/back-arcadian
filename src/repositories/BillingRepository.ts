import { Contract } from '../models/database/Contract';
import { Installment } from '../models/database/Installment';
import { ContractItem } from '../models/database/ContractItem';

export interface BillingRepository {
  findAllContractsWithDetails(): Promise<Contract[]>;
  findInstallmentsByContractId(contractId: string): Promise<Installment[]>;
  findInstallmentById(id: string): Promise<Installment | null>;
  findContractById(id: string): Promise<Contract | null>;
  findContractWithItems(id: string): Promise<Contract | null>;
  findContractWithProfileAndUser(id: string): Promise<Contract | null>;
  findContractItems(contractId: string): Promise<ContractItem[]>;
  updateInstallment(id: string, data: Partial<Installment>): Promise<Installment | null>;
  updateContract(id: string, data: Partial<Contract>): Promise<Contract | null>;
  bulkCreateInstallments(installments: Partial<Installment>[]): Promise<Installment[]>;
  findSpecificInstallment(contractId: string, installmentNumber: number): Promise<Installment | null>;
  createInstallment(data: Partial<Installment>): Promise<Installment>;
}
