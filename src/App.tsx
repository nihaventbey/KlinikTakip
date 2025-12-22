import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Sayfalar
import LandingPage from './pages/public/LandingPage';
import ClinicLogin from './pages/auth/ClinicLogin';
import SuperLogin from './pages/auth/SuperLogin';
import Dashboard from './pages/admin/Dashboard';
import SuperDashboard from './pages/superadmin/Dashboard';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PatientList from './pages/admin/patients/PatientList';
import Dashboard from './pages/admin/Dashboard';
import SuperAdminLayout from './layouts/SuperAdminLayout'; // <-- HATAYI ÇÖZEN SATIR

// Placeholder Component (Henüz yapılmayan sayfalar için)
const ComingSoon = ({ title }: { title: string }) => (
  <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl m-10">
    <h2 className="text-2xl font-bold text-gray-400">{title}</h2>
    <p className="text-gray-500 mt-2">Bu modül geliştirme aşamasındadır.</p>
  </div>
);

// --- GÜVENLİK KORUMALARI (Route Guards) ---

// 1. Sadece giriş yapmış kullanıcılar (Doktorlar, Sekreterler vb.)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// 2. Sadece SÜPER ADMIN (Sen)
const SuperAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isSuperAdmin, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Sistem Kontrolü...</div>;
  if (!isSuperAdmin) return <Navigate to="/sys-login" replace />;
  return children;
};

// 3. Zaten giriş yapmışsa Login sayfasına sokma, panele at
const PublicOnlyRoute = ({ children, type }: { children: JSX.Element, type: 'admin' | 'super' }) => {
  const { user, isSuperAdmin } = useAuth();
  
  if (user) {
    // Eğer süper adminse ve sys-login'e geldiyse -> sys-admin'e at
    if (isSuperAdmin && type === 'super') return <Navigate to="/sys-admin" replace />;
    // Eğer normalse ve login'e geldiyse -> admin'e at
    if (!isSuperAdmin && type === 'admin') return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* KLİNİK PANELİ */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientList />} /> {/* GERÇEK SAYFA */}
            <Route path="calendar" element={<ComingSoon title="Randevu Takvimi" />} />
            <Route path="treatments" element={<ComingSoon title="Tedavi Yönetimi" />} />
            <Route path="finance" element={<ComingSoon title="Finans ve Kasa" />} />
            <Route path="staff" element={<ComingSoon title="Personel Yönetimi" />} />
          </Route>
          {/* --- PUBLIC ALAN --- */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
            <PublicOnlyRoute type="admin"><ClinicLogin /></PublicOnlyRoute>
          } />
          
          <Route path="/sys-login" element={
            <PublicOnlyRoute type="super"><SuperLogin /></PublicOnlyRoute>
          } />

          {/* --- KLİNİK PANELİ (Korumalı) --- */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            {/* İleride eklenecekler: */}
            <Route path="patients" element={<div>Hasta Listesi (Yapılacak)</div>} />
            <Route path="appointments" element={<div>Randevu Takvimi (Yapılacak)</div>} />
            <Route path="settings" element={<div>Ayarlar (Yapılacak)</div>} />
          </Route>

          {/* --- SAAS YÖNETİM PANELİ (Çok Gizli) --- */}
          <Route path="/sys-admin" element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
            <Route index element={<SuperDashboard />} />
            <Route path="tenants" element={<div>Klinik Yönetimi (Yapılacak)</div>} />
            <Route path="plans" element={<div>Paket Ayarları (Yapılacak)</div>} />
          </Route>

          {/* Hatalı URL yakalayıcı */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}