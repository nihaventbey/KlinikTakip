
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export enum TreatmentCategory {
  ESTHETIC = 'Estetik',
  SURGERY = 'Cerrahi',
  ORTHODONTICS = 'Ortodonti',
  PEDIATRIC = 'Çocuk Diş',
  GENERAL = 'Genel Diş'
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  specialty: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  colorClass: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  treatment: string;
  date: string;
  time: string; // HH:MM format
  duration: number; // minutes
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'ongoing';
  type: 'visit' | 'operation' | 'control';
  color?: string;
}

export interface Transaction {
  id: string;
  patient: string;
  type: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'late';
  invoiceStatus?: 'sent' | 'pending' | 'error'; // E-Fatura durumu
}

// Updated to match Supabase Schema (snake_case)
export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  last_visit_date?: string;
  avatar_url?: string;
  status: 'active' | 'archived' | 'new';
  balance: number;
  ltv: number;
  created_at?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minLevel: number;
  status: 'ok' | 'low' | 'critical';
}

export interface TreatmentItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string; // dk cinsinden
}

export interface LabOrder {
  id: string;
  patientName: string;
  item: string;
  labName: string;
  status: 'ordered' | 'in-progress' | 'shipped' | 'arrived';
  dueDate: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed'; // Changed from boolean completed to status string
  due_date: string; // Changed from camelCase to snake_case
  created_at?: string;
}

export interface ClinicSettings {
  id: string;
  clinic_name: string;
  phone: string;
  address: string;
  email: string;
  logo_url: string;
  currency: string;
}

export interface Shift {
  day: string;
  staff: { name: string; type: 'doctor' | 'assistant'; status: 'working' | 'off' | 'half' }[];
}

// --- Financial Types ---

export interface Expense {
  id: string;
  title: string;
  category: 'Kira' | 'Maaş' | 'Malzeme' | 'Fatura' | 'Diğer';
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface InstallmentPlan {
  id: string;
  patientName: string;
  treatment: string;
  totalAmount: number;
  remainingAmount: number;
  installments: {
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
  }[];
}

export interface DoctorPerformance {
  doctorId: string;
  name: string;
  totalTurnover: number; // Toplam Ciro
  commissionRate: number; // %
  calculatedPayment: number; // Hak Ediş
  patientCount: number;
}

// --- Marketing Types ---

export interface Lead {
  id: string;
  name: string;
  source: 'Instagram' | 'Google' | 'Referans' | 'Website';
  status: 'new' | 'contacted' | 'appointed' | 'converted' | 'lost';
  date: string;
  phone: string;
  interest: string;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'sms' | 'email' | 'social';
  status: 'active' | 'scheduled' | 'ended' | 'draft';
  sentCount: number;
  conversionRate: number;
  date: string;
}

export interface SocialPost {
  id: string;
  image: string;
  caption: string;
  platform: 'instagram' | 'facebook' | 'linkedin';
  status: 'draft' | 'scheduled' | 'published';
  date: string;
}
