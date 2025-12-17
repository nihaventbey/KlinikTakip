import { createClient } from '@supabase/supabase-js';

// Environment variables should be in a .env file
// REACT_APP_SUPABASE_URL=https://your-project.supabase.co
// REACT_APP_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string | null;
  role: 'admin' | 'doctor' | 'assistant' | 'receptionist';
  specialty?: string;
  avatar_url?: string;
};
