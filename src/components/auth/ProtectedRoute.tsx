import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const { isSignedIn, isLoaded } = useClerkAuth();
  const location = useLocation();
  // Wait for Clerk to load to avoid flicker/loops
  if (!isLoaded) return null;
  if (!token && !isSignedIn) return <Navigate to="/sign-in" replace state={{ from: location }} />;
  return <>{children}</>;
};
