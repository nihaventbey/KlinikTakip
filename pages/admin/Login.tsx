import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/UI';
import { supabase } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtjJXOX9mhLd_6LlQxUwXLHCooROVUqEz598fOvAVUHwA_ReOI8Kma5iw8_Pmj2yWaqtnf9HuTxgizj-MEM2u2HrRgOH6dduaVNuHsNKkfI2rhm88BRwx7nsyFs6ijb2HZgUoRQfDz4mmo3gkks0TirprBfTJ86MLL6o9bff1KXYbwW57Kd73MpBi1eiVMtZlP8GtTJeL2U94gyBLkSZ1ROp7yiciPddqJUS7cNAhiVVItn_Biu7hP0Ocf7jojU-P4vVepFvDncHaU')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent mix-blend-multiply"></div>
        
        <div className="relative z-10 p-12 h-full flex flex-col justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-4xl">dentistry</span>
            <span className="text-2xl font-bold tracking-tight">DentiCare</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Gülümsemeleri Yönetmek Artık Çok Daha Kolay.</h2>
            <p className="text-white/80 text-lg font-medium">Güvenli, hızlı ve entegre klinik yönetim platformuna hoş geldiniz.</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md flex flex-col gap-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personel Girişi</h1>
            <p className="text-gray-500">Lütfen devam etmek için kimlik bilgilerinizi giriniz.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">E-Posta Adresi</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="isim@klinik.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Şifre</label>
                <a href="#" className="text-sm text-primary font-semibold hover:underline">Şifremi Unuttum?</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">visibility</span>
              </div>
            </div>

            <Button className="h-14 text-base mt-2" disabled={loading}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2024 DentiCare Klinik Yönetim Sistemleri.<br />Güvenli bağlantı (SSL) ile korunmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
};
