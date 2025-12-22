import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  session: Session | null;
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;      // Klinik Yöneticisi (ADMIN rolü)
  isSuperAdmin: boolean; // SaaS Sahibi (SUPER_ADMIN rolü)
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Veritabanından detaylı kullanıcı profilini çek
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profil yüklenirken hata:', error);
        // Profil yoksa bile session var olabilir, ama user null kalır.
        return;
      }

      // Rolleri güvenli bir şekilde al
      const roles = (data.roles || []) as UserRole[];

      setUser({
        id: data.id,
        clinic_id: data.clinic_id,
        tenant_id: data.tenant_id,
        full_name: data.full_name,
        email: email,
        roles: roles,
        created_at: data.created_at
      });

    } catch (err) {
      console.error('Kritik Auth Hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Sayfa yenilendiğinde oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setLoading(false);
      }
    });

    // 2. Login/Logout olaylarını dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Sadece user state boşsa yeniden çek (gereksiz fetch'i önle)
        if (!user) {
            setLoading(true);
            fetchProfile(session.user.id, session.user.email!);
        }
      } else {
        // Çıkış yapıldı
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Local storage temizliği gerekirse buraya eklenebilir
  };

  // Rol kontrolü (Helpers)
  const isSuperAdmin = user?.roles.includes('SUPER_ADMIN') || false;
  const isAdmin = user?.roles.includes('ADMIN') || false;

  const value = {
    session,
    user,
    loading,
    isAdmin,
    isSuperAdmin,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};