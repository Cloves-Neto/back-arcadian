export interface Service {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category?: string;
  upfront_price?: number;
  installments?: number;
  created_at?: string;
  updated_at?: string;
}

