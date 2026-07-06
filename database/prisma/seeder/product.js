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

const categories = ["Kaos", "Kemeja", "Celana", "Jaket", "Sepatu", "Tas", "Topi", "Jam Tangan", "Kacamata", "Ikat Pinggang"];
const adjectives = ["Polos", "Bermotif", "Klasik", "Modern", "Minimalis", "Casual", "Formal", "Vintage", "Sporty", "Elegan"];
const materials = ["Katun", "Kulit", "Denim", "Linen", "Wol", "Polyester", "Kanvas", "Suede", "Nilon", "Rajut"];
const colors = ["Hitam", "Putih", "Navy", "Cream", "Abu-abu", "Coklat", "Merah", "Biru", "Hijau", "Kuning"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProduct() {
  const category = randomItem(categories);
  const adjective = randomItem(adjectives);
  const material = randomItem(materials);
  const color = randomItem(colors);

  const name = `${category} ${adjective} ${material}`;
  const price = Math.floor((Math.random() * (500000 - 20000) + 20000) / 1000) * 1000;
  const description = `${adjective} ${category.toLowerCase()} berbahan ${material.toLowerCase()} warna ${color.toLowerCase()}, cocok untuk kebutuhan sehari-hari.`;

  return { name, price, description };
}

async function main() {
  console.log("Memulai seeding data produk...");

  await prisma.product.deleteMany();

  const TOTAL_PRODUCTS = 100;
  const products = Array.from({ length: TOTAL_PRODUCTS }, generateProduct);

  await prisma.product.createMany({ data: products });

  console.log(`Seeding selesai! ${TOTAL_PRODUCTS} produk berhasil dibuat.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });