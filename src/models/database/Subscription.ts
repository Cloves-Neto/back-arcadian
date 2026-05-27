export interface Subscription {
  id?: string;
  name: string;
  description?: string;
  monthly_price: number;
  quarterly_price: number;
  semi_annual_price: number;
  annual_price: number;
  created_at?: Date;
  updated_at?: Date;
}
