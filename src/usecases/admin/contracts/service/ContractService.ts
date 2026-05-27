export interface ContractService {
  createFullContract(data: any): Promise<any>;
  listAll(): Promise<any>;
  deleteContract(id: string): Promise<any>;
  updateContract(id: string, data: any): Promise<any>;
}
