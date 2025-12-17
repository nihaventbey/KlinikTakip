
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
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  nextVisit?: string;
  status: 'active' | 'archived' | 'new';
  balance: number;
  image: string;
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
  completed: boolean;
  dueDate: string;
}

export interface Shift {
  day: string;
  staff: { name: string; type: 'doctor' | 'assistant'; status: 'working' | 'off' | 'half' }[];
}
