import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout, AdminLayout } from './components/Layouts';
import { HomePage, ServicesPage, TeamPage, AppointmentPage, ContactPage } from './pages/public/PublicPages';
import { Dashboard, FinancePage, SettingsPage, PatientsPage, TreatmentsAdminPage } from './pages/admin/AdminPages';
import { LabTrackingPage, StaffManagerPage, FormBuilderPage } from './pages/admin/OperationsPages';
import { ClinicalPage } from './pages/admin/ClinicalPages';
import { MarketingPage } from './pages/admin/MarketingPage';
import { AppointmentCalendar } from './pages/admin/AppointmentCalendar';
import { LoginPage } from './pages/admin/Login';
import { KioskPage } from './pages/public/KioskPage';
import { SuperAdminLogin } from './pages/admin/SuperAdminLogin';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import ProtectedRoute from './pages/admin/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
        <Route path="/team" element={<PublicLayout><TeamPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/appointment" element={<PublicLayout><AppointmentPage /></PublicLayout>} />

        {/* Kiosk Mode (Standalone) */}
        <Route path="/kiosk/waiting-room" element={<KioskPage />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* SuperAdmin Routes */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute requiredPermission="MANAGE_SYSTEM">
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/clinical" element={<AdminLayout><ClinicalPage /></AdminLayout>} />
        <Route path="/admin/marketing" element={<AdminLayout><MarketingPage /></AdminLayout>} />
        <Route path="/admin/appointments" element={<AdminLayout><AppointmentCalendar /></AdminLayout>} />
        <Route path="/admin/patients" element={<AdminLayout><PatientsPage /></AdminLayout>} />
        <Route path="/admin/finance" element={<AdminLayout><FinancePage /></AdminLayout>} />
        <Route path="/admin/treatments" element={<AdminLayout><TreatmentsAdminPage /></AdminLayout>} />
        <Route path="/admin/lab" element={<AdminLayout><LabTrackingPage /></AdminLayout>} />
        <Route path="/admin/staff" element={<AdminLayout><StaffManagerPage /></AdminLayout>} />
        <Route path="/admin/forms" element={<AdminLayout><FormBuilderPage /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<div className="p-10 text-center"><h1>Yetkisiz Erişim</h1><p>Bu sayfayı görüntüleme yetkiniz yok.</p></div>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;