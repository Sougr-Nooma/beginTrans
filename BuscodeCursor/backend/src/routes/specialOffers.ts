import { Router } from 'express';
import prisma from '../db.js';
import { toSpecialOfferDto } from '../utils/mappers.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const offers = await prisma.specialOffer.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(offers.map(toSpecialOfferDto));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { companyId, title, description, discountCode, discountPercentage, lineName } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis.' });
    }

    let companyUserId: string | null = null;
    const companySlug = companyId ? String(companyId).toLowerCase() : null;
    if (companySlug) {
      const company = await prisma.user.findFirst({
        where: { role: 'COMPANY', companySlug },
      });
      companyUserId = company?.id ?? null;
    }

    const offer = await prisma.specialOffer.create({
      data: {
        companySlug,
        companyUserId,
        title,
        description,
        discountCode,
        discountPercentage: discountPercentage != null ? Number(discountPercentage) : null,
        lineName,
      },
    });

    return res.status(201).json(toSpecialOfferDto(offer));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.specialOffer.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
