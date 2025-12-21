import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE_PERMISSIONS } from './roles';
import { logAction } from './auditLogger';
import { useAuth } from '../../contexts/AuthContext';

// user prop'u opsiyonel hale getirildi (varsayılan değer: null)
const ProtectedRoute = ({ user: propUser = null, requiredPermission, children }) => {
  const { user: contextUser } = useAuth();
  const user = propUser || contextUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ROLE_PERMISSIONS undefined ise boş dizi döndür (Hata önleme)
  const userPermissions = (ROLE_PERMISSIONS && ROLE_PERMISSIONS[user.role]) || [];

  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    // Yetkisiz erişim denemesi loglanır
    logAction(user, 'UNAUTHORIZED_ACCESS_ATTEMPT', 'ROUTE', { required: requiredPermission });
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;