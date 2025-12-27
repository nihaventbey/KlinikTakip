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

// --- FİNANS MODÜLÜ ---
export interface Transaction {
  id: string;
  clinic_id: string;
  patient_id: string;
  patient?: { full_name: string }; // İlişkili hasta adı için
  amount: number;
  type: 'payment' | 'charge' | 'refund'; // Ödeme, Borç, İade
  transaction_date: string;
  description?: string;
  created_at: string;
  deleted_at?: string;
}

export interface ClinicExpense {
    id: string;
    clinic_id: string;
    description: string;
    amount: number;
    category?: string;
    expense_date: string;
    created_at: string;
    is_deleted: boolean;
    deleted_at?: string;
}

export interface Staff {
  id: string;
  clinic_id: string;
  specialty: string | null;
  commission_rate: number | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  tenant_id: string | null;
  roles: string[];
  full_name: string;
  email: string;
}

// --- STOK/TEDAVİ MODÜLÜ ---
export interface Treatment {
  id: string;
  clinic_id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  deleted_at?: string;
}