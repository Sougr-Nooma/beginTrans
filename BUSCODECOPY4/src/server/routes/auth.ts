/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.post('/register-client', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: 'Tous les champs client sont requis.' });
    }

    const existing = await prisma.client.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password,
      },
    });

    return res.status(201).json({
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      phone: client.phone,
      role: client.role,
    });
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

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client || client.password !== password) {
      return res.status(401).json({ error: 'Identifiants client invalides.' });
    }

    return res.json({
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      phone: client.phone,
      role: client.role,
    });
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

    const existingEmail = await prisma.company.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Cet email de compagnie est déjà utilisé.' });
    }

    const existingId = await prisma.company.findUnique({ where: { id } });
    if (existingId) {
      return res.status(409).json({ error: 'Cet identifiant de compagnie est déjà utilisé.' });
    }

    const company = await prisma.company.create({
      data: {
        id,
        name,
        email,
        phone,
        password,
        description,
        address,
      },
    });

    return res.status(201).json({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      role: 'COMPANY',
      address: company.address,
      description: company.description,
    });
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

    const company = await prisma.company.findUnique({ where: { id } });
    if (!company || company.password !== password) {
      return res.status(401).json({ error: 'Identifiants compagnie invalides.' });
    }

    return res.json({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      role: 'COMPANY',
      address: company.address,
      description: company.description,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
