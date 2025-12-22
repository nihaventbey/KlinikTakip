import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
  isSuperAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id, session.user.email!);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id, session.user.email!);
      else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Veritabanındaki text[] dizisini UserRole[] olarak algıla
      const roles = (data.roles || []) as UserRole[];
      const isSuperAdmin = roles.includes('SUPER_ADMIN');

      setUser({
        id: userId,
        email,
        full_name: data.full_name || email,
        roles: roles,
        clinic_id: data.clinic_id,
        tenant_id: data.tenant_id,
        is_super_admin: isSuperAdmin,
      });
    } catch (err) {
      console.error('Profil yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole) => user?.roles.includes(role) || false;

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, isSuperAdmin: user?.is_super_admin || false, hasRole, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};