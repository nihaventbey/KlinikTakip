import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ClinicSettings } from '../types';

interface SettingsContextType {
  settings: ClinicSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<ClinicSettings>) => Promise<void>;
}

const defaultSettings: ClinicSettings = {
  id: 'default',
  clinic_name: 'DentCare',
  phone: '+90 (212) 555 00 00',
  address: 'Bağdat Cad. İstanbul',
  email: 'info@dentcare.com',
  logo_url: '',
  currency: '₺'
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
  updateSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('clinic_settings').select('*').single();
      if (data) {
        setSettings(data);
      } else {
        // Fallback or init logic if table empty (handled by SQL init usually)
        console.warn('No settings found, using defaults.');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<ClinicSettings>) => {
    try {
      if (!settings.id || settings.id === 'default') return;
      
      const { error } = await supabase
        .from('clinic_settings')
        .update(newSettings)
        .eq('id', settings.id);

      if (error) throw error;
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
