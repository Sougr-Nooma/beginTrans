/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AuthGatewayDouble } from './pages/auth/AuthGatewayDouble';
import { COMPAGNIES, MOCK_TRIPS, INITIAL_SPECIAL_OFFERS, INITIAL_JOB_OFFERS } from './constants';
import type { Trip, BusCompany, SpecialOffer, JobOffer } from './types';

type ViewMode = 'SEARCH' | 'ADMIN' | 'COMPANIES' | 'MY_BOOKINGS' | 'ABOUT' | 'RECRUITMENT' | 'OFFERS' | 'SUPPORT';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('SEARCH');
  const [companies, setCompanies] = useState<BusCompany[]>(COMPAGNIES);
  const [trips] = useState<Trip[]>(MOCK_TRIPS);
  const [specialOffers] = useState<SpecialOffer[]>(INITIAL_SPECIAL_OFFERS);
  const [jobOffers] = useState<JobOffer[]>(INITIAL_JOB_OFFERS);

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    role: 'CLIENT' | 'COMPANY' | 'ADMIN';
    companyId?: string;
  } | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(true);

  // Listen for view changes (from Navbar)
  React.useEffect(() => {
    const handleViewChange = (e: any) => setViewMode(e.detail as ViewMode);
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
  }, []);

  const apiDebug = useMemo(() => ({ companiesCount: companies.length, tripsCount: trips.length, specialOffers, jobOffers }), [companies, trips, specialOffers, jobOffers]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-gray-900">
      <Navbar
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setViewMode('SEARCH');
        }}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h1 className="text-3xl font-display font-black text-gray-900">BUSCODECOPY3</h1>
            <p className="text-gray-500 mt-3 font-medium">
              Démarre l’interface double connexion Client / Compagnies avec le même design.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Compagnies</div>
                <div className="text-3xl font-black text-brand-red mt-2">{apiDebug.companiesCount}</div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Trajets</div>
                <div className="text-3xl font-black text-brand-green mt-2">{apiDebug.tripsCount}</div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Offres & Jobs</div>
                <div className="text-3xl font-black text-brand-yellow mt-2">{apiDebug.specialOffers.length + apiDebug.jobOffers.length}</div>
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="mt-10 w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red transition-all shadow-xl shadow-gray-200"
            >
              Ouvrir la double connexion
            </button>
          </div>
        </div>
      </main>

      {showAuthModal && (
        <AuthGatewayDouble
          onLogin={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
          existingCompanies={companies}
          onAddCompany={(c) => setCompanies((prev) => [...prev, c])}
        />
      )}
    </div>
  );
}

