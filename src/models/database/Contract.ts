export interface Contract {
  id?: string;
  name?: string;
  client_id: string;
  total_value: number;
  upfront_value: number;
  installments_count: number;
  installment_value: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  billing_frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  billing_day: number;
  start_date: Date;
  setup_amount: number;
  has_interest: boolean;
  interest_rate: number;
  late_fee_percent: number;
  monthly_interest_percent: number;
  service_ids: string[]; // JSONB in DB
  upfront_paid: boolean;
  created_at?: Date;
  updated_at?: Date;
}
