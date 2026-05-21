import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Correction de l'erreur ImportMeta.env
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'COMPANY' | 'ADMIN';
  token: string;
}

// Interface pour les données d'inscription (sans le rôle qui est passé séparément)
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string; // Optionnel si c'est une compagnie
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'CLIENT' | 'COMPANY') => Promise<void>;
  register: (data: RegisterData, role: 'CLIENT' | 'COMPANY') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fasobus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'CLIENT' | 'COMPANY') => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password, role });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('fasobus_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error("Login failed", error);
      throw new Error(error.response?.data?.message || "Échec de la connexion");
    }
  };

  // Correction : La fonction attend maintenant explicitement data et role
  const register = async (data: RegisterData, role: 'CLIENT' | 'COMPANY') => {
    try {
      // On fusionne les données avec le rôle pour l'envoi au backend
      const payload = { ...data, role };
      
      const res = await axios.post(`${API_URL}/auth/register`, payload);
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('fasobus_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error("Register failed", error);
      throw new Error(error.response?.data?.message || "Échec de l'inscription");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fasobus_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};