import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Sayfalar
import LandingPage from './pages/public/LandingPage';
import ClinicLogin from './pages/auth/ClinicLogin';
import SuperLogin from './pages/auth/SuperLogin';
import Dashboard from './pages/admin/Dashboard';
import SuperDashboard from './pages/superadmin/Dashboard';
import PatientList from './pages/admin/patients/PatientList';
import PatientDetail from './pages/admin/patients/PatientDetail';
import ArchivedPatientList from './pages/admin/patients/ArchivedPatientList';
import CalendarPage from './pages/admin/CalendarPage';
import TreatmentListPage from './pages/admin/treatments/TreatmentListPage';
import FinancePage from './pages/admin/finance/FinancePage';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Placeholder Component (Henüz yapılmayan sayfalar için)
const ComingSoon = ({ title }: { title: string }) => (
  <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl m-4 lg:m-10">
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
  const { user, isSuperAdmin, loading } = useAuth();
  
  if(loading) return <div className="flex h-screen items-center justify-center">Yönlendiriliyor...</div>;

  if (user) {
    if (isSuperAdmin && type === 'super') return <Navigate to="/sys-admin" replace />;
    if (!isSuperAdmin && type === 'admin') return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* --- PUBLIC ALAN --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute type="admin"><ClinicLogin /></PublicOnlyRoute>} />
          <Route path="/sys-login" element={<PublicOnlyRoute type="super"><SuperLogin /></PublicOnlyRoute>} />

          {/* --- KLİNİK PANELİ (Korumalı) --- */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/:patientId" element={<PatientDetail />} /> 
            <Route path="patients/archived" element={<ArchivedPatientList />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="treatments" element={<TreatmentListPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="staff" element={<ComingSoon title="Personel Yönetimi" />} />
            <Route path="settings" element={<ComingSoon title="Ayarlar" />} />
          </Route>

          {/* --- SAAS YÖNETİM PANELİ (Süper Admin) --- */}
          <Route path="/sys-admin" element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
            <Route index element={<SuperDashboard />} />
            <Route path="tenants" element={<ComingSoon title="Klinik Yönetimi" />} />
            <Route path="plans" element={<ComingSoon title="Paket Ayarları" />} />
          </Route>

          {/* Hatalı URL yakalayıcı */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}