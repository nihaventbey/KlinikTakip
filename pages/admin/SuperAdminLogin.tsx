import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';

export const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Başarılı girişte direkt SuperAdmin paneline yönlendir
      navigate('/superadmin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-surface-dim">
      {/* Sol Taraf - Görsel Alan */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent mix-blend-multiply"></div>
        <div className="relative z-10 p-12 h-full flex flex-col justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
            <span className="text-2xl font-bold tracking-tight">DentCare Admin</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Sistem Yönetimi</h2>
            <p className="text-white/80 text-lg font-medium">Bu alan sadece yetkili sistem yöneticileri içindir.</p>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md flex flex-col gap-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SuperAdmin Girişi</h1>
            <p className="text-gray-500">Lütfen yönetici bilgilerinizle oturum açın.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">E-Posta</label>
              <input 
                type="email" 
                autoComplete="email"
                className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 text-base focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Şifre</label>
              <input 
                type="password" 
                autoComplete="current-password"
                className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 text-base focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button className="h-14 text-base mt-2 bg-purple-600 hover:bg-purple-700 border-transparent" disabled={loading}>
              {loading ? 'Giriş Yapılıyor...' : 'Yönetici Girişi Yap'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};