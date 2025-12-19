
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

export interface ClinicSettings {
  id: string;
  clinic_name: string;
  phone: string;
  address: string;
  email: string;
  logo_url: string;
  currency: string;
  // Website Hero
  hero_title: string;
  hero_subtitle: string;
  hero_catchy_text: string;
  hero_image: string;
  // Gallery
  gallery: GalleryItem[];
  // Features Section
  features_title: string;
  features_subtitle: string;
  features: { id: string; title: string; icon: string; desc: string }[];
  // Before/After Area
  service_highlight_title: string;
  service_highlight_desc: string;
  service_before_img: string;
  service_after_img: string;
  service_duration: string;
  service_teeth_count: string;
  // Testimonials
  testimonials_title: string;
  testimonials_subtitle: string;
  testimonials: { id: string; name: string; text: string; treatment: string }[];
  // Team
  team_title: string;
  team_subtitle: string;
  doctors: Doctor[];
  // Footer & Contact
  working_hours_weekdays: string;
  working_hours_saturday: string;
  social_instagram: string;
  social_facebook: string;
}

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
