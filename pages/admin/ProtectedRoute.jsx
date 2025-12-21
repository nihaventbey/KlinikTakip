import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLE_PERMISSIONS } from './roles';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ requiredPermission, children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    const loginPath = location.pathname.startsWith('/superadmin') ? '/superadmin/login' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!profile) return null;

  // Yetki kontrolünü profile.role üzerinden yapıyoruz
  const userPermissions = (ROLE_PERMISSIONS && ROLE_PERMISSIONS[profile.role]) || [];

  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    console.warn(`Yetkisiz Erişim: ${profile.role} -> ${requiredPermission}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;