/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function SeatMap({
  totalSeats,
  availableSeats,
  selectedSeats,
  onToggleSeat,
}: {
  totalSeats: number;
  availableSeats: number;
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
}) {
  const seats = Array.from({ length: Math.min(totalSeats, 10) }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">Placeholder SeatMap</div>
      <div className="flex flex-wrap gap-3">
        {seats.map((n) => {
          const id = String(n);
          const active = selectedSeats.includes(id);
          return (
            <button
              key={id}
              onClick={() => onToggleSeat(id)}
              className={`px-4 py-3 rounded-xl font-bold text-sm border transition-all ${
                active ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-red/30'
              }`}
            >
              {id}
            </button>
          );
        })}
      </div>
      <div className="text-xs text-gray-400">Total: {totalSeats} / Disponibles: {availableSeats}</div>
    </div>
  );
}

