import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export default function SuperAdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/sys-login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
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
      </aside>

      <main className="flex-1 bg-gray-100 text-gray-900 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}