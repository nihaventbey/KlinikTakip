import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  session: Session | null;
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Gereksiz fetch işlemlerini önlemek için son işlenen user ID
  const lastUserId = useRef<string | null>(null);

  const fetchProfile = async (userId: string, email: string) => {
    // Eğer zaten bu kullanıcının verisi yüklüyse ve state doluysa tekrar çekme
    if (lastUserId.current === userId && user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Profil çekiliyor...', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profil yüklenirken hata (Veritabanı):', error);
        // Profil yoksa bile loading'i kapat ki sonsuz döngü olmasın
        setLoading(false);
        return;
      }

      const roles = (data.roles || []) as UserRole[];
      
      const newProfile = {
        id: data.id,
        clinic_id: data.clinic_id,
        tenant_id: data.tenant_id,
        full_name: data.full_name,
        email: email,
        roles: roles,
        created_at: data.created_at,
        is_active: data.is_active
      };

      setUser(newProfile);
      lastUserId.current = userId;
      console.log('Profil yüklendi:', newProfile.full_name);

    } catch (err) {
      console.error('Kritik Auth Hatası:', err);
    } finally {
      // Her durumda loading kapatılmalı
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. İlk Yükleme Kontrolü
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session) {
          setSession(session);
          // Kullanıcı varsa profilini çek
          await fetchProfile(session.user.id, session.user.email!);
        } else {
          // Kullanıcı yoksa yüklemeyi bitir
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth Başlatma Hatası:", e);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // 2. Auth Durum Dinleyicisi (Sekme değişimi, login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth Olayı:", event);

      if (event === 'SIGNED_OUT' || !session) {
        setSession(null);
        setUser(null);
        lastUserId.current = null;
        setLoading(false);
      } 
      else if (session) {
        setSession(session);
        // Kullanıcı değiştiyse veya profil henüz yüklenmediyse çek
        if (session.user.id !== lastUserId.current) {
           await fetchProfile(session.user.id, session.user.email!);
        } else {
           // Kullanıcı aynıysa yükleme ekranını kapat (Burası kritik, eksikse takılı kalır)
           setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    lastUserId.current = null;
    setLoading(false);
  };

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