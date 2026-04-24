import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute – wraps protected routes.
 * Currently allows all users through; plug in auth check here when needed.
 */
const PrivateRoute: React.FC = () => {
  const isAuthenticated = true; // extend with real auth if needed
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
