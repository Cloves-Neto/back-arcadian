// src/models/database/Profile.ts
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  onboarding?: boolean;
  tax_id?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  created_at?: string;
  updated_at?: string;
}
