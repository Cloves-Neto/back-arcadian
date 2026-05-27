export interface Installment {
  id?: string;
  contract_id: string;
  installment_number: number;
  total_installments: number;
  due_date: Date;
  value: number;
  status: 'pending' | 'paid' | 'overdue';
  payment_date?: Date;
  paid_amount?: number;
  last_charged_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
