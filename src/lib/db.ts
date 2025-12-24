import { supabase } from './supabase';
import { 
  Patient, Task, ClinicSettings, Lead, 
  Transaction, Treatment, InventoryItem, Appointment 
} from '../src/types';

export const db = {
  settings: {
    get: async (clinicId: string) => {
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
    update: async (clinicId: string, data: Partial<ClinicWithSettings>) => {
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

  dashboard: {
    getStats: async (clinicId: string) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayStr = today.toISOString().split('T')[0];
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const [
        { count: todayAppointments },
        { count: activePatients },
        { data: pendingPaymentsData, error: paymentsError }
      ] = await Promise.all([
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('clinic_id', clinicId)
          .gte('start_time', todayStr)
          .lt('start_time', tomorrowStr),
        supabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
          .eq('clinic_id', clinicId)
          .is('deleted_at', null),
        supabase
          .from('patients')
          .select('balance')
          .eq('clinic_id', clinicId)
          .gt('balance', 0)
      ]);
      
      if (paymentsError) throw paymentsError;

      const totalPending = pendingPaymentsData?.reduce((sum, { balance }) => sum + balance, 0) || 0;

      return {
        todayAppointments: todayAppointments || 0,
        activePatients: activePatients || 0,
        pendingPayments: totalPending,
      };
    }
  },

  clinical_notes: {
    getByPatientId: async (patientId: string, clinicId: string) => {
        const { data, error } = await supabase
            .from('clinical_notes')
            .select('*, doctor:doctor_id(full_name)')
            .eq('patient_id', patientId)
            .eq('clinic_id', clinicId)
            .order('updated_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    add: async (note: { note: string; patient_id: string; clinic_id: string; doctor_id: string; }) => {
        const { data, error } = await supabase
            .from('clinical_notes')
            .insert(note)
            .select() // Simplified select to avoid relationship error on insert
            .single();
        if (error) throw error;
        return data;
    }
  },

  patients: {
    getAll: async (clinicId: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Patient[];
    },
    getById: async (patientId: string, clinicId: string) => {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .eq('clinic_id', clinicId)
          .single();
        
        if (error) throw error;
        return data as Patient;
    },
    add: async (patient: Omit<Patient, 'id' | 'created_at' | 'balance'>, clinicId: string) => {
      const { data, error } = await supabase
        .from('patients')
        .insert([{ ...patient, clinic_id: clinicId }])
        .select()
        .single();
      if (error) throw error;
      return data as Patient;
    },
    update: async (patientId: string, updates: Partial<Patient>) => {
        const { data, error } = await supabase
            .from('patients')
            .update(updates)
            .eq('id', patientId)
            .select()
            .single();
        if (error) throw error;
        return data as Patient;
    },
    search: async (query: string, clinicId: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .is('deleted_at', null)
        .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,tc_number.ilike.%${query}%`);
      
      if (error) throw error;
      return data as Patient[];
    },
    getArchived: async (clinicId: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      return data as Patient[];
    },
    searchArchived: async (query: string, clinicId: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .not('deleted_at', 'is', null)
        .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,tc_number.ilike.%${query}%`);
      
      if (error) throw error;
      return data as Patient[];
    }
  },

  staff: {
    getAll: async (clinicId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clinic_id', clinicId);
      
      if (error) throw error;
      return data;
    }
  },

  appointments: {
    getAll: async (clinicId: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patient:patients(full_name)')
        .eq('clinic_id', clinicId)
        .order('start_time', { ascending: true });
      if (error) throw error;
      return data;
    },
    getByPatientId: async (patientId: string, clinicId: string) => {
        const { data, error } = await supabase
            .from('appointments')
            .select(`*, staff:doctor_id ( full_name )`)
            .eq('patient_id', patientId)
            .eq('clinic_id', clinicId)
            .order('start_time', { ascending: false });
        if (error) throw error;
        return data as any;
    },
    add: async (apt: any, clinicId: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...apt, clinic_id: clinicId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: any) => {
        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
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
    getAll: async (clinicId: string) => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, patient:patients(full_name)')
        .eq('clinic_id', clinicId)
        .is('deleted_at', null)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    add: async (trx: any, clinicId: string) => {
        // Here you would ideally use a database function (RPC in Supabase)
        // to ensure atomicity (transaction + patient balance update).
        // For simplicity on the client-side:
        const { data: trxData, error: trxError } = await supabase
            .from('transactions')
            .insert([{ ...trx, clinic_id: clinicId }])
            .select()
            .single();

        if (trxError) throw trxError;

        // Update patient balance
        const { data: patient, error: patientError } = await supabase
            .from('patients')
            .select('balance')
            .eq('id', trx.patient_id)
            .single();
        
        if (patientError) throw patientError;

        const newBalance = (patient.balance || 0) + trx.amount;
        const { error: updateError } = await db.patients.update(trx.patient_id, { balance: newBalance });

        if (updateError) throw updateError;
        
        return trxData;
    },
    update: async (id: string, updates: any) => {
        // Updating a transaction would also require recalculating patient balance,
        // which can get complex. Best handled by a DB function.
        // This is a simplified version.
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    remove: async (id: string) => {
        // Similar to update, deleting needs to revert the balance change.
        // Best handled by a DB function.
        const { data, error } = await supabase
            .from('transactions')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
  },

  treatments: {
    getAll: async (clinicId: string) => {
      const { data, error } = await supabase
        .from('treatments_catalog')
        .select('id, name, category, price, description')
        .eq('clinic_id', clinicId)
        .is('deleted_at', null)
        .order('category', { ascending: true });
      if (error) throw error;
      return data as Treatment[];
    },
    add: async (tr: any, clinicId: string) => {
      const { data, error } = await supabase
        .from('treatments_catalog')
        .insert([{ ...tr, clinic_id: clinicId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('treatments_catalog')
        .update(updates)
        .eq('id', id)
        .select('id, name, category, price, description')
        .single();
      if (error) throw error;
      return data;
    },
    remove: async (id: string) => {
      const { data, error } = await supabase
        .from('treatments_catalog')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
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
  },

  medical_records: {
    getByPatientId: async (patientId: string) => {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .single();
      
      // Supabase returns an error if no row is found with .single(), 
      // but for our case, it's valid for a patient to not have a record yet.
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    upsert: async (record: any) => {
      const { data, error } = await supabase
        .from('medical_records')
        .upsert(record, { onConflict: 'patient_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  tooth_conditions_catalog: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('tooth_conditions_catalog')
        .select('*');
      if (error) throw error;
      return data;
    }
  },

  teeth_records: {
    getByPatientId: async (patientId: string) => {
      const { data, error } = await supabase
        .from('teeth_records')
        .select('*')
        .eq('patient_id', patientId);
      if (error) throw error;
      return data;
    },
    upsert: async (record: { patient_id: string; tooth_number: number; condition: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('teeth_records')
        .upsert(record, { onConflict: 'patient_id,tooth_number' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  patient_files: {
    getByPatientId: async (patientId: string) => {
      const { data, error } = await supabase
        .from('patient_files')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    add: async (file: { patient_id: string, file_name: string, file_url: string, file_type: string }) => {
        const { data, error } = await supabase
            .from('patient_files')
            .insert(file)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
  }
};