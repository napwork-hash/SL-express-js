import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Memulai seeding data produk...');

  await prisma.product.deleteMany();

  const products = [
   {
      name: 'Kaos Polos Hitam',
      price: 50000,
      description: 'Kaos polos katun combed 30s nyaman dipakai.',
    },
    {
      name: 'Kemeja Flanel Kotak-Kotak',
      price: 150000,
      description: 'Kemeja flanel premium lengan panjang.',
    },
    {
      name: 'Celana Chino Cream',
      price: 125000,
      description: 'Celana chino slim fit stretch.',
    },
    {
      name: 'Jaket Hoodie Polos',
      price: 175000,
      description: 'Hoodie bahan fleece tebal hangat.',
    },
    {
      name: 'Sepatu Sneakers Putih',
      price: 250000,
      description: 'Sneakers kasual bahan kulit sintetis.',
    },
    {
      name: 'Kaos Polos Hitam',
      price: 50000,
      description: 'Kaos polos katun combed 30s nyaman dipakai.',
    },
    {
      name: 'Kemeja Flanel Kotak-Kotak',
      price: 150000,
      description: 'Kemeja flanel premium lengan panjang.',
    },
    {
      name: 'Celana Chino Cream',
      price: 125000,
      description: 'Celana chino slim fit stretch.',
    },
    {
      name: 'Jaket Hoodie Polos',
      price: 175000,
      description: 'Hoodie bahan fleece tebal hangat.',
    },
    {
      name: 'Sepatu Sneakers Putih',
      price: 250000,
      description: 'Sneakers kasual bahan kulit sintetis.',
    }
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({ data: product });
    console.log(`Berhasil membuat produk: ${createdProduct.name} (ID: ${createdProduct.id})`);
  }

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });