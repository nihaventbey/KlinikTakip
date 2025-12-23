export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'doctor' | 'assistant' | 'receptionist' | 'accountant';

// --- AUTH & SYSTEM ---
export interface Profile {
  id: string;
  clinic_id: string | null;
  tenant_id: string | null;
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  roles: UserRole[];
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Clinic {
  id: string;
  tenant_id: string;
  name: string;
  address?: string;
  phone_number?: string;
  logo_url?: string;
  website?: string;
}

// --- HASTA MODÜLÜ ---
export interface Patient {
  id: string;
  clinic_id: string;
  full_name: string;
  identity_number?: string;
  tc_number?: string; // Eklendi
  phone: string;
  email?: string;
  birth_date: string; // Zorunlu yapıldı
  gender: 'male' | 'female' | 'other'; // Zorunlu yapıldı
  address?: string;
  blood_type?: string;
  notes?: string;
  created_at: string;
  balance: number; // Bakiye eklendi
}

// --- RANDEVU MODÜLÜ ---
export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  patient?: Patient; 
  staff: { full_name: string }; // doctor, staff ile değiştirildi ve tipi daraltıldı
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  title?: string; // Başlık eklendi
  type?: 'examination' | 'treatment' | 'control';
  notes?: string;
}

// --- FİNANS MODÜLÜ (TAHMİNİ) ---
export interface Payment {
  id: string;
  clinic_id: string;
  patient_id: string;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'insurance';
  status: 'paid' | 'pending' | 'refunded';
  description?: string;
  created_at: string;
}

// --- STOK/TEDAVİ MODÜLÜ ---
export interface Treatment {
  id: string;
  clinic_id: string;
  name: string;
  code?: string;
  price: number;
  duration_minutes: number;
  category?: string;
}