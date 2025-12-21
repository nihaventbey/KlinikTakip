
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'doctor' | 'assistant' | 'receptionist';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  specialty?: string;
  avatar_url?: string;
  clinic_id?: string | null;
  email?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  specialty: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export interface Clinic {
  id: number;
  name: string;
  address: string | null;
  phone_number: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClinicSettings {
  clinic_id: number;
  logo_url: string | null;
  currency: string;
  // Website Hero
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_catchy_text: string | null;
  hero_image: string | null;
  // Gallery
  gallery: GalleryItem[];
  // Features Section
  features_title: string | null;
  features_subtitle: string | null;
  features: { id: string; title: string; icon: string; desc: string }[];
  // Before/After Area
  service_highlight_title: string | null;
  service_highlight_desc: string | null;
  service_before_img: string | null;
  service_after_img: string | null;
  service_duration: string | null;
  service_teeth_count: string | null;
  // Testimonials
  testimonials_title: string | null;
  testimonials_subtitle: string | null;
  testimonials: { id: string; name: string; text: string; treatment: string }[];
  // Team
  team_title: string | null;
  team_subtitle: string | null;
  doctors: Doctor[];
  // Footer & Contact
  working_hours_weekdays: string | null;
  working_hours_saturday: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
}

// Composite type for UI convenience
export type ClinicWithSettings = Clinic & { settings: Omit<ClinicSettings, 'clinic_id'> };


export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  status: 'active' | 'archived' | 'new';
  balance: number;
  ltv: number;
  avatar_url?: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  treatment: string;
  date: string;
  time: string;
  duration: number;
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

export interface TreatmentItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
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

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  due_date: string;
}

export interface Lead {
  id: string;
  name: string;
  source: 'Instagram' | 'Google' | 'Referans' | 'Website';
  status: 'new' | 'contacted' | 'appointed' | 'converted' | 'lost';
  date: string;
  phone: string;
  interest: string;
}
