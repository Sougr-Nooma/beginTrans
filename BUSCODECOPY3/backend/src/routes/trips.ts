import { Router } from 'express';
import prisma from '../db.js';
import { toTripDto } from '../utils/mappers.js';

const router = Router();

async function resolveCompanyUserId(companySlug: string) {
  const company = await prisma.user.findFirst({
    where: { role: 'COMPANY', companySlug: companySlug.toLowerCase() },
  });
  return company?.id ?? null;
}

router.get('/', async (req, res, next) => {
  try {
    const { from, to, companyId } = req.query;
    const trips = await prisma.trip.findMany({
      where: {
        ...(from ? { departureCity: String(from) } : {}),
        ...(to ? { arrivalCity: String(to) } : {}),
        ...(companyId ? { companySlug: String(companyId).toLowerCase() } : {}),
      },
      orderBy: { departureTime: 'asc' },
    });
    return res.json(trips.map(toTripDto));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      companyId,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      totalSeats,
      busType,
      gares,
    } = req.body;

    if (!companyId || !departureCity || !arrivalCity || !departureTime || !arrivalTime || price == null) {
      return res.status(400).json({ error: 'Champs trajet requis manquants.' });
    }

    const companySlug = String(companyId).toLowerCase();
    const companyUserId = await resolveCompanyUserId(companySlug);
    if (!companyUserId) {
      return res.status(404).json({ error: 'Compagnie introuvable.' });
    }

    const trip = await prisma.trip.create({
      data: {
        companyUserId,
        companySlug,
        departureCity,
        arrivalCity,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price: Number(price),
        availableSeats: Number(availableSeats ?? totalSeats ?? 50),
        totalSeats: Number(totalSeats ?? 50),
        busType: busType || 'Standard',
        gares,
      },
    });

    return res.status(201).json(toTripDto(trip));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.trip.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Trajet introuvable.' });
    }

    const body = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
        departureCity: body.departureCity ?? existing.departureCity,
        arrivalCity: body.arrivalCity ?? existing.arrivalCity,
        departureTime: body.departureTime ? new Date(body.departureTime) : existing.departureTime,
        arrivalTime: body.arrivalTime ? new Date(body.arrivalTime) : existing.arrivalTime,
        price: body.price != null ? Number(body.price) : existing.price,
        availableSeats: body.availableSeats != null ? Number(body.availableSeats) : existing.availableSeats,
        totalSeats: body.totalSeats != null ? Number(body.totalSeats) : existing.totalSeats,
        busType: body.busType ?? existing.busType,
        gares: body.gares ?? existing.gares,
      },
    });

    return res.json(toTripDto(trip));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.trip.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
