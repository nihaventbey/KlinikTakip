export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'doctor' | 'assistant' | 'receptionist';

// Supabase DB yapısına uygun tipler
export interface Profile {
  id: string;
  clinic_id: string | null;
  tenant_id: string | null;
  full_name: string | null;
  email: string | null;
  roles: UserRole[]; // DB'de text[] olarak tutuluyor
  avatar_url?: string;
  created_at: string;
}

export interface Clinic {
  id: string;
  tenant_id: string;
  name: string;
  phone_number?: string;
  address?: string;
  logo_url?: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  status: 'active' | 'passive' | 'pending';
  subscription_plan?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}