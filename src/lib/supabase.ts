// 'https://ptuxzazllyveqnydmybm.supabase.co'
// 'sb_publishable_ZzIHsTtNJGXG-SJAxSw19Q_Lo75Te3g'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env değişkenleri eksik! .env dosyasını kontrol et.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);