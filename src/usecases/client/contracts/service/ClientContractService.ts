export interface ClientContractService {
  listByClient(userId: string): Promise<any>;
}
