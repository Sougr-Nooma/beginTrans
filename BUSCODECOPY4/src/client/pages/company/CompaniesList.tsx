/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BusCompany } from '../../types';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Star, ShieldCheck } from 'lucide-react';

interface CompaniesListProps {
  companies: BusCompany[];
}

export function CompaniesList({ companies }: CompaniesListProps) {
  const [searchId, setSearchId] = React.useState('');

  const filteredCompanies = companies.filter(company => 
    company.id.toLowerCase().includes(searchId.toLowerCase()) ||
    company.name.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900 leading-tight">
          Nos <span className="text-brand-red">Partenaires</span> de Confiance
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
          Retrouvez toutes les compagnies de transport premium au Burkina Faso. 
          Nous travaillons main dans la main avec les leaders du secteur pour vous garantir un voyage sûr et confortable.
        </p>
      </div>

      {/* Barre de recherche par ID ou nom */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une compagnie par son ID (ex: tsr, elitis) ou son nom..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none font-bold text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent"
          />
          {searchId && (
            <button 
              onClick={() => setSearchId('')} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.map((company) => (
          <motion.div
            key={company.id}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-red/5 transition-all overflow-hidden flex flex-col h-full"
          >
            <div className="p-8 space-y-6 flex-1">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-brand-red to-brand-yellow rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img src={company.logo} alt={company.name} className="relative w-20 h-20 rounded-full object-cover shadow-sm bg-white" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-brand-yellow">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{company.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Vérifié</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-xl uppercase tracking-widest">ID: {company.id}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                  {company.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 italic">
                  "{company.description}"
                </p>
              </div>

              <div className="pt-6 border-t border-gray-50 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-xl text-brand-red group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Siège Social</p>
                    <p className="text-sm font-bold text-gray-700">{company.address || 'Non spécifié'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-xl text-brand-green group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact direct</p>
                    <p className="text-sm font-bold text-gray-700">{company.phone || 'Non disponible'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-xl text-brand-yellow group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{company.email || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-8 pb-8">
              <button className="w-full py-4 bg-gray-50 hover:bg-brand-red hover:text-white text-gray-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                Voir les horaires
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
