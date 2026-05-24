import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@fasobus.bf';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Administrateur',
      lastName: 'FasoBus',
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Administrateur',
      lastName: 'FasoBus',
    },
  });

  console.log(`Compte admin prêt : ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
