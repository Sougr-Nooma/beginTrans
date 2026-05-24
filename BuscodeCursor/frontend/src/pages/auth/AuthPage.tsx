import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGateway } from './AuthGateway';
import { COMPAGNIES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

function dashboardPathForRole(role: string) {
  if (role === 'COMPANY') return '/dashboard-compagnie';
  if (role === 'ADMIN') return '/admin-dashboard';
  return '/dashboard-client';
}

export function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(dashboardPathForRole(user.role), { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <AuthGateway
      existingCompanies={COMPAGNIES}
      onClose={() => navigate('/')}
    />
  );
}