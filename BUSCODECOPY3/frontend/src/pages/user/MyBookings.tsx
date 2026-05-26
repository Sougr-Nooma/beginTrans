/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trip, BusCompany, Passenger } from '../../types';
import { formatPrice } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import { Bus, MapPin, Calendar, Clock, Download, ChevronRight } from 'lucide-react';

interface MyBookingsProps {
  bookings: any[];
  companies: BusCompany[];
  trips: Trip[];
}

export function MyBookings({ bookings, companies, trips }: MyBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
          <Calendar className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-gray-900">Aucune réservation</h2>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">Vous n'avez pas encore effectué de réservation sur FasoBus. Vos futurs billets apparaîtront ici.</p>
        </div>
        <button className="px-10 py-4 bg-brand-red text-white font-bold rounded-2xl shadow-xl shadow-brand-red/10 hover:bg-gray-900 transition-all">
          Réserver mon premier trajet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-black text-gray-900">Mes <span className="text-brand-red">Réservations</span></h1>
        <p className="text-gray-500 font-medium">Historique de vos voyages et billets actifs.</p>
      </div>

      <div className="space-y-8">
        {bookings.map((booking) => {
          const trip = trips.find(t => t.id === booking.tripId);
          if (!trip) return null;
          const company = companies.find(c => c.id === trip.companyId);
          if (!company) return null;

          return (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-xl hover:shadow-gray-200/50 transition-all"
            >
              <div className="p-8 md:w-64 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-4 border-r border-gray-100">
                <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{company.name}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ref: {booking.id.substring(0, 8)}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  booking.status === 'PAID' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-yellow/10 text-brand-yellow'
                }`}>
                  {booking.status === 'PAID' ? 'Payé' : 'Réservé'}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8 flex-1">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-display font-black leading-none">{format(parseISO(trip.departureTime), 'HH:mm')}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{trip.departureCity}</p>
                  </div>
                  
                  <div className="flex-1 min-w-[60px] h-px bg-gray-200 relative">
                     <Bus className="absolute inset-0 m-auto w-4 h-4 text-brand-red bg-white px-0.5" />
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-2xl font-display font-black leading-none">{format(parseISO(trip.arrivalTime), 'HH:mm')}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{trip.arrivalCity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 border-t md:border-t-0 pt-6 md:pt-0 border-dashed border-gray-200 w-full md:w-auto">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-bold text-gray-700">{format(parseISO(trip.departureTime), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(booking.totalAmount)}</p>
                  </div>
                  <button className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-brand-red transition-all group shadow-lg shadow-gray-200">
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
