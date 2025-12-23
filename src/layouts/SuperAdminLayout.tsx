import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Menu } from 'lucide-react';

export default function SuperAdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/sys-login');
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-red-500">SaaS YÖNETİM</h1>
        <p className="text-xs text-gray-400 mt-1">Süper Admin Paneli</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link to="/sys-admin" className="block px-4 py-3 rounded hover:bg-gray-700 transition-colors">
          Genel Durum
        </Link>
        <Link to="/sys-admin/tenants" className="block px-4 py-3 rounded hover:bg-gray-700 transition-colors">
          Klinikler (Tenants)
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button variant="danger" className="w-full" onClick={handleLogout}>
          Güvenli Çıkış
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`w-64 bg-gray-800 border-r border-gray-700 flex-flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out
                   lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-64">
        <header className="lg:hidden bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6 text-gray-200" />
          </button>
          <h1 className="text-lg font-bold text-red-500">SaaS YÖNETİM</h1>
          <div className="w-6"></div>
        </header>
        
        <main className="flex-1 bg-gray-100 text-gray-900 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}