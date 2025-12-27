import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/db';
import { Button } from '../components/ui/Button';
import { Menu, X } from 'lucide-react'; // İkonlar için

const translateRole = (role: string) => {
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
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };
  const linkClass = (path: string) => 
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-blue-50 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  const sidebarContent = (
    <>
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          K
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Klinik Takip</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{clinic?.name || 'Profesyonel Panel'}</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">Genel</p>
        <Link to="/admin" className={linkClass('/admin')}>
          <span>📊</span> <span className="ml-3">Özet Paneli</span>
        </Link>
        <Link to="/admin/calendar" className={linkClass('/admin/calendar')}>
          <span>📅</span> <span className="ml-3">Takvim</span>
        </Link>

        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">Hasta & Tedavi</p>
        <Link to="/admin/patients" className={linkClass('/admin/patients')}>
          <span>👥</span> <span className="ml-3">Hasta Listesi</span>
        </Link>
        <Link to="/admin/treatments" className={linkClass('/admin/treatments')}>
          <span>💉</span> <span className="ml-3">Tedaviler</span>
        </Link>

        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">Finans & Yönetim</p>
        <Link to="/admin/finance" className={linkClass('/admin/finance')}>
          <span>💰</span> <span className="ml-3">Kasa & Ödemeler</span>
        </Link>
        
        {user?.roles.some(role => role.toLowerCase() === 'admin') && (
          <Link to="/admin/staff" className={linkClass('/admin/staff')}>
            <span>🥼</span> <span className="ml-3">Personel Yönetimi</span>
          </Link>
        )}
        <Link to="/admin/settings" className={linkClass('/admin/settings')}>
            <span>⚙️</span> <span className="ml-3">Ayarlar</span>
        </Link>
      </nav>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.roles.map(translateRole).join(', ')}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full text-xs h-8 border-red-200 text-red-600 hover:bg-red-50" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`w-64 bg-white border-r flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out
                   lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-64">
        <header className="lg:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">{clinic?.name || 'Klinik Takip'}</h1>
          <div className="w-6"></div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}