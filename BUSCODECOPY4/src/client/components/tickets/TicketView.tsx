/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trip, BusCompany, Passenger } from '../../types';
import { formatPrice } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import { Bus, MapPin, Download, Share2, Info } from 'lucide-react';

interface TicketViewProps {
  trip: Trip;
  company: BusCompany;
  passengers: Passenger[];
}

export function TicketView({ trip, company, passengers }: TicketViewProps) {
  const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden relative">
        <div className="bg-brand-red p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4">
             <div className="bg-white p-3 rounded-2xl text-brand-red">
               <Bus className="w-10 h-10" />
             </div>
             <div>
               <h2 className="text-3xl font-display font-black leading-none">Billet Électronique</h2>
               <p className="text-brand-yellow font-black uppercase tracking-widest text-[10px] mt-2 italic">Valable pour un trajet unique</p>
             </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Numéro de Billet</p>
              <p className="text-3xl font-display font-black font-mono">#{ticketId}</p>
           </div>
        </div>

        <div className="p-12 space-y-12">
          {/* Company & Info */}
          <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
            <div className="flex items-center gap-6">
              <img src={company.logo} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-gray-50" />
              <div>
                <h4 className="text-2xl font-display font-black text-gray-900">{company.name}</h4>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                   <Info className="w-3 h-3" /> {trip.busType} Express
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date du voyage</p>
              <p className="text-xl font-display font-bold text-gray-900">{format(parseISO(trip.departureTime), 'dd MMMM yyyy')}</p>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-12 py-10 border-y border-dashed border-gray-200">
             <div className="flex-1 space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Départ</p>
                <p className="text-4xl font-display font-black text-gray-900 leading-none">{format(parseISO(trip.departureTime), 'HH:mm')}</p>
                <p className="text-lg font-bold text-gray-500">{trip.departureCity}</p>
             </div>
             
             <div className="hidden md:flex flex-col items-center gap-3 px-8">
               <div className="w-16 h-1 bg-brand-green/20 rounded-full overflow-hidden">
                 <div className="w-1/2 h-full bg-brand-green animate-pulse" />
               </div>
               <Bus className="w-6 h-6 text-brand-green" />
             </div>

             <div className="flex-1 text-right space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrivée</p>
                <p className="text-4xl font-display font-black text-gray-900 leading-none">{format(parseISO(trip.arrivalTime), 'HH:mm')}</p>
                <p className="text-lg font-bold text-gray-500">{trip.arrivalCity}</p>
             </div>
          </div>

          {/* Passengers */}
          <div className="space-y-6">
            <h4 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xs">P</span>
              Passagers & Sièges
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passengers.map((p, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/10">
                      {p.seatId}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-gray-500 font-medium">{p.phone}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-brand-green bg-brand-green/10 px-2 py-1 rounded-full uppercase tracking-tighter">Confirmé</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer QR / Total */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-900 p-2 rounded-3xl flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-2xl grid grid-cols-8 grid-rows-8 gap-1 p-2">
                    {/* Simulated QR Grid */}
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`rounded-[1px] ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-400">Présentez ce QR code</p>
                  <p className="text-xs text-gray-500 leading-tight">à l'agent de contrôle lors de l'embarquement.</p>
                </div>
             </div>
             
             <div className="text-right space-y-4">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix Total Payé</p>
                   <p className="text-5xl font-display font-black text-brand-red leading-none">{formatPrice(trip.price * passengers.length)}</p>
                </div>
                <div className="flex gap-4 justify-end">
                   <button className="p-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-brand-red hover:text-white transition-all shadow-sm">
                     <Share2 className="w-6 h-6" />
                   </button>
                   <button className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-brand-red transition-all flex items-center gap-2">
                     <Download className="w-6 h-6" />
                     <span>Télécharger PDF</span>
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Confetti decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bus className="w-32 h-32 -rotate-12 text-brand-red" />
        </div>
      </div>
      
      <p className="text-center mt-12 text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
         <ShieldCheck className="w-4 h-4" /> Billet authentifié par le Ministère des Transports • FasoBus
      </p>
    </div>
  );
}

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
