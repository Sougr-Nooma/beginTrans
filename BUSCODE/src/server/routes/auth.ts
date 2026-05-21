import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db'; // Import par défaut maintenant correct

const router = express.Router();

// Interface pour le payload du token
interface JwtPayload {
  id: string;
  email: string;
  role: 'CLIENT' | 'COMPANY' | 'ADMIN';
}

// Inscription
// router.post('/register', async (req: Request, res: Response) => {
//   try {
//     const { email, password, name, role, phone } = req.body;

//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
//     }

//     // Hacher le mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Créer l'utilisateur
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//         role: role || 'CLIENT',
//         phone,
//       },
//     });

//     // Générer le token
//     const secret = process.env.JWT_SECRET || 'secret';
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       secret,
//       { expiresIn: '7d' } as jwt.SignOptions
//     );

//     res.status(201).json({
//       message: 'Utilisateur créé avec succès',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('Erreur inscription:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
//   }
// });
// ... imports (bcrypt, prisma, etc.)

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Vérification des champs obligatoires
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec les bons noms de champs (firstName/lastName au lieu de name)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: role as any, // Assurez-vous que le rôle correspond à l'enum (CLIENT, COMPANY, ADMIN)
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    });

    // Générer le token
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' } as jwt.SignOptions
    );

    res.status(201).json({ ...user, token });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' } as jwt.SignOptions
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

export default router;