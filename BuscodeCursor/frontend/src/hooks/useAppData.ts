import { useCallback, useEffect, useState } from 'react';
import type { BusCompany, Trip, SpecialOffer, JobOffer } from '../types';
import {
  fetchCompanies,
  fetchTrips,
  fetchSpecialOffers,
  fetchJobOffers,
  fetchStats,
  createCompany,
  updateCompany,
  deleteCompany,
  createTrip,
  updateTrip,
  deleteTrip,
  createSpecialOffer,
  deleteSpecialOffer,
  createJobOffer,
  deleteJobOffer,
  type StatsResponse,
} from '../services/catalogApi';

export function useAppData() {
  const [companies, setCompanies] = useState<BusCompany[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, t, so, jo, s] = await Promise.all([
        fetchCompanies(),
        fetchTrips(),
        fetchSpecialOffers(),
        fetchJobOffers(),
        fetchStats(),
      ]);
      setCompanies(c);
      setTrips(t);
      setSpecialOffers(so);
      setJobOffers(jo);
      setStats(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCompany = async (company: BusCompany & { password?: string }) => {
    await createCompany({
      id: company.id,
      name: company.name,
      email: company.email || `${company.id}@fasobus.bf`,
      phone: company.phone || '+226 00 00 00 00',
      description: company.description,
      address: company.address,
      logo: company.logo,
      rating: company.rating,
      password: company.password,
    });
    await refresh();
  };

  const patchCompany = async (updated: BusCompany, updatedTrips: Trip[]) => {
    await updateCompany(updated.id, updated);
    const existingForCompany = trips.filter((t) => t.companyId === updated.id);
    for (const trip of updatedTrips) {
      const exists = existingForCompany.find((t) => t.id === trip.id);
      if (exists) {
        await updateTrip(trip.id, trip);
      } else {
        const { id: _id, ...rest } = trip;
        await createTrip(rest);
      }
    }
    for (const old of existingForCompany) {
      if (!updatedTrips.some((t) => t.id === old.id)) {
        await deleteTrip(old.id);
      }
    }
    await refresh();
  };

  const removeCompany = async (id: string) => {
    await deleteCompany(id);
    await refresh();
  };

  const addTrip = async (trip: Trip) => {
    const { id: _id, ...rest } = trip;
    await createTrip(rest);
    await refresh();
  };

  const addJobOffer = async (job: JobOffer) => {
    const { id: _id, createdAt: _c, ...rest } = job;
    await createJobOffer(rest);
    await refresh();
  };

  const removeJobOffer = async (id: string) => {
    await deleteJobOffer(id);
    await refresh();
  };

  const addSpecialOffer = async (offer: SpecialOffer) => {
    const { id: _id, createdAt: _c, ...rest } = offer;
    await createSpecialOffer(rest);
    await refresh();
  };

  const removeSpecialOffer = async (id: string) => {
    await deleteSpecialOffer(id);
    await refresh();
  };

  return {
    companies,
    trips,
    specialOffers,
    jobOffers,
    stats,
    loading,
    error,
    refresh,
    setCompanies,
    setTrips,
    setSpecialOffers,
    setJobOffers,
    addCompany,
    patchCompany,
    removeCompany,
    addTrip,
    addJobOffer,
    removeJobOffer,
    addSpecialOffer,
    removeSpecialOffer,
  };
}
