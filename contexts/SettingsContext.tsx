import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClinicWithSettings } from '../types';
import { db } from '../lib/db';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: ClinicWithSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<ClinicWithSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null, 
  loading: true, 
  refreshSettings: async () => {}, 
  updateSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicWithSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const clinicIdStr = profile?.clinic_id; // İlkel değeri çıkar

  const fetchSettings = async (id: string) => {
    try {
      setLoading(true);
      const clinicIdNum = parseInt(id, 10);
      if (isNaN(clinicIdNum)) {
        throw new Error("Geçersiz klinik ID.");
      }
      const data = await db.settings.get(clinicIdNum);
      setSettings(data);
    } catch (e) {
      console.error("Ayarlar yüklenemedi:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<ClinicWithSettings>) => {
    if (!settings?.id) return;
    const updated = await db.settings.update(settings.id, newSettings);
    setSettings(updated);
  };

  useEffect(() => {
    // Bağımlılığı profile nesnesi yerine clinicId'nin ilkel değerine indirge
    if (clinicIdStr) {
      fetchSettings(clinicIdStr);
    } else {
      setSettings(null);
      setLoading(false);
    }
  }, [clinicIdStr]); // Sadece clinicId değiştiğinde çalışır

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: () => clinicIdStr ? fetchSettings(clinicIdStr) : Promise.resolve(), updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);