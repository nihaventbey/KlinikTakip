
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
  settings: null,
  loading: true,
  refreshSettings: async () => {},
  updateSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const data = db.settings.get();
    setSettings(data);
    setLoading(false);
  };

  const updateSettings = async (newSettings: Partial<ClinicSettings>) => {
    const updated = db.settings.update(newSettings);
    setSettings(updated);
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
