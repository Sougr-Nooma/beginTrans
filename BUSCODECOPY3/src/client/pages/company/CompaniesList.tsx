/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusCompany } from '../../types';

export function CompaniesList({ companies }: { companies: BusCompany[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-10 space-y-4">
        <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900 leading-tight">
          Nos <span className="text-brand-red">Partenaires</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
          Placeholder. La vraie liste compagnies sera copiée depuis le MVP au prochain pas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={c.logo} alt={c.name} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <div className="font-bold text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-500">ID: {c.id}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

