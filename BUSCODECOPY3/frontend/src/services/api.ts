import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'CLIENT' | 'COMPANY' | 'ADMIN';
    companyId?: string;
  };
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion au serveur');
  }
  throw error instanceof Error ? error : new Error('Erreur inconnue');
}

export async function registerClient(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const { data: res } = await api.post<AuthResponse>('/auth/register-client', data);
    return res;
  } catch (e) {
    handleError(e);
  }
}

export async function loginClient(data: { email: string; password: string }): Promise<AuthResponse> {
  try {
    const { data: res } = await api.post<AuthResponse>('/auth/login-client', data);
    return res;
  } catch (e) {
    handleError(e);
  }
}

export async function registerCompany(data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  description?: string;
  address?: string;
}): Promise<AuthResponse> {
  try {
    const { data: res } = await api.post<AuthResponse>('/auth/register-company', data);
    return res;
  } catch (e) {
    handleError(e);
  }
}

export async function loginCompany(data: { id: string; password: string }): Promise<AuthResponse> {
  try {
    const { data: res } = await api.post<AuthResponse>('/auth/login-company', data);
    return res;
  } catch (e) {
    handleError(e);
  }
}

export async function loginAdmin(data: { email: string; password: string }): Promise<AuthResponse> {
  try {
    const { data: res } = await api.post<AuthResponse>('/auth/login-admin', data);
    return res;
  } catch (e) {
    handleError(e);
  }
}
