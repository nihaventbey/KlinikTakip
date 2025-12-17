
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
  hero_subtitle: 'Yapay zeka destekli simülatörümüzle tedavinizi önceden görün. Ağrısız, hızlı ve konforlu bir deneyim için hemen randevu alın.',
  hero_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop',
  service_highlight_title: 'Gülüş Tasarımı (Hollywood Smile)',
  service_highlight_desc: 'Hastamızın çapraşık diş yapısı ve renk tonu şikayetleri, 6 günlük zirkonyum kaplama tedavisi ile giderildi. Yüz hattına uygun, doğal ve parlak bir gülüş tasarlandı.',
  service_before_img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070',
  service_after_img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070',
  service_duration: '6 Gün',
  service_teeth_count: '20 Diş',
  features: [
    { id: '1', title: 'İmplant Tedavisi', icon: 'medical_services', desc: 'Eksik dişleriniz için kalıcı ve doğal görünümlü çözümler.' },
    { id: '2', title: 'Diş Beyazlatma', icon: 'auto_awesome', desc: 'Lazer teknolojisi ile daha parlak ve beyaz bir gülüş.' },
    { id: '3', title: 'Ortodonti', icon: 'face', desc: 'Şeffaf plaklar ve tellerle diş çapraşıklıklarını düzeltiyoruz.' }
  ],
  testimonials: [
    { id: '1', name: 'Zeynep K.', treatment: 'İmplant', text: 'İmplant sürecim korktuğumdan çok daha rahat geçti. Teşekkürler!' },
    { id: '2', name: 'Ali R.', treatment: 'Beyazlatma', text: 'Dişlerim hiç bu kadar beyaz olmamıştı. Çok memnun kaldım.' }
  ]
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
