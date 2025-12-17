import { createClient } from '@supabase/supabase-js';

// --- AYARLAR ---
// Kullanıcı tarafından sağlanan Supabase bilgileri
const SUPABASE_URL = 'https://ptuxzazllyveqnydmybm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZzIHsTtNJGXG-SJAxSw19Q_Lo75Te3g';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('UYARI: Supabase bağlantı bilgileri eksik!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Profile = {
  id: string;
  full_name: string | null;
  role: 'admin' | 'doctor' | 'assistant' | 'receptionist';
  specialty?: string;
  avatar_url?: string;
};