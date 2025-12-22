import { NavItem, Doctor, Task, Patient } from './src/types';

export const APP_NAME = "DentCare";

// Navigation
export const PUBLIC_NAV: NavItem[] = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Tedaviler', path: '/services' },
  { label: 'Doktorlar', path: '/team' },
  { label: 'İletişim', path: '/contact' },
  { label: 'Randevu Al', path: '/appointment' },
];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Panel', path: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Klinik & Hasta', path: '/admin/clinical', icon: 'vital_signs' },
  { label: 'Randevular', path: '/admin/appointments', icon: 'calendar_month' },
  { label: 'Hastalar', path: '/admin/patients', icon: 'group' },
  { label: 'Pazarlama', path: '/admin/marketing', icon: 'campaign' },
  { label: 'Tedaviler & Stok', path: '/admin/treatments', icon: 'dentistry' },
  { label: 'Lab & Protez', path: '/admin/lab', icon: 'biotech' },
  { label: 'Personel & Görev', path: '/admin/staff', icon: 'badge' },
  { label: 'Formlar', path: '/admin/forms', icon: 'description' },
  { label: 'Finans', path: '/admin/finance', icon: 'payments' },
  { label: 'Ayarlar', path: '/admin/settings', icon: 'settings' },
];

// DRUGS_DB can stay as a static list for helper
export const DRUGS_DB = [
    { name: 'Augmentin 1000mg', type: 'Antibiyotik', dose: '2x1' },
    { name: 'Apranax Fort 550mg', type: 'Ağrı Kesici', dose: '2x1 (Tok)' },
    { name: 'Majezik Gargara', type: 'Antiseptik', dose: '3x1' },
    { name: 'Arveles 25mg', type: 'Ağrı Kesici', dose: 'Gerektiğinde' },
    { name: 'Largopen 1g', type: 'Antibiyotik', dose: '2x1' },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Ahmet Yılmaz',
    title: 'Başhekim & Çene Cerrahı',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
    specialty: 'Cerrahi'
  },
  {
    id: 'd2',
    name: 'Dr. Ayşe Demir',
    title: 'Ortodontist',
    image: 'https://images.unsplash.com/photo-1594824476969-519478cae327?q=80&w=2070&auto=format&fit=crop',
    specialty: 'Ortodonti'
  },
  {
    id: 'd3',
    name: 'Dr. Mehmet Öz',
    title: 'Estetik Diş Hekimi',
    image: 'https://images.unsplash.com/photo-1537368910025-bc005ca23784?q=80&w=2032&auto=format&fit=crop',
    specialty: 'Estetik'
  }
];

export const MOCK_PATIENTS: Patient[] = [
    { id: 'p1', full_name: 'Zeynep Yılmaz', phone: '555 123 45 67', avatar_url: 'https://i.pravatar.cc/150?img=5', status: 'active', balance: 0, ltv: 12000 },
    { id: 'p2', full_name: 'Ali Vural', phone: '555 987 65 43', avatar_url: 'https://i.pravatar.cc/150?img=11', status: 'new', balance: 1500, ltv: 1500 },
    { id: 'p3', full_name: 'Ayşe Kaya', phone: '555 456 78 90', avatar_url: 'https://i.pravatar.cc/150?img=9', status: 'archived', balance: 0, ltv: 8400 },
    { id: 'p4', full_name: 'Murat Demir', phone: '555 234 56 78', avatar_url: 'https://i.pravatar.cc/150?img=3', status: 'active', balance: 0, ltv: 2200 },
];

export const TASKS: Task[] = [
    { id: 't1', title: 'Stok sayımı yapılacak', priority: 'high', status: 'pending', assignee: 'Aslı', due_date: '2023-10-25' },
    { id: 't2', title: 'Dr. Ahmet hasta dosyaları düzenlenecek', priority: 'medium', status: 'completed', assignee: 'Burcu', due_date: '2023-10-24' },
    { id: 't3', title: 'Laboratuvar siparişleri kontrol et', priority: 'low', status: 'pending', assignee: 'Mehmet', due_date: '2023-10-26' },
];

export const STAFF_SHIFTS = [
    { day: 'Pazartesi', staff: [{ name: 'Dr. Ahmet', type: 'doctor', status: 'working' }, { name: 'Ayşe (Asistan)', type: 'assistant', status: 'working' }] },
    { day: 'Salı', staff: [{ name: 'Dr. Ahmet', type: 'doctor', status: 'off' }, { name: 'Ayşe (Asistan)', type: 'assistant', status: 'working' }] },
    { day: 'Çarşamba', staff: [{ name: 'Dr. Ahmet', type: 'doctor', status: 'working' }, { name: 'Ayşe (Asistan)', type: 'assistant', status: 'off' }] },
    { day: 'Perşembe', staff: [{ name: 'Dr. Ahmet', type: 'doctor', status: 'working' }, { name: 'Ayşe (Asistan)', type: 'assistant', status: 'working' }] },
    { day: 'Cuma', staff: [{ name: 'Dr. Ahmet', type: 'doctor', status: 'working' }, { name: 'Ayşe (Asistan)', type: 'assistant', status: 'working' }] },
];