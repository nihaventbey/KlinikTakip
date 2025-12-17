import { NavItem, Doctor, Appointment, Transaction, Patient, InventoryItem, TreatmentItem, LabOrder, Task, Shift, Expense, InstallmentPlan, DoctorPerformance, Lead, Campaign, SocialPost } from './types';

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
  { label: 'Pazarlama', path: '/admin/marketing', icon: 'campaign' }, // New
  { label: 'Tedaviler & Stok', path: '/admin/treatments', icon: 'dentistry' },
  { label: 'Lab & Protez', path: '/admin/lab', icon: 'biotech' },
  { label: 'Personel & Görev', path: '/admin/staff', icon: 'badge' },
  { label: 'Formlar', path: '/admin/forms', icon: 'description' },
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
  { id: '1', patientName: 'Ayşe Yılmaz', doctorName: 'Dr. Ahmet', treatment: 'Diş Temizliği', date: '2023-10-16', time: '09:00', duration: 60, status: 'completed', type: 'visit', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: '2', patientName: 'Mehmet Kaya', doctorName: 'Dr. Selin', treatment: 'Kanal Tedavisi', date: '2023-10-16', time: '10:30', duration: 90, status: 'ongoing', type: 'operation', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: '3', patientName: 'Can Demir', doctorName: 'Dr. Ahmet', treatment: 'İmplant Kontrol', date: '2023-10-16', time: '13:00', duration: 30, status: 'pending', type: 'control', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: '4', patientName: 'Zeynep Çelik', doctorName: 'Dr. Ayşe', treatment: 'Ortodonti', date: '2023-10-16', time: '14:00', duration: 45, status: 'confirmed', type: 'visit', color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'TRX-8854', patient: 'Ayşe Kaya', type: 'İmplant Tedavisi (1/3)', date: '12 Mayıs 2024', amount: 8500, status: 'paid', invoiceStatus: 'sent' },
  { id: 'TRX-8853', patient: 'Mehmet Yılmaz', type: 'Kanal Tedavisi', date: '11 Mayıs 2024', amount: 2500, status: 'pending', invoiceStatus: 'pending' },
  { id: 'TRX-8852', patient: 'Zeynep Çelik', type: 'Diş Beyazlatma', date: '10 Mayıs 2024', amount: 4000, status: 'late', invoiceStatus: 'error' },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'P-101', name: 'Zeynep Yılmaz', age: 28, phone: '0555 111 22 33', lastVisit: '10 Eki 2023', nextVisit: '15 Kas 2023', status: 'active', balance: 0, image: 'https://i.pravatar.cc/150?img=5', ltv: 12500 },
  { id: 'P-102', name: 'Ali Vural', age: 34, phone: '0532 222 33 44', lastVisit: '22 Eyl 2023', status: 'new', balance: 1500, image: 'https://i.pravatar.cc/150?img=11', ltv: 1500 },
  { id: 'P-103', name: 'Ayşe Kaya', age: 45, phone: '0544 333 44 55', lastVisit: '05 Eki 2023', status: 'active', balance: 0, image: 'https://i.pravatar.cc/150?img=9', ltv: 8400 },
  { id: 'P-104', name: 'Mehmet Demir', age: 52, phone: '0505 444 55 66', lastVisit: '12 Ağu 2023', status: 'archived', balance: 0, image: 'https://i.pravatar.cc/150?img=13', ltv: 2200 },
  { id: 'P-105', name: 'Selin Öz', age: 24, phone: '0530 555 66 77', lastVisit: 'Bugün', nextVisit: '24 Eki 2023', status: 'active', balance: 4500, image: 'https://i.pravatar.cc/150?img=1', ltv: 4500 },
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

export const LAB_ORDERS: LabOrder[] = [
  { id: 'LAB-01', patientName: 'Kemal Sunal', item: 'Zirkonyum Köprü', labName: 'Elit Dental Lab', status: 'shipped', dueDate: '2023-10-20' },
  { id: 'LAB-02', patientName: 'Fatma Girik', item: 'Porselen Lamina', labName: 'Ataşehir Seramik', status: 'in-progress', dueDate: '2023-10-22' },
  { id: 'LAB-03', patientName: 'Tarık Akan', item: 'Total Protez', labName: 'Elit Dental Lab', status: 'ordered', dueDate: '2023-10-25' },
];

export const TASKS: Task[] = [
  { id: 'T-01', title: 'Mehmet Bey\'in röntgenlerini sisteme yükle', assignee: 'Asistan Elif', priority: 'high', completed: false, dueDate: 'Bugün' },
  { id: 'T-02', title: 'Laboratuvar siparişlerini kontrol et', assignee: 'Dr. Ahmet', priority: 'medium', completed: false, dueDate: 'Yarın' },
  { id: 'T-03', title: 'Bekleme salonu dergilerini yenile', assignee: 'Resepsiyon', priority: 'low', completed: true, dueDate: 'Dün' },
];

