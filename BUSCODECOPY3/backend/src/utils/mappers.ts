import type { User, Trip, SpecialOffer, JobOffer } from '@prisma/client';

const DEFAULT_LOGO =
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=128&h=128&fit=crop';

export function toCompanyDto(user: User) {
  return {
    id: user.companySlug!,
    name: user.companyName || user.email,
    logo: user.logo || DEFAULT_LOGO,
    rating: user.rating ?? 4,
    description: user.description || '',
    email: user.email,
    phone: user.phone ?? undefined,
    address: user.address ?? undefined,
  };
}

export function toTripDto(trip: Trip) {
  return {
    id: trip.id,
    companyId: trip.companySlug,
    departureCity: trip.departureCity,
    arrivalCity: trip.arrivalCity,
    departureTime: trip.departureTime.toISOString(),
    arrivalTime: trip.arrivalTime.toISOString(),
    price: trip.price,
    availableSeats: trip.availableSeats,
    totalSeats: trip.totalSeats,
    busType: trip.busType as 'Standard' | 'Climatisé' | 'VIP',
    gares: trip.gares ?? undefined,
  };
}

export function toSpecialOfferDto(offer: SpecialOffer) {
  return {
    id: offer.id,
    companyId: offer.companySlug ?? undefined,
    title: offer.title,
    description: offer.description,
    discountCode: offer.discountCode ?? undefined,
    discountPercentage: offer.discountPercentage ?? undefined,
    lineName: offer.lineName ?? undefined,
    createdAt: offer.createdAt.toISOString(),
  };
}

export function toJobOfferDto(job: JobOffer) {
  return {
    id: job.id,
    companyId: job.companySlug ?? undefined,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.type,
    createdAt: job.createdAt.toISOString(),
  };
}
