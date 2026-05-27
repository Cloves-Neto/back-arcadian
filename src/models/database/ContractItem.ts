export interface ContractItem {
  id?: string;
  contract_id: string;
  service_id?: string;
  subscription_id?: string;
  name: string;
  price: number;
  type: 'service' | 'subscription';
  created_at?: Date;
  updated_at?: Date;
}
