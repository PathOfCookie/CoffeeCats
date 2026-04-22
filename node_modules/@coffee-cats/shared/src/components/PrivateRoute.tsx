// packages/shared/src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  children?: React.ReactNode;
  isAuthenticated: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};