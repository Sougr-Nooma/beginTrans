/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Passenger, Trip, BusCompany } from '../../types';

export function TicketView({
  trip,
  company,
  passengers,
}: {
  trip: Trip;
  company: BusCompany;
  passengers: Passenger[];
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-display font-black">Ticket (démo)</h2>
      <p className="text-gray-500 mt-3">{company.name} - {trip.departureCity} → {trip.arrivalCity}</p>
      <div className="mt-6 text-left bg-white border border-gray-100 rounded-[2.5rem] p-8">
        <div className="text-sm font-bold text-gray-700">Passagers</div>
        <ul className="mt-4 space-y-2">
          {passengers.map((p, idx) => (
            <li key={idx} className="text-sm text-gray-600">{p.firstName} {p.lastName} ({p.phone})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

