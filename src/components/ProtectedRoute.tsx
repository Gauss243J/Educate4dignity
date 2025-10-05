import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/authContext';
import { UserRole } from '../types';

interface Props { roles?: UserRole[]; element: React.ReactElement; }
export const ProtectedRoute: React.FC<Props> = ({ roles, element }) => {
  const { user } = useAuth();
  // In development, bypass protection to ease local testing
  if (import.meta.env?.DEV) return element;
  if(!user) return <Navigate to="/login" replace />;
  if(roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return element;
};
