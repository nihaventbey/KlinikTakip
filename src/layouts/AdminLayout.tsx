import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col z-10">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Klinik Takip</h1>
          <p className="text-xs text-gray-500 mt-1">Klinik Yönetim Paneli</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/admin" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <span className="font-medium">Genel Bakış</span>
          </Link>
          <Link to="/admin/patients" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <span className="font-medium">Hastalar</span>
          </Link>
          <Link to="/admin/appointments" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <span className="font-medium">Randevular</span>
          </Link>
          
          {user?.roles.includes('ADMIN') && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Yönetim</p>
              </div>
              <Link to="/admin/settings" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span className="font-medium">Klinik Ayarları</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full text-xs" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}