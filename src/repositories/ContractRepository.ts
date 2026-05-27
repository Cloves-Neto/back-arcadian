import { Contract } from '../models/database/Contract';
import { ContractItem } from '../models/database/ContractItem';

export interface ContractRepository {
  createContract(data: Partial<Contract>): Promise<Contract>;
  createContractItems(items: Partial<ContractItem>[]): Promise<ContractItem[]>;
  findAllWithDetails(): Promise<Contract[]>;
  deleteInstallmentsByContractId(contractId: string): Promise<number>;
  deleteContractItemsByContractId(contractId: string): Promise<number>;
  deleteContract(id: string): Promise<number>;
  updateContract(id: string, data: Partial<Contract>): Promise<any>;
}
