import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../src/context/AuthContext'; // Yolu projenize göre ayarlayın
import ProtectedRoute from '../pages/admin/ProtectedRoute';
import { ROLES, PERMISSIONS } from '../pages/admin/roles';

// Sayfa Bileşenleri (Örnek)
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ClinicCalendar from './components/Calendar/ClinicCalendar';
import AddUserForm from './AddUserForm';
import StaffList from './StaffList'; // Yeni bileşeni import et
import Settings from './Settings';
import { SuperAdminDashboard } from './SuperAdminPages'; // Yeni SuperAdmin sayfası
import { SuperAdminLogin } from './SuperAdminLogin'; // Yeni SuperAdmin Login sayfası
import Unauthorized from './pages/Unauthorized';
import Layout from '../../src/components/Layout/Layout'; // Layout bileşeni

// İç bileşen: Context'e erişimi var
const AppRoutes = () => {
  const { user } = useAuth();

  // Kullanıcı giriş yapmışsa Sidebar ve İçerik yapısını göster
  if (user) {
    return (
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route
            path="/calendar"
            element={
              // Örnek: Bu bileşenin içinde veri çekerken `user.clinic_id` kullanılmalıdır.
              // Örneğin: supabase.from('appointments').select('*').eq('clinic_id', user.clinic_id)
              // Bu, kullanıcının sadece kendi kliniğinin randevularını görmesini sağlar.
              <ProtectedRoute user={user} requiredPermission={PERMISSIONS.MANAGE_APPOINTMENTS}>
                <ClinicCalendar />
              </ProtectedRoute>
            }
          />

          {/* Personel Listesi Rotası */}
          <Route
            path="/admin/staff"
            element={
              // Aynı şekilde, personel listesi de sadece o kliniğe ait olmalıdır.
              // Veri çekme: .eq('clinic_id', user.clinic_id)
              <ProtectedRoute user={user} requiredPermission={PERMISSIONS.MANAGE_USERS}>
                <StaffList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute user={user} requiredPermission={PERMISSIONS.MANAGE_USERS}>
                <AddUserForm />
              </ProtectedRoute>
            }
          />
          
          {/* SuperAdmin Satış Portalı */}
          <Route
            path="/superadmin"
            element={
              // SuperAdmin'in clinic_id'si NULL'dur.
              // SuperAdminDashboard içinde veri çekerken clinic_id filtresi KULLANILMAZ.
              <ProtectedRoute user={user} requiredPermission={PERMISSIONS.MANAGE_SYSTEM}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Giriş yapmış kullanıcılar için de Süperadmin Login sayfasını erişilebilir yap */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />

          {/* Ayarlar Sayfası Rotası */}
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/settings" element={<Settings />} />

          {/* Diğer rotalar buraya eklenebilir */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  }

  // Giriş yapmamış kullanıcılar için basit yapı
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
    </AuthProvider>
  );
};

export default App;