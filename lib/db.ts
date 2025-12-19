import { supabase } from './supabase';
import { 
  Patient, Task, ClinicSettings, Lead, 
  Transaction, TreatmentItem, InventoryItem, Appointment 
} from '../types';

export const db = {
  settings: {
    get: async () => {
      const { data, error } = await supabase.from('clinic_settings').select('*').single();
      if (error) throw error;
      return data as ClinicSettings;
    },
    update: async (id: string, data: Partial<ClinicSettings>) => {
      const { data: updated, error } = await supabase
        .from('clinic_settings')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return updated as ClinicSettings;
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