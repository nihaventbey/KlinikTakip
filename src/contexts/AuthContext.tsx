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

  // Effect 1: Handle session changes from Supabase
  useEffect(() => {
    // On initial load, get the session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Set loading to false only after the initial session is fetched.
      // The profile fetching will be handled by the next effect.
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Effect 2: React to session changes to fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
            setUser(null);
          } else if (data) {
            const newProfile: Profile = {
              id: data.id,
              clinic_id: data.clinic_id,
              tenant_id: data.tenant_id,
              full_name: data.full_name,
              email: session.user.email!,
              roles: (data.roles || []) as UserRole[],
              created_at: data.created_at,
              is_active: data.is_active
            };
            setUser(newProfile);
          }
        } catch (e) {
          console.error('A critical error occurred while fetching profile:', e);
          setUser(null);
        }
      } else {
        // If there is no session, ensure user is null
        setUser(null);
      }
    };

    fetchProfile();
  }, [session]); // This effect runs whenever the session state changes

  const signOut = async () => {
    await supabase.auth.signOut();
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
  
  // Render children only when loading is false. This prevents rendering protected
  // routes with an incomplete auth state during the initial load.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};