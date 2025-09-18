// AuthGuard.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const safeParse = (str) => {
  try { return JSON.parse(str); } catch { return null; }
};

export default function AuthGuard() {
  const stored = safeParse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!stored; // or check token: !!stored?.token

  // If logged in, allow protected routes
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
