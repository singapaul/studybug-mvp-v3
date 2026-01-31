import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { session, isAuthenticated } = useAuth();

  // Not authenticated - redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role if specified
  if (requiredRole && session?.user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    const redirectPath = session?.user.role === Role.TUTOR
      ? '/tutor/dashboard'
      : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
