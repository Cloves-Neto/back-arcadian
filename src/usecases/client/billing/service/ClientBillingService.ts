export interface ClientBillingService {
  listByClient(userId: string): Promise<any>;
}
