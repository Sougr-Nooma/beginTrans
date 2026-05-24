import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';
import { authPayload } from '../utils/jwt.js';

const ROLE_CLIENT = 'CLIENT';
const ROLE_COMPANY = 'COMPANY';
const ROLE_ADMIN = 'ADMIN';

const router = Router();
const SALT_ROUNDS = 10;

router.post('/register-client', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: 'Tous les champs client sont requis.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: ROLE_CLIENT,
      },
    });

    return res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
});

router.post('/login-client', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = await prisma.user.findFirst({
      where: { email, role: ROLE_CLIENT },
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants client invalides.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants client invalides.' });
    }

    return res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
});

router.post('/register-company', async (req, res, next) => {
  try {
    const { id, name, email, phone, password, description, address } = req.body;
    if (!id || !name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Tous les champs compagnie sont requis.' });
    }

    const companySlug = String(id).toLowerCase();

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Cet email de compagnie est déjà utilisé.' });
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
      },
    });

    return res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
});

router.post('/login-company', async (req, res, next) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ error: 'ID de compagnie et mot de passe requis.' });
    }

    const companySlug = String(id).toLowerCase();
    const user = await prisma.user.findFirst({
      where: { companySlug, role: ROLE_COMPANY },
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants compagnie invalides.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants compagnie invalides.' });
    }

    return res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
});

router.post('/login-admin', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe admin requis.' });
    }

    const user = await prisma.user.findFirst({
      where: { email, role: ROLE_ADMIN },
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants administrateur invalides.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants administrateur invalides.' });
    }

    return res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
});

export default router;
