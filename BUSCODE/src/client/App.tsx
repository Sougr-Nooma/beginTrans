// src/client/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
// Importez vos autres pages futures ici (Dashboard, Search, etc.)

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          {/* Exemple de route protégée future */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <div>Bienvenue sur le Dashboard (À créer)</div>
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;