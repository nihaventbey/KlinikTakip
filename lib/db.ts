
import { Patient, Task, ClinicSettings, Lead, Transaction, TreatmentItem, InventoryItem, Appointment } from '../types';

const INITIAL_SETTINGS: ClinicSettings = {
  id: '1',
  clinic_name: 'Burak Çintaş Kliniği',
  phone: '+90 (312) 000 00 00',
  address: 'Kızılay, Çankaya / ANKARA',
  email: 'iletisim@cintasklinik.com',
  logo_url: '',
  currency: '₺',
  hero_title: 'Hayalinizdeki Gülüşe Sanal Olarak Bakın',
  hero_subtitle: 'Ağrısız, hızlı ve konforlu bir deneyim için hemen randevu alın.',
  hero_catchy_text: 'Siz sadece gülümseyin, gerisini uzman kadromuz ve en yeni teknolojilerimizle biz tasarlayalım. Türkiye\'nin en gelişmiş dijital diş hekimliği laboratuvarı ile tanışın.',
  hero_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop',
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068', caption: 'Modern Muayene Odalarımız' },
    { id: '2', url: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?q=80&w=2070', caption: 'En Son Teknoloji Cihazlar' },
    { id: '3', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070', caption: 'Hijyenik ve Ferah Alanlar' },
    { id: '4', url: 'https://images.unsplash.com/photo-1594824476969-519478cae327?q=80&w=2070', caption: 'Uzman Klinik Kadromuz' }
  ],
  features_title: 'Neden Biz?',
  features_subtitle: 'Uzman kadromuz ve teknolojik altyapımızla size en iyi hizmeti sunuyoruz.',
  features: [
    { id: '1', title: 'İmplant Tedavisi', icon: 'medical_services', desc: 'Eksik dişleriniz için kalıcı ve doğal görünümlü çözümler.' },
    { id: '2', title: 'Diş Beyazlatma', icon: 'auto_awesome', desc: 'Lazer teknolojisi ile daha parlak ve beyaz bir gülüş.' },
    { id: '3', title: 'Ortodonti', icon: 'face', desc: 'Şeffaf plaklar ve tellerle diş çapraşıklıklarını düzeltiyoruz.' }
  ],
  service_highlight_title: 'Gülüş Tasarımı (Hollywood Smile)',
  service_highlight_desc: 'Hastamızın çapraşık diş yapısı ve renk tonu şikayetleri, 6 günlük zirkonyum kaplama tedavisi ile giderildi. Yüz hattına uygun, doğal ve parlak bir gülüş tasarlandı.',
  service_before_img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070',
  service_after_img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070',
  service_duration: '6 Gün',
  service_teeth_count: '20 Diş',
  testimonials_title: 'Mutlu Gülüşler',
  testimonials_subtitle: 'Hastalarımızın deneyimleri bizim en büyük referansımızdır.',
  testimonials: [
    { id: '1', name: 'Zeynep K.', treatment: 'İmplant', text: 'İmplant sürecim korktuğumdan çok daha rahat geçti. Teşekkürler!' },
    { id: '2', name: 'Ali R.', treatment: 'Beyazlatma', text: 'Dişlerim hiç bu kadar beyaz olmamıştı. Çok memnun kaldım.' }
  ],
  team_title: 'Uzman Doktor Kadromuz',
  team_subtitle: 'Alanında uzman hekimlerimizle sağlığınız emin ellerde.',
  doctors: [
    { id: 'd1', name: 'Dr. Ahmet Yılmaz', title: 'Başhekim', specialty: 'Çene Cerrahı', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070' },
    { id: 'd2', name: 'Dr. Ayşe Demir', title: 'Uzman Doktor', specialty: 'Ortodontist', image: 'https://images.unsplash.com/photo-1594824476969-519478cae327?q=80&w=2070' }
  ],
  working_hours_weekdays: '09:00 - 19:00',
  working_hours_saturday: '09:00 - 14:00',
  social_instagram: 'https://instagram.com/klinik',
  social_facebook: 'https://facebook.com/klinik'
};

const get = <T>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(`dentcare_${key}`);
  return saved ? JSON.parse(saved) : defaultValue;
};

const set = (key: string, value: any) => {
  localStorage.setItem(`dentcare_${key}`, JSON.stringify(value));
  window.dispatchEvent(new Event('storage_update'));
};

export const db = {
  settings: {
    get: () => get<ClinicSettings>('settings', INITIAL_SETTINGS),
    update: (data: Partial<ClinicSettings>) => {
      const current = db.settings.get();
      const updated = { ...current, ...data };
      set('settings', updated);
      return updated;
    }
  },
  patients: {
    getAll: () => get<Patient[]>('patients', []),
    add: (p: Omit<Patient, 'id'>) => {
      const list = db.patients.getAll();
      const newItem = { ...p, id: 'p' + Math.random().toString(36).substr(2, 5) };
      set('patients', [newItem, ...list]);
      return newItem;
    },
    search: (query: string) => db.patients.getAll().filter(p => p.full_name.toLowerCase().includes(query.toLowerCase()))
  },
  appointments: {
    getAll: () => get<Appointment[]>('appointments', []),
    add: (a: Omit<Appointment, 'id'>) => {
      const list = db.appointments.getAll();
      const newItem = { ...a, id: 'a' + Math.random().toString(36).substr(2, 5) };
      set('appointments', [newItem, ...list]);
      return newItem;
    }
  },
  leads: {
    getAll: () => get<Lead[]>('leads', []),
    updateStatus: (id: string, status: Lead['status']) => {
      const list = db.leads.getAll();
      set('leads', list.map(l => l.id === id ? { ...l, status } : l));
    }
  },
  transactions: {
    getAll: () => get<Transaction[]>('transactions', []),
    add: (t: Omit<Transaction, 'id'>) => {
      const list = db.transactions.getAll();
      const newItem = { ...t, id: 'trx' + Math.random().toString(36).substr(2, 5) };
      set('transactions', [newItem, ...list]);
      return newItem;
    }
  },
  treatments: {
    getAll: () => get<TreatmentItem[]>('treatments', []),
    add: (t: Omit<TreatmentItem, 'id'>) => {
      const list = db.treatments.getAll();
      const newItem = { ...t, id: 'tr' + Math.random().toString(36).substr(2, 5) };
      set('treatments', [newItem, ...list]);
      return newItem;
    }
  },
  inventory: {
    getAll: () => get<InventoryItem[]>('inventory', []),
    update: (id: string, data: Partial<InventoryItem>) => {
      const list = db.inventory.getAll();
      set('inventory', list.map(item => item.id === id ? { ...item, ...data } : item));
    }
  },
  tasks: {
    getAll: () => get<Task[]>('tasks', []),
    add: (task: Omit<Task, 'id'>) => {
      const list = db.tasks.getAll();
      const newTask = { ...task, id: 't' + Math.random().toString(36).substr(2, 5) };
      set('tasks', [newTask, ...list]);
      return newTask;
    },
    toggle: (id: string) => {
        const list = db.tasks.getAll();
        set('tasks', list.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
    }
  }
};
