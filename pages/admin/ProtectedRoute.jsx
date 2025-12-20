import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE_PERMISSIONS } from '../../config/roles';
import { logAction } from '../../utils/auditLogger';

const ProtectedRoute = ({ user, requiredPermission, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];

  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    // Yetkisiz erişim denemesi loglanır
    logAction(user, 'UNAUTHORIZED_ACCESS_ATTEMPT', 'ROUTE', { required: requiredPermission });
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;