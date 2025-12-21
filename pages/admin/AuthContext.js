import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Mevcut oturumu kontrol et
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserRole(session.user);
      } else {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Oturum değişikliklerini dinle (Giriş/Çıkış)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserRole(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (authUser) => {
    try {
      // public.profiles tablosundan rolü çek
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authUser.id)
        .single();

      // Auth verisi ile profil verisini birleştir
      setUser({
        ...authUser,
        role: profile?.role || 'PATIENT', // Varsayılan rol
        name: profile?.full_name || authUser.email
      });
    } catch (error) {
      console.error('Rol çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, supabase, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);