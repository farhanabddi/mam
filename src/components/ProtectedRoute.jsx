import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If no user is logged in, redirect them immediately to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;