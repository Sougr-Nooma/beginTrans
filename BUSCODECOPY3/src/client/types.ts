/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description: string;
  email?: string;
  phone?: string;
  ifu?: string;
  address?: string;
}

export interface Trip {
  id: string;
  companyId: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  price: number; // in XOF (CFA)
  availableSeats: number;
  totalSeats: number;
  busType: 'Standard' | 'Climatisé' | 'VIP';
  gares?: string;
}

export interface Passenger {
  seatId: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  passengers: Passenger[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'RESERVED' | 'CANCELLED';
  paymentMethod?: 'ORANGE_MONEY' | 'MOOV_MONEY' | 'CARD';
  createdAt: string;
}

export type City = string;

export interface SpecialOffer {
  id: string;
  companyId?: string;
  title: string;
  description: string;
  discountCode?: string;
  discountPercentage?: number;
  lineName?: string;
  createdAt: string;
}

export interface JobOffer {
  id: string;
  companyId?: string;
  title: string;
  description: string;
  location: string;
  type: string;
  createdAt: string;
}

export const cities: City[] = [
  'Ouagadougou',
  'Bobo-Dioulasso',
  'Koudougou',
  'Ouahigouya',
  'Banfora',
  'Dédougou',
  'Kaya',
  'Tenkodogo',
  "Fada N'Gourma",
  'Gaoua'
];

