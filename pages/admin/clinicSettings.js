// Klinik Genel Ayarları
export const CLINIC_CONFIG = {
  workingHours: {
    start: '09:00',
    end: '18:00',
    lunchBreak: { start: '12:30', end: '13:30' },
    closedDays: ['Sunday'], // Pazar kapalı
  },
  slotDuration: 15, // Takvimdeki minimum zaman dilimi (dakika)
};

// Tedavi ve Fiyat Listesi (Süreler dahil)
export const TREATMENTS = [
  {
    id: 't1',
    name: 'Diş Taşı Temizliği',
    price: 750,
    currency: 'TRY',
    durationMinutes: 30, // Randevu süresi
  },
  {
    id: 't2',
    name: 'Kanal Tedavisi (Tek Diş)',
    price: 2500,
    currency: 'TRY',
    durationMinutes: 60,
  },
  {
    id: 't3',
    name: 'İmplant Uygulaması',
    price: 12000,
    currency: 'TRY',
    durationMinutes: 90,
  },
  {
    id: 't4',
    name: 'Genel Muayene',
    price: 400,
    currency: 'TRY',
    durationMinutes: 15,
  },
];

// Personel Listesi
export const STAFF = [
  { id: 'd1', name: 'Dr. Ahmet Yılmaz', role: 'DOCTOR', specialization: 'Endodonti', commissionRate: 0.40 },
  { id: 'd2', name: 'Dr. Elif Kaya', role: 'DOCTOR', specialization: 'Ortodonti', commissionRate: 0.45 },
  { id: 's1', name: 'Zeynep Demir', role: 'SECRETARY', commissionRate: 0 },
];