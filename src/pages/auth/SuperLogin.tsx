import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function SuperLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Standart giriş denemesi
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Rol Kontrolü (Ekstra Güvenlik Katmanı)
      // Normal bir doktor yanlışlıkla buraya girerse içeri almamalıyız.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile?.roles?.includes('SUPER_ADMIN')) {
        // Oturumu hemen kapat
        await supabase.auth.signOut();
        throw new Error('YETKİSİZ ERİŞİM: Bu panel sadece sistem yöneticileri içindir.');
      }

      navigate('/sys-admin');
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Sistem Yöneticisi</h2>
          <p className="text-gray-400 mt-2 text-sm">SaaS Yönetim Paneli</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Yönetici Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white font-bold" 
            isLoading={loading}
          >
            Panele Giriş Yap
          </Button>
        </form>
        
      </div>
    </div>
  );
}