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
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
    },
  });

  const homeAndKitchen = await prisma.category.upsert({
    where: { name: 'Home & Kitchen' },
    update: {},
    create: {
      name: 'Home & Kitchen',
      slug: 'home-and-kitchen',
    },
  });

  const sportsAndOutdoors = await prisma.category.upsert({
    where: { name: 'Sports & Outdoors' },
    update: {},
    create: {
      name: 'Sports & Outdoors',
      slug: 'sports-and-outdoors',
    },
  });

  // ---------------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------------

  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Wireless Noise-Cancelling Headphones',
          description:
            'Over-ear headphones with active noise cancellation and 30-hour battery.',
          price: '199.99',
          stock: 50,
          imageUrl: '../assets/headphones.JPG',
          categoryId: electronics.id,
        },
        {
          name: '4K Streaming Media Player',
          description: 'Compact player with 4K HDR support and voice remote.',
          price: '49.99',
          stock: 120,
          imageUrl: '../assets/mediaStream.JPG',
          categoryId: electronics.id,
        },
        {
          name: 'Mechanical Keyboard',
          description:
            'Tenkeyless mechanical keyboard with hot-swappable switches.',
          price: '89.99',
          stock: 75,
          imageUrl: '../assets/keyboard.JPG',
          categoryId: electronics.id,
        },
        {
          name: 'Portable Bluetooth Speaker',
          description: 'Water-resistant speaker with 12-hour playtime.',
          price: '39.99',
          stock: 200,
          imageUrl: '../assets/speaker.JPG',
          categoryId: electronics.id,
        },

  
        {
          name: 'Classic Cotton T-Shirt',
          description: 'Soft 100% cotton crewneck tee.',
          price: '14.99',
          stock: 300,
          imageUrl: '../assets/tshirt.WEBP',
          categoryId: clothing.id,
        },
        {
          name: 'Slim-Fit Denim Jeans',
          description: 'Stretch denim jeans in a slim cut.',
          price: '49.99',
          stock: 150,
          imageUrl: '../assets/jeans.WEBP',
          categoryId: clothing.id,
        },
        {
          name: 'Merino Wool Sweater',
          description: 'Lightweight merino wool pullover.',
          price: '79.99',
          stock: 60,
          imageUrl: '../assets/sweater.WEBP',
          categoryId: clothing.id,
        },
        {
          name: 'Waterproof Rain Jacket',
          description: 'Packable shell with taped seams.',
          price: '99.99',
          stock: 40,
          imageUrl: '../assets/jacket.JPG',
          categoryId: clothing.id,
        },


        {
          name: "Stainless Steel Chef's Knife",
          description: '8-inch forged high-carbon stainless blade.',
          price: '34.99',
          stock: 90,
          imageUrl: '../assets/knife.JPG',
          categoryId: homeAndKitchen.id,
        },
        {
          name: '12-Cup Drip Coffee Maker',
          description: 'Programmable coffee maker with reusable filter.',
          price: '59.99',
          stock: 70,
          imageUrl: '../assets/coffee.JPG',
          categoryId: homeAndKitchen.id,
        },
        {
          name: 'Non-Stick Frying Pan Set',
          description: 'Set of two non-stick pans, 8" and 10".',
          price: '44.99',
          stock: 110,
          imageUrl: '../assets/pans.WEBP',
          categoryId: homeAndKitchen.id,
        },
        {
          name: 'Ceramic Dinnerware Set',
          description: '16-piece service for four.',
          price: '89.99',
          stock: 45,
          imageUrl: '../assets/plates.WEBP',
          categoryId: homeAndKitchen.id,
        },
      ],
    });

    await prisma.product.createMany({
        data: Array.from({ length: 15 }, (_, i) => {
        const n = i + 1;
        return {
            name: `Electronics Accessory ${n}`,
            description: `Filler electronics product ${n} for pagination testing.`,
            price: (9.99 + n).toFixed(2),
            stock: 100 + n,
            imageUrl: '../assets/test.JPG',
            categoryId: electronics.id,
        };
        }),
    });
  }
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
