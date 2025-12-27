import React, { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (!initialSession) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Profile fetch error:', error);
          }

          if (data) {
            // İsim kontrolü: Önce veri tabanı, yoksa metadata, o da yoksa email
            const fullName = data.full_name || 
                             session.user.user_metadata?.full_name || 
                             session.user.email?.split('@')[0] || 
                             'İsimsiz Kullanıcı';
            
            const newProfile: Profile = {
              id: data.id,
              clinic_id: data.clinic_id,
              tenant_id: data.tenant_id,
              full_name: fullName,
              email: session.user.email!,
              roles: (data.roles || []) as UserRole[],
              created_at: data.created_at,
              is_active: data.is_active
            };
            setUser(newProfile);
          }
        } catch (e) {
          console.error('Critical auth error:', e);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isSuperAdmin = user?.roles.includes('SUPER_ADMIN' as UserRole) || 
                      user?.roles.includes('super_admin' as UserRole) || false;
                      
  const isAdmin = user?.roles.includes('ADMIN' as UserRole) || 
                  user?.roles.includes('admin' as UserRole) || false;

  const value = { session, user, loading, isAdmin, isSuperAdmin, signOut };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};