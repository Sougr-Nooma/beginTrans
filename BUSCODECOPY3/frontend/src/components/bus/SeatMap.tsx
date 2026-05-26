/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { Bus } from 'lucide-react';

interface SeatMapProps {
  totalSeats: number;
  availableSeats: number;
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
}

export function SeatMap({ totalSeats, availableSeats, selectedSeats, onToggleSeat }: SeatMapProps) {
  // Generate mock seats (some taken)
  const seats = Array.from({ length: totalSeats }, (_, i) => ({
    id: `${i + 1}`,
    isTaken: Math.random() > 0.7 && i > 4 // Randomly block some seats, except first 4
  }));

  return (
    <div className="relative bg-gray-50 p-8 rounded-3xl border border-gray-100">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">
        <Bus className="w-4 h-4" /> Avant du bus
      </div>
      
      <div className="mt-12 grid grid-cols-4 gap-3">
        {seats.map((seat, idx) => {
          const isSelected = selectedSeats.includes(seat.id);
          const isAisle = (idx + 1) % 4 === 2;
          
          return (
            <React.Fragment key={seat.id}>
              <button
                disabled={seat.isTaken}
                onClick={() => onToggleSeat(seat.id)}
                className={cn(
                  "aspect-square w-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center relative group",
                  seat.isTaken ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 
                  isSelected ? "bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-110 z-10" :
                  "bg-white text-gray-600 hover:border-brand-red border-2 border-transparent"
                )}
              >
                {seat.id}
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {isAisle && <div className="w-4" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded shadow-sm" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Libre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-brand-red rounded shadow-sm" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Choisi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded shadow-sm" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Occupé</span>
        </div>
      </div>
    </div>
  );
}
