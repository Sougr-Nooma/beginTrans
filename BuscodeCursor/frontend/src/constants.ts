/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusCompany, Trip, SpecialOffer, JobOffer } from './types';
import { addHours, format, startOfToday } from 'date-fns';

export const COMPAGNIES: BusCompany[] = [
  {
    id: 'tsr',
    name: 'TSR (Transport Sana Rasmané)',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=128&h=128&fit=crop',
    rating: 4.5,
    description: 'Leader du transport interurbain au Burkina Faso.',
    address: 'Gare TSR, Patte d\'Oie, Ouagadougou',
    phone: '+226 25 31 01 01',
    email: 'contact@tsr-burkina.com'
  },
  {
    id: 'elitis',
    name: 'Elitis Express',
    logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=128&h=128&fit=crop',
    rating: 4.8,
    description: 'Voyagez avec confort et élégance.',
    address: 'Zone Commerciale, 1200 Logements, Ouagadougou',
    phone: '+226 25 41 41 41',
    email: 'info@elitisexpress.com'
  },
  {
    id: 'rahimo',
    name: 'Rahimo Transport',
    logo: 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?w=128&h=128&fit=crop',
    rating: 4.2,
    description: 'La ponctualité au service des usagers.',
    address: 'Place de la Nation, Bobo-Dioulasso',
    phone: '+226 20 97 00 00',
    email: 'reservations@rahimo.bf'
  },
  {
    id: 'ranhall',
    name: 'Ranhall Transport',
    logo: 'https://images.unsplash.com/photo-1562618032-45237c95e921?w=128&h=128&fit=crop',
    rating: 4.0,
    description: 'Sécurité et fiabilité sur toutes nos lignes.',
    address: 'Gare Ranhall, Gounghin, Ouagadougou',
    phone: '+226 25 34 34 34',
    email: 'contact@ranhall.com'
  }
];

export const POPULAR_COMPANIES = COMPAGNIES.slice(0, 3);

const today = startOfToday();

export const MOCK_TRIPS: Trip[] = [
  // TSR
  {
    id: 't1',
    companyId: 'tsr',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Bobo-Dioulasso',
    departureTime: addHours(today, 6).toISOString(),
    arrivalTime: addHours(today, 11).toISOString(),
    price: 6000,
    availableSeats: 25,
    totalSeats: 50,
    busType: 'Standard'
  },
  {
    id: 't1_vip',
    companyId: 'tsr',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Bobo-Dioulasso',
    departureTime: addHours(today, 9).toISOString(),
    arrivalTime: addHours(today, 14).toISOString(),
    price: 9000,
    availableSeats: 15,
    totalSeats: 30,
    busType: 'VIP'
  },
  // Elitis
  {
    id: 't2_std',
    companyId: 'elitis',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Bobo-Dioulasso',
    departureTime: addHours(today, 7).toISOString(),
    arrivalTime: addHours(today, 12).toISOString(),
    price: 8000,
    availableSeats: 20,
    totalSeats: 40,
    busType: 'Standard'
  },
  {
    id: 't2',
    companyId: 'elitis',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Bobo-Dioulasso',
    departureTime: addHours(today, 8).toISOString(),
    arrivalTime: addHours(today, 13).toISOString(),
    price: 12000,
    availableSeats: 12,
    totalSeats: 40,
    busType: 'VIP'
  },
  // Rahimo
  {
    id: 't3',
    companyId: 'rahimo',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Koudougou',
    departureTime: addHours(today, 7).toISOString(),
    arrivalTime: addHours(today, 8).toISOString(),
    price: 2500,
    availableSeats: 30,
    totalSeats: 45,
    busType: 'Standard'
  },
  {
    id: 't3_vip',
    companyId: 'rahimo',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Koudougou',
    departureTime: addHours(today, 10).toISOString(),
    arrivalTime: addHours(today, 11).toISOString(),
    price: 4500,
    availableSeats: 15,
    totalSeats: 20,
    busType: 'VIP'
  },
  // Ranhall
  {
    id: 't4_ranhall',
    companyId: 'ranhall',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Banfora',
    departureTime: addHours(today, 6).toISOString(),
    arrivalTime: addHours(today, 13).toISOString(),
    price: 7000,
    availableSeats: 40,
    totalSeats: 50,
    busType: 'Standard'
  },
  {
    id: 't4_ranhall_vip',
    companyId: 'ranhall',
    departureCity: 'Ouagadougou',
    arrivalCity: 'Banfora',
    departureTime: addHours(today, 11).toISOString(),
    arrivalTime: addHours(today, 18).toISOString(),
    price: 11000,
    availableSeats: 10,
    totalSeats: 20,
    busType: 'VIP'
  },
  {
    id: 't4',
    companyId: 'tsr',
    departureCity: 'Bobo-Dioulasso',
    arrivalCity: 'Ouagadougou',
    departureTime: addHours(today, 14).toISOString(),
    arrivalTime: addHours(today, 19).toISOString(),
    price: 6000,
    availableSeats: 45,
    totalSeats: 50,
    busType: 'Standard'
  }
];

export const INITIAL_SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'so-1',
    companyId: 'elitis',
    title: '-20% sur la ligne Bobo',
    description: 'Offre préférentielle sur l\'ensemble des trajets de la semaine avec Elitis Express.',
    discountCode: 'BOBO20',
    discountPercentage: 20,
    lineName: 'Bobo-Dioulasso',
    createdAt: new Date().toISOString()
  },
  {
    id: 'so-2',
    companyId: 'tsr',
    title: 'Tarif Spécial Vacances',
    description: 'Bénéficiez d\'une réduction exceptionnelle pour tous les trajets en famille sur présentation d\'un justificatif.',
    discountCode: 'FASTRIP15',
    discountPercentage: 15,
    lineName: 'Toutes destinations',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_JOB_OFFERS: JobOffer[] = [
  {
    id: 'jo-1',
    companyId: 'fasobus',
    title: 'Développeur Fullstack React / Node',
    description: 'Prêt à révolutionner le transport national ? Rejoignez notre équipe technique en charge des applications web et mobiles à Ouagadougou.',
    location: 'Ouagadougou',
    type: 'Temps plein',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jo-2',
    companyId: 'fasobus',
    title: 'Conseiller Clientèle Senior',
    description: 'Gérer la cellule d\'assistance directe aux usagers, coordonner les remboursements de réservations annulées et épauler les transporteurs partenaires.',
    location: 'Ouagadougou',
    type: 'Temps plein',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jo-3',
    companyId: 'tsr',
    title: 'Chauffeur Routier Professionnel (Cat. D)',
    description: 'TSR Transport recrute des conducteurs chevronnés dotés d\'une expérience de 5 ans minimum sur les routes interurbaines burkinabè.',
    location: 'Ouagadougou',
    type: 'Temps plein',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jo-4',
    companyId: 'elitis',
    title: 'Personnel d\'Accueil & Escorte VIP',
    description: 'Garantir un confort de premier ordre et un service haut de gamme aux passagers de la ligne Elite à bord de nos autocars VIP.',
    location: 'Bobo-Dioulasso',
    type: 'Temps complet',
    createdAt: new Date().toISOString()
  }
];

