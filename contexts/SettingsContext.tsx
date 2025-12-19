import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClinicSettings } from '../types';
import { db } from '../lib/db';

interface SettingsContextType {
  settings: ClinicSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<ClinicSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null, loading: true, refreshSettings: async () => {}, updateSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await db.settings.get();
      setSettings(data);
    } catch (e) {
      console.error("Ayarlar yüklenemedi:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<ClinicSettings>) => {
    if (!settings?.id) return;
    const updated = await db.settings.update(settings.id, newSettings);
    setSettings(updated);
  };

  useEffect(() => { fetchSettings(); }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);