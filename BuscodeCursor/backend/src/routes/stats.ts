import { Router } from 'express';
import prisma from '../db.js';
import { toCompanyDto } from '../utils/mappers.js';

const router = Router();

function abbreviateCity(city: string) {
  const map: Record<string, string> = {
    Ouagadougou: 'OUA',
    'Bobo-Dioulasso': 'BOBO',
    Koudougou: 'KDG',
    Banfora: 'BNF',
  };
  return map[city] || city.slice(0, 3).toUpperCase();
}

router.get('/', async (_req, res, next) => {
  try {
    const [companies, trips, clients] = await Promise.all([
      prisma.user.findMany({ where: { role: 'COMPANY' } }),
      prisma.trip.findMany({ include: { company: true } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
    ]);

    const companyDtos = companies.map(toCompanyDto);

    const byCompany = companyDtos.map((c) => {
      const companyTrips = trips.filter((t) => t.companySlug === c.id);
      const travelers = companyTrips.reduce(
        (sum, t) => sum + (t.totalSeats - t.availableSeats),
        0,
      );
      return {
        name: c.name.split(' ')[0],
        companyId: c.id,
        value: travelers || companyTrips.length,
        tripCount: companyTrips.length,
      };
    });

    const totalByCompany = byCompany.reduce((s, x) => s + x.value, 0) || 1;
    const statsByCompany = byCompany.map((v) => ({
      ...v,
      percentage: ((v.value / totalByCompany) * 100).toFixed(1) + '%',
    }));

    const tripStats = trips.map((t) => ({
      route: `${abbreviateCity(t.departureCity)} → ${abbreviateCity(t.arrivalCity)}`,
      fullRoute: `${t.departureCity} → ${t.arrivalCity}`,
      travelers: t.totalSeats - t.availableSeats,
      companyId: t.companySlug,
      company: t.company.companyName?.split(' ')[0] || t.companySlug,
    }));

    const now = new Date();
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthTrips = trips.filter((t) => {
        const dep = t.departureTime;
        return dep.getFullYear() === d.getFullYear() && dep.getMonth() === d.getMonth();
      });
      const passagers = monthTrips.reduce((s, t) => s + (t.totalSeats - t.availableSeats), 0);
      const CA = monthTrips.reduce((s, t) => s + t.price * (t.totalSeats - t.availableSeats), 0);
      return {
        name: d.toLocaleString('fr-FR', { month: 'short' }),
        passagers,
        CA,
      };
    });

    return res.json({
      totalCompanies: companies.length,
      totalTrips: trips.length,
      totalClients: clients,
      statsByCompany,
      tripStats,
      monthly,
      companies: companyDtos,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