export const STAFF_SHIFTS: Shift[] = [
  { day: 'Pazartesi', staff: [{name: 'Dr. Ahmet', type: 'doctor', status: 'working'}, {name: 'Dr. Ayşe', type: 'doctor', status: 'working'}, {name: 'Elif', type: 'assistant', status: 'working'}] },
  { day: 'Salı', staff: [{name: 'Dr. Ahmet', type: 'doctor', status: 'half'}, {name: 'Dr. Ayşe', type: 'doctor', status: 'working'}, {name: 'Elif', type: 'assistant', status: 'off'}] },
  { day: 'Çarşamba', staff: [{name: 'Dr. Ahmet', type: 'doctor', status: 'working'}, {name: 'Dr. Ayşe', type: 'doctor', status: 'off'}, {name: 'Elif', type: 'assistant', status: 'working'}] },
];

export const DRUGS_DB = [
    { name: 'Augmentin 1000mg', type: 'Antibiyotik', dose: '2x1' },
    { name: 'Apranax Fort 550mg', type: 'Ağrı Kesici', dose: '2x1 (Tok)' },
    { name: 'Majezik Gargara', type: 'Antiseptik', dose: '3x1' },
    { name: 'Arveles 25mg', type: 'Ağrı Kesici', dose: 'Gerektiğinde' },
    { name: 'Largopen 1g', type: 'Antibiyotik', dose: '2x1' },
];

// Financial Mock Data
export const EXPENSES: Expense[] = [
  { id: 'EXP-001', title: 'Ekim Ayı Kira', category: 'Kira', amount: 25000, date: '01.10.2023', status: 'paid' },
  { id: 'EXP-002', title: 'Personel Maaşları', category: 'Maaş', amount: 85000, date: '05.10.2023', status: 'paid' },
  { id: 'EXP-003', title: 'Medikal Depo Faturası', category: 'Malzeme', amount: 12500, date: '12.10.2023', status: 'pending' },
  { id: 'EXP-004', title: 'Elektrik Faturası', category: 'Fatura', amount: 3200, date: '15.10.2023', status: 'pending' },
];

export const INSTALLMENTS: InstallmentPlan[] = [
  { 
    id: 'INS-01', patientName: 'Zeynep Çelik', treatment: 'Şeffaf Plak Tedavisi', totalAmount: 35000, remainingAmount: 25000, 
    installments: [
      { date: '15.09.2023', amount: 10000, status: 'paid' },
      { date: '15.10.2023', amount: 5000, status: 'overdue' },
      { date: '15.11.2023', amount: 5000, status: 'pending' }
    ]
  },
  { 
    id: 'INS-02', patientName: 'Ali Vural', treatment: 'İmplant (3 Adet)', totalAmount: 45000, remainingAmount: 30000, 
    installments: [
      { date: '01.10.2023', amount: 15000, status: 'paid' },
      { date: '01.11.2023', amount: 15000, status: 'pending' },
      { date: '01.12.2023', amount: 15000, status: 'pending' }
    ]
  }
];

export const DOCTOR_PERFORMANCE: DoctorPerformance[] = [
  { doctorId: '1', name: 'Dr. Ahmet Yılmaz', totalTurnover: 150000, commissionRate: 20, calculatedPayment: 30000, patientCount: 45 },
  { doctorId: '2', name: 'Dr. Ayşe Demir', totalTurnover: 95000, commissionRate: 15, calculatedPayment: 14250, patientCount: 32 },
  { doctorId: '3', name: 'Dr. Mehmet Öz', totalTurnover: 78000, commissionRate: 15, calculatedPayment: 11700, patientCount: 50 },
];

// --- Marketing Mock Data ---

export const LEADS: Lead[] = [
  { id: 'L-01', name: 'Burak Yılmaz', source: 'Instagram', status: 'new', date: '10 dk önce', phone: '0532 111 22 33', interest: 'İmplant' },
  { id: 'L-02', name: 'Selin Gür', source: 'Website', status: 'contacted', date: '2 saat önce', phone: '0555 444 55 66', interest: 'Beyazlatma' },
  { id: 'L-03', name: 'Mert Demir', source: 'Referans', status: 'appointed', date: 'Dün', phone: '0542 333 99 88', interest: 'Ortodonti' },
  { id: 'L-04', name: 'Ayşe Can', source: 'Google', status: 'converted', date: '2 gün önce', phone: '0535 777 66 55', interest: 'Genel' },
];

export const CAMPAIGNS: Campaign[] = [
  { id: 'C-01', title: 'İmplant Sonbahar İndirimi', type: 'sms', status: 'active', sentCount: 1500, conversionRate: 4.2, date: '15.10.2023' },
  { id: 'C-02', title: 'Arkadaşını Getir %15 Kazan', type: 'email', status: 'active', sentCount: 3200, conversionRate: 2.1, date: '01.10.2023' },
  { id: 'C-03', title: 'Beyazlatma Fırsatı', type: 'social', status: 'ended', sentCount: 5000, conversionRate: 1.5, date: 'Eylül 2023' },
];

export const SOCIAL_POSTS: SocialPost[] = [
  { id: 'S-01', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600', caption: 'Gülüş tasarımında yeni bir dönem! ✨ Hastamızın 1 haftalık değişimi. Randevu için DM. #dishekimi #gülüştasarımı', platform: 'instagram', status: 'draft', date: 'Taslak' },
  { id: 'S-02', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600', caption: 'Kliniğimizde en son teknoloji cihazlarla ağrısız tedavi imkanı. 🦷', platform: 'instagram', status: 'scheduled', date: 'Yarın 10:00' },
];
