import { NavItem, Doctor, Appointment, Transaction, Patient, InventoryItem, TreatmentItem } from './types';

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
  { label: 'Randevular', path: '/admin/appointments', icon: 'calendar_month' },
  { label: 'Hastalar', path: '/admin/patients', icon: 'group' },
  { label: 'Tedaviler & Stok', path: '/admin/treatments', icon: 'dentistry' },
  { label: 'Finans', path: '/admin/finance', icon: 'payments' },
  { label: 'Ayarlar', path: '/admin/settings', icon: 'settings' },
];

// Mock Data
export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ahmet Yılmaz',
    title: 'Başhekim / Çene Cerrahisi',
    specialty: 'Cerrahi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoWVnboAPotbuMVzwO8-LNwL6PCbT5bD7BtWYD-bVEfX9kFbRZW_7FBumDbFx_e3lYisDJljhxv-n5jridN7ND5Nj_XlP39waNLfGTDU7ldTtjIeCYbSoZ5UwlRyKNist0c8NxHRlvFzYj-Zqld_zFkD5FvNbCJzHtqRugoxtgYUlJRWb4HtJqJ5FSGut2Xc_wOjnjJawSfczkTS8yv96c32vsyB6CTityXxZCL_Jq6LrcQdVpoVkIRJ-KRa3fpj8IGqNoQJEXsHxd'
  },
  {
    id: '2',
    name: 'Dr. Ayşe Demir',
    title: 'Ortodontist',
    specialty: 'Ortodonti',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9NGJ6NxpZVbah29UbzzO7TOIKboyU9XZIyIv2gr2v_eGWxMeODdoSc53fuyTF-lqrbjIEXTbuPgQEgID31LJXKakLjVxPiAq6CUmqHtpmca_8H_DXEcQz9XGv_rSeYzhiAFkCzM4BjRwSdmXY8DN6G9OYYWeYQJwMuD2nGQjQ2drsrehAdhlj_5F-yjTt3V6dKIDjrZYvzQok77FACxWUXRlVL1fhSl4_DLuS3cjJFLfqZtDLMkgva4Q_7rbgDF2hKWpuULRiEBoM'
  },
  {
    id: '3',
    name: 'Dr. Mehmet Öz',
    title: 'Pedodontist',
    specialty: 'Çocuk Diş',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1BpF9d1PbzzjnSSh_z-P7yagT716V0RivDx99n3EW7SpbwFBfhbizk8zwoRXspyxFQfaNaLkoUtJik-Ynmpf0F_IjAPsqTns1bI_s0LX3tSX3fIksu-zqvjssOJ2iI61nCeWDcmUD7M2206xll_Esg3J6RHw-XslT9R_ZW4ziWTwZO-C5A7Zz5YbbJ-oZ3-0ZyXY1CpQl9ykVTxEgQW7B67XXVdNXmnZ1TsHD3TZdKtJDQ3iCrOdYv5QfcYiP0kP5wPP4ad8zO0Ky'
  }
];

export const RECENT_APPOINTMENTS: Appointment[] = [
  { id: '1', patientName: 'Ayşe Yılmaz', doctorName: 'Dr. Ahmet', treatment: 'Diş Temizliği', date: 'Bugün', time: '09:30', status: 'completed', type: 'visit' },
  { id: '2', patientName: 'Mehmet Kaya', doctorName: 'Dr. Selin', treatment: 'Kanal Tedavisi', date: 'Bugün', time: '10:15', status: 'ongoing', type: 'operation' },
  { id: '3', patientName: 'Can Demir', doctorName: 'Dr. Ahmet', treatment: 'İmplant Kontrol', date: 'Bugün', time: '11:00', status: 'pending', type: 'control' },
  { id: '4', patientName: 'Zeynep Çelik', doctorName: 'Dr. Ayşe', treatment: 'Ortodonti', date: 'Bugün', time: '14:00', status: 'confirmed', type: 'visit' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'TRX-8854', patient: 'Ayşe Kaya', type: 'İmplant Tedavisi (1/3)', date: '12 Mayıs 2024', amount: 8500, status: 'paid' },
  { id: 'TRX-8853', patient: 'Mehmet Yılmaz', type: 'Kanal Tedavisi', date: '11 Mayıs 2024', amount: 2500, status: 'pending' },
  { id: 'TRX-8852', patient: 'Zeynep Çelik', type: 'Diş Beyazlatma', date: '10 Mayıs 2024', amount: 4000, status: 'late' },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'P-101', name: 'Zeynep Yılmaz', age: 28, phone: '0555 111 22 33', lastVisit: '10 Eki 2023', nextVisit: '15 Kas 2023', status: 'active', balance: 0, image: 'https://i.pravatar.cc/150?img=5' },
  { id: 'P-102', name: 'Ali Vural', age: 34, phone: '0532 222 33 44', lastVisit: '22 Eyl 2023', status: 'new', balance: 1500, image: 'https://i.pravatar.cc/150?img=11' },
  { id: 'P-103', name: 'Ayşe Kaya', age: 45, phone: '0544 333 44 55', lastVisit: '05 Eki 2023', status: 'active', balance: 0, image: 'https://i.pravatar.cc/150?img=9' },
  { id: 'P-104', name: 'Mehmet Demir', age: 52, phone: '0505 444 55 66', lastVisit: '12 Ağu 2023', status: 'archived', balance: 0, image: 'https://i.pravatar.cc/150?img=13' },
  { id: 'P-105', name: 'Selin Öz', age: 24, phone: '0530 555 66 77', lastVisit: 'Bugün', nextVisit: '24 Eki 2023', status: 'active', balance: 4500, image: 'https://i.pravatar.cc/150?img=1' },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Cerrahi Eldiven (M)', category: 'Sarf Malzeme', stock: 12, unit: 'Kutu', minLevel: 10, status: 'low' },
  { id: 'INV-002', name: 'Lokal Anestezi (2ml)', category: 'İlaç', stock: 45, unit: 'Ampul', minLevel: 20, status: 'ok' },
  { id: 'INV-003', name: 'Kompozit Dolgu Seti', category: 'Tedavi', stock: 3, unit: 'Set', minLevel: 5, status: 'critical' },
  { id: 'INV-004', name: 'İmplant Vidası (Titanyum)', category: 'İmplant', stock: 8, unit: 'Adet', minLevel: 5, status: 'ok' },
  { id: 'INV-005', name: 'Diş Hekimi Önlüğü', category: 'Tekstil', stock: 15, unit: 'Adet', minLevel: 5, status: 'ok' },
];

export const TREATMENT_CATALOG: TreatmentItem[] = [
  { id: 'SRV-001', name: 'Diş Taşı Temizliği', category: 'Genel', price: 1200, duration: '30 dk' },
  { id: 'SRV-002', name: 'Kompozit Dolgu', category: 'Dolgu', price: 1500, duration: '45 dk' },
  { id: 'SRV-003', name: 'Kanal Tedavisi (Tek Kanal)', category: 'Endodonti', price: 2500, duration: '60 dk' },
  { id: 'SRV-004', name: 'İmplant (Yerli)', category: 'Cerrahi', price: 12000, duration: '90 dk' },
  { id: 'SRV-005', name: 'Diş Beyazlatma (Ofis Tipi)', category: 'Estetik', price: 4000, duration: '60 dk' },
];
