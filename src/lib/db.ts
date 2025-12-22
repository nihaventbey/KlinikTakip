import { supabase } from './supabase';
import { 
  Patient, Task, ClinicSettings, Lead, 
  Transaction, TreatmentItem, InventoryItem, Appointment 
} from '../src/types';

export const db = {
  settings: {
    get: async (clinicId: number) => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*, clinic_settings(*)') // İlişkiyi tablo adıyla direkt belirt
        .eq('id', clinicId)
        .single();
      
      if (error) {
        console.error('db.settings.get error:', error);
        throw error;
      }
      if (!data) return null;

      const { clinic_settings, ...clinicData } = data;
      
      const result: ClinicWithSettings = {
        ...clinicData,
        settings: Array.isArray(clinic_settings) ? clinic_settings[0] || null : clinic_settings,
      };

      return result;
    },
    update: async (clinicId: number, data: Partial<ClinicWithSettings>) => {
      const { settings, ...clinicInfo } = data;

      // 1. 'clinics' tablosunu (temel bilgiler) güncelle
      if (Object.keys(clinicInfo).length > 0) {
        const { error } = await supabase
          .from('clinics')
          .update(clinicInfo)
          .eq('id', clinicId);
        if (error) throw error;
      }

      // 2. 'clinic_settings' tablosunu (ayar bilgileri) "upsert" et
      if (settings && Object.keys(settings).length > 0) {
        const { error } = await supabase
          .from('clinic_settings')
          .upsert({ ...settings, clinic_id: clinicId });
        if (error) throw error;
      }

      // 3. Güncellenmiş veriyi birleşik olarak yeniden çek ve döndür
      const updatedData = await db.settings.get(clinicId);
      return updatedData;
    }
  },

  patients: {
    getAll: async () => {
      const { data, error } = await supabase.from('patients').select('*').order('full_name', { ascending: true });
      if (error) throw error;
      return data as Patient[];
    },
    add: async (patient: Omit<Patient, 'id'>) => {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').single();
      const { data, error } = await supabase
        .from('patients')
        .insert([{ ...patient, clinic_id: profile?.clinic_id }])
        .select()
        .single();
      if (error) throw error;
      return data as Patient;
    },
    search: async (query: string) => {
      const { data, error } = await supabase.from('patients').select('*').ilike('full_name', `%${query}%`);
      if (error) throw error;
      return data as Patient[];
    }
  },

  appointments: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patient:patients(full_name)')
        .order('start_time', { ascending: true });
      if (error) throw error;
      return data;
    },
    add: async (apt: any) => {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').single();
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...apt, clinic_id: profile?.clinic_id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  leads: {
    getAll: async () => {
      const { data, error } = await supabase.from('marketing_leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
    add: async (lead: any) => {
      const { error } = await supabase.from('marketing_leads').insert([lead]);
      if (error) throw error;
    },
    updateStatus: async (id: string, status: string) => {
      const { error } = await supabase.from('marketing_leads').update({ status }).eq('id', id);
      if (error) throw error;
    }
  },

  transactions: {
    getAll: async () => {
      const { data, error } = await supabase.from('transactions').select('*, patient:patients(full_name)').order('transaction_date', { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    add: async (trx: any) => {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').single();
      const { data, error } = await supabase.from('transactions').insert([{ ...trx, clinic_id: profile?.clinic_id }]).select().single();
      if (error) throw error;
      return data;
    }
  },

  treatments: {
    getAll: async () => {
      const { data, error } = await supabase.from('treatments_catalog').select('*').order('category', { ascending: true });
      if (error) throw error;
      return data as TreatmentItem[];
    },
    add: async (tr: any) => {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').single();
      const { data, error } = await supabase.from('treatments_catalog').insert([{ ...tr, clinic_id: profile?.clinic_id }]).select().single();
      if (error) throw error;
      return data;
    }
  },

  inventory: {
    getAll: async () => {
      const { data, error } = await supabase.from('inventory').select('*').order('name', { ascending: true });
      if (error) throw error;
      return data as InventoryItem[];
    },
    update: async (id: string, data: any) => {
      const { error } = await supabase.from('inventory').update(data).eq('id', id);
      if (error) throw error;
    }
  },

  tasks: {
    getAll: async () => {
      const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
      if (error) throw error;
      return data as Task[];
    },
    add: async (task: any) => {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').single();
      const { data, error } = await supabase.from('tasks').insert([{ ...task, clinic_id: profile?.clinic_id }]).select().single();
      if (error) throw error;
      return data;
    },
    toggle: async (id: string, currentStatus: string) => {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
    }
  }
};