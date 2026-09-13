import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-brand-500 font-mono">
        Loading K.Sam Code School...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
