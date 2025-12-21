// contexts/AuthContext.js (veya ClinicContext.js)

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Supabase istemcinizin yolu

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Oturum kontrolü
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // ÖNEMLİ: Süper Admin kontrolü
      const isSuperAdmin = data.role === 'SUPER_ADMIN';

      // Eğer Süper Admin değilse ve clinic_id yoksa hata fırlatabilir veya logout yapabilirsiniz
      if (!isSuperAdmin && !data.clinic_id) {
        console.error("Kullanıcının kliniği bulunamadı.");
        await supabase.auth.signOut(); // Hatalı durumu önlemek için çıkış yap
        return; // İşlemi durdur
      }

      setProfile(data);
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    // Yardımcı flag'ler
    isSuperAdmin: profile?.role === 'SUPER_ADMIN',
    clinicId: profile?.clinic_id || null, // Süper adminde null olabilir
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

/**
 * 2. MADDE ÇÖZÜMÜ:
 * Bu hook, Süper Admin kontrolünü otomatik yapar.
 * Sayfalarda `supabase.from...` yerine bu hook'u kullanın.
 * 
 * Örnek Kullanım:
 * const { data: patients, loading } = useClinicData('patients');
 */
export const useClinicData = (tableName, options = { select: '*', order: { column: 'created_at', ascending: false } }) => {
  const { profile, isSuperAdmin, clinicId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!profile) return;
    
      try {
        setLoading(true);
        let query = supabase.from(tableName).select(options.select);

        // MANTIK BURADA: Süper Admin değilse klinik filtresi ekle
        if (!isSuperAdmin) {
          query = query.eq('clinic_id', clinicId);
        }

        if (options.order) {
          query = query.order(options.order.column, { ascending: options.order.ascending });
        }

        const { data, error } = await query;
        if (error) throw error;
        setData(data);
      } catch (error) {
        console.error(`${tableName} verisi çekilirken hata:`, error);
        setError(error);
      } finally {
        setLoading(false);
      }
  }, [tableName, JSON.stringify(options), profile, isSuperAdmin, clinicId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
