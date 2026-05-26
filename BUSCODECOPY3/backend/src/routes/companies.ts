import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';
import { toCompanyDto } from '../utils/mappers.js';

const router = Router();
const ROLE_COMPANY = 'COMPANY';
const SALT_ROUNDS = 10;

router.get('/', async (_req, res, next) => {
  try {
    const companies = await prisma.user.findMany({
      where: { role: ROLE_COMPANY },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(companies.map(toCompanyDto));
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const company = await prisma.user.findFirst({
      where: { role: ROLE_COMPANY, companySlug: slug },
    });
    if (!company) {
      return res.status(404).json({ error: 'Compagnie introuvable.' });
    }
    return res.json(toCompanyDto(company));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { id, name, email, phone, password, description, address, logo, rating } = req.body;
    if (!id || !name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Champs compagnie requis manquants.' });
    }

    const companySlug = String(id).toLowerCase();
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    const existingSlug = await prisma.user.findUnique({ where: { companySlug } });
    if (existingSlug) {
      return res.status(409).json({ error: 'Cet identifiant de compagnie est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        role: ROLE_COMPANY,
        companySlug,
        companyName: name,
        description,
        address,
        logo,
        rating: rating ?? 4,
      },
    });

    return res.status(201).json(toCompanyDto(user));
  } catch (error) {
    next(error);
  }
});

router.put('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const { name, email, phone, description, address, logo, rating } = req.body;

    const existing = await prisma.user.findFirst({
      where: { role: ROLE_COMPANY, companySlug: slug },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Compagnie introuvable.' });
    }

    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }
    }

    const user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        companyName: name ?? existing.companyName,
        email: email ?? existing.email,
        phone: phone ?? existing.phone,
        description: description ?? existing.description,
        address: address ?? existing.address,
        logo: logo ?? existing.logo,
        rating: rating ?? existing.rating,
      },
    });

    return res.json(toCompanyDto(user));
  } catch (error) {
    next(error);
  }
});

router.delete('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const existing = await prisma.user.findFirst({
      where: { role: ROLE_COMPANY, companySlug: slug },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Compagnie introuvable.' });
    }

    await prisma.user.delete({ where: { id: existing.id } });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
