import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => 
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-blue-50 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full z-20">
        <div className="p-6 border-b flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">K</div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Klinik Takip</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Profesyonel Panel</p>
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
          
          {user?.roles.includes('ADMIN') && (
            <Link to="/admin/staff" className={linkClass('/admin/staff')}>
              <span>🥼</span> <span className="ml-3">Personel Yönetimi</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.roles.join(', ')}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full text-xs h-8 border-red-200 text-red-600 hover:bg-red-50" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}