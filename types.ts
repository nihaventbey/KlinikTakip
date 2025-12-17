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
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'ongoing';
  type: 'visit' | 'operation' | 'control';
}

export interface Transaction {
  id: string;
  patient: string;
  type: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'late';
}
