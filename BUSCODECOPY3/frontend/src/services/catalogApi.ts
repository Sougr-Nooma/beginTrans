import { api } from './api';
import type { BusCompany, Trip, SpecialOffer, JobOffer } from '../types';

export interface StatsResponse {
  totalCompanies: number;
  totalTrips: number;
  totalClients: number;
  statsByCompany: { name: string; companyId: string; value: number; tripCount: number; percentage: string }[];
  tripStats: { route: string; fullRoute: string; travelers: number; companyId: string; company: string }[];
  monthly: { name: string; passagers: number; CA: number }[];
  companies: BusCompany[];
}

function handleError(error: unknown): never {
  if (error && typeof error === 'object' && 'response' in error) {
    const ax = error as { response?: { data?: { error?: string } } };
    throw new Error(ax.response?.data?.error || 'Erreur serveur');
  }
  throw error instanceof Error ? error : new Error('Erreur inconnue');
}

export async function fetchCompanies(): Promise<BusCompany[]> {
  try {
    const { data } = await api.get<BusCompany[]>('/companies');
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function createCompany(payload: {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  description?: string;
  address?: string;
  logo?: string;
  rating?: number;
}): Promise<BusCompany> {
  try {
    const { data } = await api.post<BusCompany>('/companies', {
      ...payload,
      password: payload.password || `FasoBus_${payload.id}_2026`,
    });
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function updateCompany(
  slug: string,
  payload: Partial<BusCompany>,
): Promise<BusCompany> {
  try {
    const { data } = await api.put<BusCompany>(`/companies/${slug}`, payload);
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function deleteCompany(slug: string): Promise<void> {
  try {
    await api.delete(`/companies/${slug}`);
  } catch (e) {
    handleError(e);
  }
}

export async function fetchTrips(params?: {
  from?: string;
  to?: string;
  companyId?: string;
}): Promise<Trip[]> {
  try {
    const { data } = await api.get<Trip[]>('/trips', { params });
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function createTrip(payload: Omit<Trip, 'id'>): Promise<Trip> {
  try {
    const { data } = await api.post<Trip>('/trips', payload);
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function updateTrip(id: string, payload: Partial<Trip>): Promise<Trip> {
  try {
    const { data } = await api.put<Trip>(`/trips/${id}`, payload);
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function deleteTrip(id: string): Promise<void> {
  try {
    await api.delete(`/trips/${id}`);
  } catch (e) {
    handleError(e);
  }
}

export async function fetchStats(): Promise<StatsResponse> {
  try {
    const { data } = await api.get<StatsResponse>('/stats');
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function fetchSpecialOffers(): Promise<SpecialOffer[]> {
  try {
    const { data } = await api.get<SpecialOffer[]>('/special-offers');
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function createSpecialOffer(
  payload: Omit<SpecialOffer, 'id' | 'createdAt'>,
): Promise<SpecialOffer> {
  try {
    const { data } = await api.post<SpecialOffer>('/special-offers', payload);
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function deleteSpecialOffer(id: string): Promise<void> {
  try {
    await api.delete(`/special-offers/${id}`);
  } catch (e) {
    handleError(e);
  }
}

export async function fetchJobOffers(): Promise<JobOffer[]> {
  try {
    const { data } = await api.get<JobOffer[]>('/job-offers');
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function createJobOffer(
  payload: Omit<JobOffer, 'id' | 'createdAt'>,
): Promise<JobOffer> {
  try {
    const { data } = await api.post<JobOffer>('/job-offers', payload);
    return data;
  } catch (e) {
    handleError(e);
  }
}

export async function deleteJobOffer(id: string): Promise<void> {
  try {
    await api.delete(`/job-offers/${id}`);
  } catch (e) {
    handleError(e);
  }
}
