import { Navigate } from 'react-router-dom';
import { useAuth, AuthRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: AuthRole;
}

function redirectForRole(role: AuthRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin-dashboard';
    case 'COMPANY':
      return '/dashboard-compagnie';
    default:
      return '/dashboard-client';
  }
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 font-semibold bg-[#FDFCFB]">
      <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4" />
      Chargement…
    </div>
  );
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={role === 'ADMIN' ? '/admin-login' : '/auth'} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={redirectForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
