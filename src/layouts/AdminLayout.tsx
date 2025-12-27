import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/db';
import { Button } from '../components/ui/Button';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  UserCircle,
  CreditCard,
  ClipboardList
} from 'lucide-react';

const translateRole = (role: string) => {
  if (!role) return '';
  switch (role.toLowerCase()) {
    case 'admin': return 'Yönetici';
    case 'doctor': return 'Doktor';
    case 'assistant': return 'Asistan';
    case 'receptionist': return 'Resepsiyonist';
    case 'accountant': return 'Muhasebeci';
    case 'super_admin': return 'Süper Yönetici';
    case 'superadmin': return 'Süper Yönetici';
    default: return role;
  }
};

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { data: clinic } = useQuery({
    queryKey: ['clinic', user?.clinic_id],
    queryFn: () => db.settings.get(user!.clinic_id!),
    enabled: !!user?.clinic_id,
  });

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Randevu Takvimi', icon: Calendar, path: '/admin/calendar' },
    { label: 'Hastalar', icon: Users, path: '/admin/patients' },
    { label: 'Personel Yönetimi', icon: Users, path: '/admin/staff' },
    { label: 'Finans', icon: CreditCard, path: '/admin/finance' },
    { label: 'Tedaviler', icon: ClipboardList, path: '/admin/treatments' },
    { label: 'Klinik Ayarları', icon: Settings, path: '/admin/settings' },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {clinic?.name?.charAt(0) || 'K'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="font-bold text-gray-900 truncate">
              {clinic?.name || 'Klinik Takip'}
            </h1>
            <p className="text-xs text-gray-500 truncate">Dental Yönetim Paneli</p>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Kullanıcı Profili ve Çıkış Bölümü */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600">
            <UserCircle size={24} />
          </div>
          <div className="flex-1 overflow-hidden">
            {/* BURASI KRİTİK: AuthContext'ten gelen full_name gösteriliyor */}
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.full_name || 'İsimsiz Kullanıcı'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.roles?.map(role => translateRole(role)).join(', ')}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full text-xs h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          Çıkış Yap
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobil Karartma */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Masaüstü ve Mobil */}
      <aside 
        className={`w-64 bg-white border-r flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out
                   lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>

      {/* Ana İçerik Alanı */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Mobil Header */}
        <header className="lg:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
              {clinic?.name?.charAt(0) || 'K'}
            </div>
            <span className="font-bold text-gray-900 text-sm truncate max-w-[150px]">
              {clinic?.name}
            </span>
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}