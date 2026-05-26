import { Router } from 'express';
import prisma from '../db.js';
import { toJobOfferDto } from '../utils/mappers.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const jobs = await prisma.jobOffer.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(jobs.map(toJobOfferDto));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { companyId, title, description, location, type } = req.body;
    if (!title || !description || !location || !type) {
      return res.status(400).json({ error: 'Champs offre d\'emploi requis manquants.' });
    }

    let companyUserId: string | null = null;
    const companySlug = companyId ? String(companyId).toLowerCase() : null;
    if (companySlug && companySlug !== 'fasobus') {
      const company = await prisma.user.findFirst({
        where: { role: 'COMPANY', companySlug },
      });
      companyUserId = company?.id ?? null;
    }

    const job = await prisma.jobOffer.create({
      data: {
        companySlug: companySlug === 'fasobus' ? null : companySlug,
        companyUserId,
        title,
        description,
        location,
        type,
      },
    });

    return res.status(201).json(toJobOfferDto(job));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.jobOffer.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
