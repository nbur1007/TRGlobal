import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { encodePassword } from '../src/utils/bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  // ---------------------------------------------------------------------------
  // Initial Admin Creation
  // ---------------------------------------------------------------------------

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) throw new Error('SEED_ADMIN_PASSWORD not set');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@TRGlobal.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@TRGlobal.com',
      passwordHash: encodePassword(adminPassword),
      role: 'ADMIN',
    },
  });

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------

  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
        name: 'Electronics',
        slug: 'electronics',
    },
  })

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
        name: 'Clothing',
        slug: 'clothing',
    },
  })

  const homeAndKitchen = await prisma.category.upsert({
    where: { name: 'Home & Kitchen' },
    update: {},
    create: {
        name: 'Home & Kitchen',
        slug: 'home-and-kitchen',
    },
  })

  const sportsAndOutdoors = await prisma.category.upsert({
    where: { name: 'Sports & Outdoors' },
    update: {},
    create: {
        name: 'Sports & Outdoors',
        slug: 'sports-and-outdoors',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
