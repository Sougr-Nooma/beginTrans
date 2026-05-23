/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { cities } from '../../types';
import { motion } from 'motion/react';

interface SearchFormProps {
  onSearch: (params: { from: string; to: string; date: string }) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [from, setFrom] = useState('Ouagadougou');
  const [to, setTo] = useState('Bobo-Dioulasso');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleFromChange = (newFrom: string) => {
    setFrom(newFrom);
    if (newFrom === to) {
      const nextAvailable = cities.find(city => city !== newFrom) || '';
      setTo(nextAvailable);
    }
  };

  const handleToChange = (newTo: string) => {
    setTo(newTo);
    if (newTo === from) {
      const nextAvailable = cities.find(city => city !== newTo) || '';
      setFrom(nextAvailable);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ from, to, date });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto -mt-16 relative z-20 px-4"
    >
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
      >
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Départ</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />
            <select 
              value={from} 
              onChange={e => handleFromChange(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer"
            >
              {cities.filter(city => city !== to).map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
            <select 
              value={to} 
              onChange={e => handleToChange(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green appearance-none cursor-pointer"
            >
              {cities.filter(city => city !== from).map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date du voyage</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-yellow" />
            <input 
              type="date" 
              value={date} 
              min={todayStr}
              onChange={e => setDate(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-yellow cursor-pointer" 
            />
          </div>
        </div>

        <button 
          type="submit"
          className="bg-gray-900 hover:bg-brand-red text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200 group active:scale-95"
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Rechercher</span>
        </button>
      </form>
    </motion.div>
  );
}
