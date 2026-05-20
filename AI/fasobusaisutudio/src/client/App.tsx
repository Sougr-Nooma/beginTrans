/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { SearchForm } from './components/forms/SearchForm';
import { SeatMap } from './components/bus/SeatMap';
import { PaymentModal } from './components/tickets/PaymentModal';
import { TicketView } from './components/tickets/TicketView';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CompaniesList } from './pages/company/CompaniesList';
import { MyBookings } from './pages/user/MyBookings';
import { AboutPage, RecruitmentPage, SpecialOffersPage, HelpSupportPage } from './pages/public/StaticPages';
import { AuthGateway } from './pages/auth/AuthGateway';
import { MOCK_TRIPS, COMPAGNIES, POPULAR_COMPANIES, INITIAL_SPECIAL_OFFERS, INITIAL_JOB_OFFERS } from './constants';
import { Trip, BusCompany, Passenger, JobOffer, SpecialOffer } from './types';
import { formatPrice, cn } from './lib/utils';
import { Clock, Users, ChevronRight, Bus, MapPin, Star, ArrowLeft, Info, Phone, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

type ViewMode = 'SEARCH' | 'BOOKING' | 'TICKET' | 'RESERVATION_SUCCESS' | 'ADMIN' | 'COMPANIES' | 'MY_BOOKINGS' | 'ABOUT' | 'RECRUITMENT' | 'OFFERS' | 'SUPPORT';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('SEARCH');
  const [searchResults, setSearchResults] = useState<Trip[] | null>(null);
  const [isSearching, setSearchResults_isSearching] = useState(false);
  
  // Data State (Elevated for Admin edits)
  const [companies, setCompanies] = useState<BusCompany[]>(COMPAGNIES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [bookings, setBookings] = useState<any[]>([]); // New state for bookings
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>(INITIAL_SPECIAL_OFFERS);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(INITIAL_JOB_OFFERS);
  
  // Selection State
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengersData, setPassengersData] = useState<Record<string, { firstName: string; lastName: string; phone: string }>>({});
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string; role: 'CLIENT' | 'COMPANY' | 'ADMIN'; companyId?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(true); // Open double connection on initial load
  
  // Modals
  const [showPayment, setShowPayment] = useState(false);

  // Listen for view changes from Navbar
  React.useEffect(() => {
    const handleViewChange = (e: any) => {
      setViewMode(e.detail as ViewMode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
  }, []);

  const handleBookingSuccess = (isReservation: boolean = false) => {
    const newBooking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      tripId: selectedTrip?.id,
      totalAmount: selectedTrip!.price * selectedSeats.length,
      status: isReservation ? 'RESERVED' : 'PAID',
      createdAt: new Date().toISOString()
    };
    setBookings([newBooking, ...bookings]);
    
    if (isReservation) {
      setViewMode('RESERVATION_SUCCESS');
    } else {
      setViewMode('TICKET');
    }
  };

  const handleSearch = (params: { from: string; to: string; date: string }) => {
    setSearchResults_isSearching(true);
    setTimeout(() => {
      const now = new Date();
      
      const results = trips
        .map(trip => {
          const isCityMatch = trip.departureCity === params.from && trip.arrivalCity === params.to;
          if (!isCityMatch) return null;

          // Parse params.date as YYYY-MM-DD local numbers
          const [year, month, day] = params.date.split('-').map(Number);
          
          // Original hour/minute details
          const origDeparture = parseISO(trip.departureTime);
          const hours = origDeparture.getHours();
          const minutes = origDeparture.getMinutes();

          // Create the projected local departure Date
          const projectedDeparture = new Date(year, month - 1, day, hours, minutes, 0, 0);

          // Calculate trip duration to project the arrival time
          const origArrival = parseISO(trip.arrivalTime);
          const durationMs = origArrival.getTime() - origDeparture.getTime();
          const projectedArrival = new Date(projectedDeparture.getTime() + durationMs);

          return {
            ...trip,
            departureTime: projectedDeparture.toISOString(),
            arrivalTime: projectedArrival.toISOString()
          };
        })
        .filter((projectedTrip): projectedTrip is Trip => {
          if (!projectedTrip) return false;

          const departureDate = parseISO(projectedTrip.departureTime);
          const isSelectedDateToday = format(now, 'yyyy-MM-dd') === params.date;

          if (isSelectedDateToday) {
            // Exclure les trajets dont l'heure de départ est déjà passée par rapport à maintenant
            return departureDate > now;
          }

          // Pour les jours suivants, on accepte tous les trajets
          return true;
        });

      setSearchResults(results);
      setSearchResults_isSearching(false);
    }, 800);
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setViewMode('BOOKING');
    setSelectedSeats([]);
    setPassengersData({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSeat = (seatId: string) => {
    setSelectedSeats(prev => {
      const exists = prev.includes(seatId);
      if (exists) {
        const next = prev.filter(s => s !== seatId);
        const { [seatId]: _, ...rest } = passengersData;
        setPassengersData(rest);
        return next;
      }
      if (prev.length >= 4) return prev;
      
      const next = [...prev, seatId];
      
      // Auto-fill first passenger details if user is logged in as a CLIENT
      let firstName = '';
      let lastName = '';
      let phone = '';
      if (prev.length === 0 && currentUser && currentUser.role === 'CLIENT') {
        const parts = currentUser.name.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
        phone = currentUser.phone || '';
      }
      
      setPassengersData(curr => ({
        ...curr,
        [seatId]: { firstName, lastName, phone }
      }));
      return next;
    });
  };

  const updatePassenger = (seatId: string, field: string, value: string) => {
    setPassengersData(prev => ({
      ...prev,
      [seatId]: { ...prev[seatId], [field]: value }
    }));
  };

  const isFormComplete = () => {
    if (selectedSeats.length === 0) return false;
    return selectedSeats.every(seatId => {
      const p = passengersData[seatId];
      return p?.firstName && p?.lastName && p?.phone;
    });
  };

  const currentCompany = selectedTrip ? companies.find(c => c.id === selectedTrip.companyId)! : null;

  const passengersList: Passenger[] = selectedSeats.map(seatId => ({
    seatId,
    firstName: passengersData[seatId]?.firstName || '',
    lastName: passengersData[seatId]?.lastName || '',
    phone: passengersData[seatId]?.phone || ''
  }));

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
        <AnimatePresence mode="wait">
          {viewMode === 'ADMIN' && (
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminDashboard 
                currentUser={currentUser}
                companies={companies}
                trips={trips}
                onAddCompany={(c) => setCompanies([...companies, c])}
                onUpdateCompany={(updated, updatedTrips) => {
                  setCompanies(companies.map(c => c.id === updated.id ? updated : c));
                  // Replace all trips for this company with the updated set
                  const otherTrips = trips.filter(t => t.companyId !== updated.id);
                  setTrips([...otherTrips, ...updatedTrips]);
                }}
                onDeleteCompany={(id) => setCompanies(companies.filter(c => c.id !== id))}
                onAddTrip={(t) => setTrips([...trips, t])}
                jobOffers={jobOffers}
                onAddJobOffer={(job) => setJobOffers([job, ...jobOffers])}
                onDeleteJobOffer={(id) => setJobOffers(jobOffers.filter(j => j.id !== id))}
                specialOffers={specialOffers}
                onAddSpecialOffer={(offer) => setSpecialOffers([offer, ...specialOffers])}
                onDeleteSpecialOffer={(id) => setSpecialOffers(specialOffers.filter(so => so.id !== id))}
              />
            </motion.div>
          )}

          {viewMode === 'COMPANIES' && (
            <motion.div
              key="companies-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CompaniesList companies={companies} />
              <div className="text-center mt-12 mb-20 px-4">
                <button 
                  onClick={() => setViewMode('SEARCH')}
                  className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red transition-all shadow-xl shadow-gray-200"
                >
                  Retour à la recherche
                </button>
              </div>
            </motion.div>
          )}

          {viewMode === 'MY_BOOKINGS' && (
            <motion.div key="bookings-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MyBookings bookings={bookings} companies={companies} trips={trips} />
            </motion.div>
          )}

          {viewMode === 'ABOUT' && (
            <motion.div key="about-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AboutPage />
            </motion.div>
          )}

          {viewMode === 'RECRUITMENT' && (
            <motion.div key="recruitment-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <RecruitmentPage jobOffers={jobOffers} companies={companies} />
            </motion.div>
          )}

          {viewMode === 'OFFERS' && (
            <motion.div key="offers-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <SpecialOffersPage specialOffers={specialOffers} companies={companies} />
            </motion.div>
          )}

          {viewMode === 'SUPPORT' && (
            <motion.div key="support-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <HelpSupportPage />
            </motion.div>
          )}

          {viewMode === 'SEARCH' && (
            <motion.div 
              key="search-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-brand-green">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    alt="Background"
                  />
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
                  >
                    Voyagez partout au <span className="text-brand-yellow underline decoration-brand-red decoration-4 transition-all">Burkina</span> en un clic
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto"
                  >
                    Réservez vos billets de bus en ligne, payez par Mobile Money et profitez de votre voyage. 
                    Simple, rapide et sécurisé.
                  </motion.p>
                </div>
              </section>

              <div className="px-4">
                <SearchForm onSearch={handleSearch} />
              </div>

              <div className="max-w-5xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                  {isSearching ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-20 text-center"
                    >
                      <div className="inline-block w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-gray-500 font-medium">Recherche des meilleurs trajets...</p>
                    </motion.div>
                  ) : searchResults === null ? (
                    <div key="empty" className="space-y-12">
                      <div className="text-center space-y-4">
                        <h2 className="text-2xl font-display font-bold">Pourquoi choisir FasoBus ?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                          <FeatureCard 
                            icon={<Clock className="w-6 h-6 text-brand-red" />}
                            title="Gain de temps"
                            description="Plus besoin de vous déplacer aux gares. Réservez depuis chez vous."
                          />
                          <FeatureCard 
                            icon={<Bus className="w-6 h-6 text-brand-green" />}
                            title="Large choix"
                            description="Toutes les grandes compagnies réunies sur une seule plateforme."
                          />
                          <FeatureCard 
                            icon={<Users className="w-6 h-6 text-brand-yellow" />}
                            title="Support local"
                            description="Une équipe basée à Ouaga pour vous accompagner 24h/24."
                          />
                        </div>
                      </div>

                      {/* Interactive banner for Bons plans */}
                      <div className="pt-4">
                        <motion.button 
                          whileHover={{ y: -4, scale: 1.005 }}
                          onClick={() => {
                            setViewMode('OFFERS');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full bg-gradient-to-r from-brand-yellow/5 via-amber-500/5 to-brand-yellow/10 hover:from-brand-yellow/10 hover:to-amber-500/15 p-8 rounded-[2rem] border border-brand-yellow/20 hover:border-brand-yellow transition-all text-left flex items-center justify-between group"
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">ÉCONOMISEZ</span>
                            <h3 className="text-xl font-bold text-gray-950">Nos Bons Plans</h3>
                            <p className="text-xs text-gray-500 font-semibold max-w-2xl">
                              Découvrez nos offres promotionnelles exclusives, bons de réduction et forfaits spéciaux de voyages de nos lignes partenaires.
                            </p>
                          </div>
                          <div className="p-4 bg-white/80 rounded-2xl group-hover:bg-brand-yellow group-hover:text-white text-brand-yellow shadow-sm transition-all shrink-0">
                            <Star className="w-6 h-6" />
                          </div>
                        </motion.button>
                      </div>

                      {/* Popular Companies Section */}
                      <div className="pt-12 space-y-8">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-display font-bold">Compagnies les plus utilisées</h2>
                          <div className="h-1 bg-brand-red w-12 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {POPULAR_COMPANIES.map(company => (
                            <motion.div 
                              key={company.id}
                              whileHover={{ y: -5 }}
                              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4"
                            >
                              <img src={company.logo} alt={company.name} className="w-20 h-20 rounded-full object-cover shadow-md" />
                              <div className="space-y-1">
                                <h3 className="font-bold text-gray-900 leading-tight">{company.name}</h3>
                                <div className="flex items-center justify-center gap-1 text-brand-yellow">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-xs font-bold">{company.rating}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 italic">{company.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      key="results"
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-end mb-8">
                        <div>
                          <h2 className="text-3xl font-display font-bold">{searchResults.length} trajets trouvés</h2>
                          <p className="text-gray-500">Ouagadougou → Bobo-Dioulasso • Aujourd'hui</p>
                        </div>
                      </div>

                      {searchResults.length > 0 ? (
                        searchResults.map((trip) => (
                          <TripCard 
                            key={trip.id} 
                            trip={trip} 
                            company={companies.find(c => c.id === trip.companyId)!} 
                            onSelect={() => handleSelectTrip(trip)}
                          />
                        ))
                      ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <p className="text-xl font-bold text-gray-400">Désolé, aucun trajet trouvé pour cette date.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {viewMode === 'BOOKING' && selectedTrip && currentCompany && (
            <motion.div 
              key="booking-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto px-4 py-12"
            >
              <button 
                onClick={() => setViewMode('SEARCH')}
                className="flex items-center gap-2 mb-8 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux résultats
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  {/* Step 1: Seat Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold">1</div>
                      <h2 className="text-2xl font-display font-bold">Choisissez vos places</h2>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center gap-12">
                      <SeatMap 
                        totalSeats={selectedTrip.totalSeats} 
                        availableSeats={selectedTrip.availableSeats} 
                        selectedSeats={selectedSeats}
                        onToggleSeat={handleToggleSeat}
                      />
                      <div className="max-w-xs space-y-6">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
                          <Info className="w-6 h-6 text-brand-green flex-shrink-0" />
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Vous pouvez réserver jusqu'à 4 places au total. Cliquez sur les sièges pour les sélectionner.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Sièges sélectionnés</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSeats.length > 0 ? (
                              selectedSeats.map(s => (
                                <span key={s} className="px-4 py-2 bg-brand-red text-white font-bold rounded-xl text-sm">{s}</span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm font-medium italic">Aucun siège sélèctionné</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Passenger Info List */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold">2</div>
                      <h2 className="text-2xl font-display font-bold">Informations passagers</h2>
                    </div>
                    <AnimatePresence mode="popLayout">
                      {selectedSeats.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200"
                        >
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-400 font-medium">Veuillez d'abord sélectionner des places dans le bus.</p>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {selectedSeats.map((seatId) => (
                            <motion.div 
                              key={seatId}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                  <span className="px-3 py-1 bg-brand-red text-white rounded-lg text-sm">Siège {seatId}</span>
                                  Passager
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Prénom</label>
                                  <input 
                                    type="text" 
                                    value={passengersData[seatId]?.firstName}
                                    onChange={(e) => updatePassenger(seatId, 'firstName', e.target.value)}
                                    placeholder="Prénom"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-red outline-none font-medium text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nom</label>
                                  <input 
                                    type="text" 
                                    value={passengersData[seatId]?.lastName}
                                    onChange={(e) => updatePassenger(seatId, 'lastName', e.target.value)}
                                    placeholder="Nom de famille"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-red outline-none font-medium text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Téléphone</label>
                                  <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                      type="tel" 
                                      value={passengersData[seatId]?.phone}
                                      onChange={(e) => updatePassenger(seatId, 'phone', e.target.value)}
                                      placeholder="Numéro Mobile Money"
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-red outline-none font-medium text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Reservation Summary */}
                <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                  <h2 className="text-2xl font-display font-bold">Récapitulatif</h2>
                  <div className="bg-gray-900 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <img src={currentCompany.logo} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-bold">{currentCompany.name}</p>
                          <p className="text-xs text-gray-400">{selectedTrip.busType}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-6 space-y-4">
                        <div className="flex justify-between items-start relative px-2">
                          <div className="space-y-1 relative z-10">
                            <p className="text-2xl font-display font-bold">{format(parseISO(selectedTrip.departureTime), 'HH:mm')}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedTrip.departureCity}</p>
                          </div>
                          
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
                            <div className="relative flex flex-col items-center w-full">
                              <div className="flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 text-brand-red" />
                                <ArrowRight className="w-3 h-3 text-brand-green" />
                              </div>
                              <div className="w-full h-px bg-white/10 mt-1" />
                            </div>
                          </div>

                          <div className="text-right space-y-1 relative z-10">
                            <p className="text-2xl font-display font-bold">{format(parseISO(selectedTrip.arrivalTime), 'HH:mm')}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedTrip.arrivalCity}</p>
                          </div>
                        </div>
                      </div>

                      {/* Passengers List in Summary */}
                      {selectedSeats.length > 0 && (
                        <div className="border-t border-white/10 pt-6 space-y-3">
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Liste des passagers</p>
                           <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                             {selectedSeats.map(seatId => {
                               const p = passengersData[seatId];
                               return (
                                 <div key={seatId} className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-xl">
                                   <div className="flex items-center gap-2">
                                     <span className="w-6 h-6 rounded bg-brand-red text-[10px] flex items-center justify-center font-bold">#{seatId}</span>
                                     <div className="leading-tight">
                                       <p className="font-bold text-gray-200">{p?.firstName || '---'} {p?.lastName || ''}</p>
                                       <p className="text-[10px] text-gray-500">{p?.phone || 'Pas de numéro'}</p>
                                     </div>
                                   </div>
                                 </div>
                               );
                             })}
                           </div>
                        </div>
                      )}

                      <div className="border-t border-white/10 pt-6 space-y-3">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Billet ({selectedSeats.length})</span>
                          <span>{formatPrice(selectedTrip.price * selectedSeats.length)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Frais de service</span>
                          <span className="text-brand-green">Gratuit</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                          <span className="font-bold">Total</span>
                          <span className="text-3xl font-display font-black text-brand-yellow">
                            {formatPrice(selectedTrip.price * selectedSeats.length)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 divide-y divide-white/5">
                      <button 
                        disabled={!isFormComplete()}
                        onClick={() => handleBookingSuccess(true)}
                        className="w-full py-6 bg-brand-green/20 text-brand-green font-bold text-sm hover:bg-brand-green hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Réserver mon voyage (jusqu'à 3j)
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                      <button 
                        disabled={!isFormComplete()}
                        onClick={() => setShowPayment(true)}
                        className="w-full py-6 bg-brand-red text-white font-bold text-lg hover:bg-brand-red/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Procéder au paiement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'TICKET' && selectedTrip && currentCompany && (
            <motion.div 
              key="ticket-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12"
            >
              <TicketView 
                trip={selectedTrip}
                company={currentCompany}
                passengers={passengersList}
              />
              <div className="text-center mt-8">
                <button 
                  onClick={() => {
                    setViewMode('SEARCH');
                    setSearchResults(null);
                  }}
                  className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red transition-all"
                >
                  Revenir à l'accueil
                </button>
              </div>
            </motion.div>
          )}

          {viewMode === 'RESERVATION_SUCCESS' && selectedTrip && currentCompany && (
            <motion.div 
              key="reservation-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 max-w-2xl mx-auto px-4"
            >
              <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-green" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <Users className="w-12 h-12 text-brand-green" />
                </motion.div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-black text-gray-900">Réservation Confirmée !</h2>
                  <p className="text-lg text-gray-500 leading-relaxed">
                    Votre demande de réservation pour le trajet <span className="font-bold text-gray-900">{selectedTrip.departureCity} → {selectedTrip.arrivalCity}</span> a été enregistrée avec succès.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl space-y-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-brand-green text-white rounded-lg"><Phone className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Confirmation WhatsApp</h4>
                      <p className="text-sm text-gray-500">Nous venons de vous envoyer un message de confirmation sur votre numéro WhatsApp.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-brand-yellow text-white rounded-lg"><Clock className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Rappel de paiement</h4>
                      <p className="text-sm text-gray-500">Un message de rappel vous sera envoyé 24h avant le départ pour procéder au paiement final.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setViewMode('SEARCH');
                    setSearchResults(null);
                  }}
                  className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-brand-red transition-all"
                >
                  Revenir à l'accueil
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showPayment && (
          <PaymentModal 
            amount={selectedTrip ? selectedTrip.price * selectedSeats.length : 0}
            onClose={() => setShowPayment(false)}
            onSuccess={() => {
              setShowPayment(false);
              handleBookingSuccess(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <AuthGateway 
            onLogin={(user) => {
              setCurrentUser(user);
              setShowAuthModal(false);
            }}
            onClose={() => setShowAuthModal(false)}
            existingCompanies={companies}
            onAddCompany={(c) => setCompanies([...companies, c])}
          />
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Bus className="w-8 h-8 text-brand-red" />
              <span className="font-display text-3xl font-bold tracking-tight">
                Faso<span className="text-brand-green">Bus</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">La plateforme numéro #1 de réservation de bus au Burkina Faso. Voyagez sereinement avec FasoBus.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Voyage</h4>
            <ul className="text-gray-500 space-y-4 text-sm font-medium">
              <li 
                onClick={() => {
                  setViewMode('COMPANIES');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Compagnies de transport
              </li>
              <li onClick={() => setViewMode('OFFERS')} className="hover:text-white cursor-pointer transition-colors">Offres spéciales</li>
              <li onClick={() => setViewMode('SUPPORT')} className="hover:text-white cursor-pointer transition-colors">Aide & Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Entreprise</h4>
            <ul className="text-gray-500 space-y-4 text-sm font-medium">
              <li onClick={() => setViewMode('ABOUT')} className="hover:text-white cursor-pointer transition-colors">À propos</li>
              <li onClick={() => setViewMode('SUPPORT')} className="hover:text-white cursor-pointer transition-colors">Localisation</li>
              <li onClick={() => setViewMode('RECRUITMENT')} className="hover:text-white cursor-pointer transition-colors">Recrutement</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="text-gray-500 space-y-4 text-sm font-medium">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-red" />
                <span>+226 25 30 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-red" />
                <span>+226 70 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-red" />
                <span>contact@fasobus.bf</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2026 FasoBus. Tous droits réservés.</p>
          <div className="flex gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Confidentialité</span>
            <span className="hover:text-white cursor-pointer transition-colors">Conditions</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string, key?: React.Key }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all text-center space-y-4"
    >
      <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-xl font-display">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TripCard({ trip, company, onSelect }: { trip: Trip, company: BusCompany, onSelect: () => void, key?: React.Key }) {
  const diffHours = differenceInHours(parseISO(trip.arrivalTime), parseISO(trip.departureTime));
  const diffMins = differenceInMinutes(parseISO(trip.arrivalTime), parseISO(trip.departureTime)) % 60;
  const durationStr = `${diffHours}h ${diffMins > 0 ? diffMins + 'm' : ''}`;

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col md:flex-row gap-8 items-center animate-fade-in"
    >
      <div className="flex flex-row md:flex-col items-center gap-4 min-w-[140px]">
        <img src={company.logo} alt={company.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50 shadow-md" />
        <div className="text-center md:text-left">
          <h4 className="font-bold text-sm leading-tight mb-1">{company.name}</h4>
          <div className="flex items-center justify-center md:justify-start gap-1">
            <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
            <span className="text-xs font-bold text-gray-500">{company.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-start gap-4 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
          <div className="flex items-center gap-8 w-full md:w-auto px-4">
            <div className="text-center md:text-left">
              <p className="text-3xl font-display font-black leading-none">{format(parseISO(trip.departureTime), 'HH:mm')}</p>
              <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{trip.departureCity}</p>
            </div>
            
            <div className="flex-1 min-w-[80px] md:w-40 flex flex-col items-center gap-2 group">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-full whitespace-nowrap">{durationStr}</p>
              <div className="relative w-full h-[2px] bg-gray-100 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-brand-green/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              </div>
              <div className="p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
                <Bus className="w-4 h-4 text-brand-green" />
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-3xl font-display font-black leading-none">{format(parseISO(trip.arrivalTime), 'HH:mm')}</p>
              <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{trip.arrivalCity}</p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-1 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-dashed">
            <p className="text-3xl font-display font-black text-brand-red">{formatPrice(trip.price)}</p>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                trip.busType === 'VIP' ? "bg-brand-yellow/10 text-brand-yellow font-black" : "bg-gray-100 text-gray-400"
              )}>
                {trip.busType}
              </span>
            </div>
          </div>

          <button 
            onClick={onSelect}
            className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red transition-all flex items-center justify-center gap-2 group whitespace-nowrap shadow-lg shadow-gray-200 active:scale-95"
          >
            <span>Réserver</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {trip.gares && (
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-dashed border-gray-100/80 text-[11px] font-semibold text-gray-600 ml-4 shadow-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px]">Gares / Arrêts :</span>
            <span className="font-bold text-gray-700">{trip.gares}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
