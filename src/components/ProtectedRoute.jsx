/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Context';

export function ProtectedRoute() {
  // 若 token 為空值就顯示首頁
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
