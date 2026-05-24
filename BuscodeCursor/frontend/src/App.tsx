import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/auth/AuthPage';
import { ClientDashboard } from './pages/dashboard/ClientDashboard';
import { CompanyDashboard } from './pages/dashboard/CompanyDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import HomeApp from './HomeApp';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeApp mode="public" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard-client"
            element={
              <ProtectedRoute role="CLIENT">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-compagnie"
            element={
              <ProtectedRoute role="COMPANY">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
