
import { Patient, Task, ClinicSettings, LabOrder, Campaign, Lead, Transaction, TreatmentItem, InventoryItem, Appointment } from '../types';

const INITIAL_SETTINGS: ClinicSettings = {
  id: '1',
  clinic_name: 'Burak Çintaş Kliniği',
  phone: '+90 (312) 000 00 00',
  address: 'Kızılay, Çankaya / ANKARA',
  email: 'iletisim@cintasklinik.com',
  logo_url: '',
  currency: '₺'
};

const INITIAL_PATIENTS: Patient[] = [
  { id: 'p1', full_name: 'Zeynep Yılmaz', phone: '0555 111 22 33', status: 'active', balance: 0, ltv: 12500, created_at: '2023-10-01T10:00:00Z' },
  { id: 'p2', full_name: 'Ali Vural', phone: '0532 222 33 44', status: 'new', balance: 1500, ltv: 1500, created_at: '2023-10-15T14:30:00Z' },
  { id: 'p3', full_name: 'Ayşe Kaya', phone: '0544 333 44 55', status: 'active', balance: 0, ltv: 8400, created_at: '2023-09-20T09:15:00Z' }
];

const INITIAL_TREATMENTS: TreatmentItem[] = [
  { id: 'tr1', name: 'Zirkonyum Kaplama', category: 'Estetik', price: 4500, duration: '60' },
  { id: 'tr2', name: 'İmplant (Tek Diş)', category: 'Cerrahi', price: 15000, duration: '45' },
  { id: 'tr3', name: 'Diş Beyazlatma', category: 'Estetik', price: 3000, duration: '30' },
  { id: 'tr4', name: 'Kanal Tedavisi', category: 'Genel Diş', price: 2500, duration: '45' }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'İmplant Vidası 4mm', category: 'Cerrahi', stock: 15, unit: 'Adet', minLevel: 5, status: 'ok' },
  { id: 'inv2', name: 'Zirkonyum Blok', category: 'Protez', stock: 8, unit: 'Blok', minLevel: 10, status: 'low' },
  { id: 'inv3', name: 'Lokal Anestezi Ampül', category: 'Sarf', stock: 120, unit: 'Adet', minLevel: 50, status: 'ok' }
];

const INITIAL_LEADS: Lead[] = [
  { id: 'l1', name: 'Murat Can', source: 'Instagram', status: 'new', date: '2023-10-23', phone: '0555 000 11 22', interest: 'Hollywood Smile' },
  { id: 'l2', name: 'Selin Arı', source: 'Google', status: 'contacted', date: '2023-10-22', phone: '0555 333 44 55', interest: 'İmplant' }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
    { id: 'a1', patientName: 'Zeynep Yılmaz', doctorName: 'Dr. Ahmet Yılmaz', treatment: 'Muayene', date: '2023-10-24', time: '10:00', duration: 30, status: 'confirmed', type: 'visit' },
    { id: 'a2', patientName: 'Ali Vural', doctorName: 'Dr. Ayşe Demir', treatment: 'Kanal Tedavisi', date: '2023-10-24', time: '11:30', duration: 60, status: 'ongoing', type: 'operation' }
];

const get = <T>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(`dentcare_${key}`);
  return saved ? JSON.parse(saved) : defaultValue;
};

const set = (key: string, value: any) => {
  localStorage.setItem(`dentcare_${key}`, JSON.stringify(value));
  window.dispatchEvent(new Event('storage_update')); // Custom event for sync
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
    getAll: () => get<Patient[]>('patients', INITIAL_PATIENTS),
    getById: (id: string) => db.patients.getAll().find(p => p.id === id),
    add: (p: Omit<Patient, 'id'>) => {
      const list = db.patients.getAll();
      const newItem = { ...p, id: 'p' + Math.random().toString(36).substr(2, 5) };
      set('patients', [newItem, ...list]);
      return newItem;
    },
    search: (query: string) => db.patients.getAll().filter(p => p.full_name.toLowerCase().includes(query.toLowerCase()))
  },
  treatments: {
    getAll: () => get<TreatmentItem[]>('treatments', INITIAL_TREATMENTS),
    add: (t: Omit<TreatmentItem, 'id'>) => {
      const list = db.treatments.getAll();
      const newItem = { ...t, id: 'tr' + Math.random().toString(36).substr(2, 5) };
      set('treatments', [newItem, ...list]);
      return newItem;
    }
  },
  inventory: {
    getAll: () => get<InventoryItem[]>('inventory', INITIAL_INVENTORY),
    update: (id: string, data: Partial<InventoryItem>) => {
      const list = db.inventory.getAll();
      const updated = list.map(item => item.id === id ? { ...item, ...data } : item);
      set('inventory', updated);
    }
  },
  leads: {
    getAll: () => get<Lead[]>('leads', INITIAL_LEADS),
    updateStatus: (id: string, status: Lead['status']) => {
      const list = db.leads.getAll();
      set('leads', list.map(l => l.id === id ? { ...l, status } : l));
    }
  },
  appointments: {
    getAll: () => get<Appointment[]>('appointments', INITIAL_APPOINTMENTS),
    add: (a: Omit<Appointment, 'id'>) => {
      const list = db.appointments.getAll();
      const newItem = { ...a, id: 'a' + Math.random().toString(36).substr(2, 5) };
      set('appointments', [newItem, ...list]);
      return newItem;
    }
  },
  transactions: {
    getAll: () => get<Transaction[]>('transactions', [
      { id: 'trx1', patient: 'Zeynep Yılmaz', type: 'income', amount: 4500, date: '2023-10-23', status: 'paid' },
      { id: 'trx2', patient: 'Kira Ödemesi', type: 'expense', amount: 15000, date: '2023-10-01', status: 'paid' }
    ]),
    add: (t: Omit<Transaction, 'id'>) => {
        const list = db.transactions.getAll();
        const nt = { ...t, id: 'trx' + Math.random().toString(36).substr(2, 5) };
        set('transactions', [nt, ...list]);
        return nt;
    }
  },
  tasks: {
    getAll: () => get<Task[]>('tasks', [
        { id: 't1', title: 'Stok sayımı yapılacak', priority: 'high', status: 'pending', assignee: 'Aslı', due_date: '2023-10-25' },
        { id: 't2', title: 'Dosyalar düzenlenecek', priority: 'medium', status: 'completed', assignee: 'Burcu', due_date: '2023-10-24' }
    ]),
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
