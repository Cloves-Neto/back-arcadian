export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  password?: string;
  role: 'admin' | 'client';
  must_change_password: boolean;
  is_admin_created: boolean;
  invitation_token?: string;
  token_expires_at?: string;
  privileges?: string[];
  settings?: any;
  profile?: any;
  created_at?: string;
  updated_at?: string;
}
