import { useState } from 'react';
import {
  COMPAGNIES,
  MOCK_TRIPS,
  INITIAL_SPECIAL_OFFERS,
  INITIAL_JOB_OFFERS,
} from '../constants';
import type { BusCompany, Trip, JobOffer, SpecialOffer } from '../types';

export function useMockAppData() {
  const [companies, setCompanies] = useState<BusCompany[]>(COMPAGNIES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>(INITIAL_SPECIAL_OFFERS);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(INITIAL_JOB_OFFERS);

  return {
    companies,
    setCompanies,
    trips,
    setTrips,
    specialOffers,
    setSpecialOffers,
    jobOffers,
    setJobOffers,
  };
}
