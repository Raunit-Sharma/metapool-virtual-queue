import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Participant {
  id: string;
  token_number: number;
  name: string;
  roll_no: string;
  registered_at: string;
  status: 'waiting' | 'done' | 'skipped';
}

export interface QueueSettings {
  id: number;
  current_token: number;
  updated_at: string;
  updated_by: string | null;
}
