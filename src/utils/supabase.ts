import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

const supabaseUrl = process.env.SUPABASE_URL || '';
// Backend SEMPRE usa a service role key para bypassar RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase URL ou Service Role Key ausente. O SDK pode não funcionar corretamente.');
} else if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY não definido. Usando anon key — RLS pode bloquear operações do servidor.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
