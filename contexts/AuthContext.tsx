
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface AuthContextType {
  session: any | null;
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde oturumu kontrol et
    const savedSession = localStorage.getItem('dentcare_auth');
    if (savedSession) {
      const data = JSON.parse(savedSession);
      setSession(data);
      setProfile({ id: '1', full_name: 'Admin Kullanıcı', role: 'admin' });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    // Demo giriş bilgileri
    if (email === 'admin@klinik.com' && pass === '123456') {
      const mockSession = { user: { email }, access_token: 'fake-token' };
      setSession(mockSession);
      setProfile({ id: '1', full_name: 'Dr. Ahmet Yılmaz', role: 'admin' });
      localStorage.setItem('dentcare_auth', JSON.stringify(mockSession));
    } else {
      throw new Error('E-posta veya şifre hatalı. (Demo: admin@klinik.com / 123456)');
    }
  };

  const signOut = () => {
    setSession(null);
    setProfile(null);
    localStorage.removeItem('dentcare_auth');
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
