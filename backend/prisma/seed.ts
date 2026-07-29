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
          imageUrl: 'https://m.media-amazon.com/images/I/71YM2N5whtL.jpg',
          categoryId: electronics.id,
        },
        {
          name: '4K Streaming Media Player',
          description: 'Compact player with 4K HDR support and voice remote.',
          price: '49.99',
          stock: 120,
          imageUrl:
            'https://lcdn.altex.ro/media/catalog/product/h/d/hdpth245_1_2e58915c.jpg',
          categoryId: electronics.id,
        },
        {
          name: 'Mechanical Keyboard',
          description:
            'Tenkeyless mechanical keyboard with hot-swappable switches.',
          price: '89.99',
          stock: 75,
          imageUrl:
            'https://www.keychron.com/cdn/shop/products/Keychron-K8-tenkeyless-wireless-mechanical-keyboard-for-Mac-Windows-non-backlight-with-Keychron-switch-brown-hot-swappable.jpg?v=1657781173&width=1214',
          categoryId: electronics.id,
        },
        {
          name: 'Portable Bluetooth Speaker',
          description: 'Water-resistant speaker with 12-hour playtime.',
          price: '39.99',
          stock: 200,
          imageUrl:
            'https://contents.mediadecathlon.com/p2855566/k$7e601bc15f252591a4911ddbcf91f22e/portable-bluetoothR-speaker-ps100.jpg',
          categoryId: electronics.id,
        },

        {
          name: 'Classic Cotton T-Shirt',
          description: 'Soft 100% cotton crewneck tee.',
          price: '14.99',
          stock: 300,
          imageUrl:
            'https://cdn2.propercloth.com/pic_sp/1772_8a4081e427995376f093607f687f7e6e_size6.jpg',
          categoryId: clothing.id,
        },
        {
          name: 'Slim-Fit Denim Jeans',
          description: 'Stretch denim jeans in a slim cut.',
          price: '49.99',
          stock: 150,
          imageUrl:
            'https://lahaute.com.au/cdn/shop/files/Lahaute_Sep_99347.jpg?v=1755737936&width=1638',
          categoryId: clothing.id,
        },
        {
          name: 'Merino Wool Sweater',
          description: 'Lightweight merino wool pullover.',
          price: '79.99',
          stock: 60,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTzuZGNItdM5yaL7ygSLjBjATdNu0ehJHjJG_mx42mYpkXocVvcCXzSIWG&s=10',
          categoryId: clothing.id,
        },
        {
          name: 'Waterproof Rain Jacket',
          description: 'Packable shell with taped seams.',
          price: '99.99',
          stock: 40,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpObMGetsxO0jD1s937LsSdE5om3LJYvM_F6GsDYVb-jXUD-BgEjKEZFsR&s=10',
          categoryId: clothing.id,
        },

        {
          name: "Stainless Steel Chef's Knife",
          description: '8-inch forged high-carbon stainless blade.',
          price: '34.99',
          stock: 90,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT0AXBbYemYc_2A5wZ8JrXtnYovfX5LisFTwhfxEi6-o053SVVXE5lK8c&s=10',
          categoryId: homeAndKitchen.id,
        },
        {
          name: '12-Cup Drip Coffee Maker',
          description: 'Programmable coffee maker with reusable filter.',
          price: '59.99',
          stock: 70,
          imageUrl:
            'https://www.koolatron.com.au/cdn/shop/files/KKCM12B-ECOM-AU-01.jpg?v=1715423378',
          categoryId: homeAndKitchen.id,
        },
        {
          name: 'Non-Stick Frying Pan Set',
          description: 'Set of two non-stick pans, 8" and 10".',
          price: '44.99',
          stock: 110,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwCCZnCrQZqgFgjSjlXlkt0wTyTfQuPLh3ZwH4Hg7XDcf2gO-SVk0m34ks&s=10',
          categoryId: homeAndKitchen.id,
        },
        {
          name: 'Ceramic Dinnerware Set',
          description: '16-piece service for four.',
          price: '89.99',
          stock: 45,
          imageUrl:
            'https://ak1.ostkcdn.com/images/products/is/images/direct/c7c5768d541e509ce423ca5b0b9eec6de131122d/16-PC-Rimmed-Dinnerware-Set-for-4-Person%2C-Mugs%2C-Salad-and-Dinner-Plates-and-Bowls-Sets%2C-White.jpg',
          categoryId: homeAndKitchen.id,
        },
      ],
    });

    await prisma.product.createMany({
      data: Array.from({ length: 21 }, (_, i) => {
        const n = i + 1;
        return {
          name: `Electronics Accessory ${n}`,
          description: `Filler electronics product ${n} for pagination testing.`,
          price: (9.99 + n).toFixed(2),
          stock: 100 + n,
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
