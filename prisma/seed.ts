import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@dashboard.com' },
    update: {},
    create: {
      email: 'admin@dashboard.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const products = [
    {
      nama: 'Laptop Gaming ASUS ROG',
      kategori: 'Elektronik',
      harga: 15000000,
      deskripsi: 'Laptop gaming dengan spesifikasi tinggi, cocok untuk gaming dan rendering',
      stok: 5,
    },
    {
      nama: 'Mechanical Keyboard RGB',
      kategori: 'Aksesoris',
      harga: 850000,
      deskripsi: 'Keyboard mechanical dengan LED RGB, switch blue tactile',
      stok: 15,
    },
    {
      nama: 'Mouse Wireless Logitech',
      kategori: 'Aksesoris',
      harga: 350000,
      deskripsi: 'Mouse wireless ergonomis dengan battery tahan lama',
      stok: 20,
    },
    {
      nama: 'Monitor 27 inch 144Hz',
      kategori: 'Elektronik',
      harga: 3500000,
      deskripsi: 'Monitor gaming IPS 27 inch dengan refresh rate 144Hz',
      stok: 8,
    },
    {
      nama: 'Headset Gaming HyperX',
      kategori: 'Aksesoris',
      harga: 750000,
      deskripsi: 'Headset gaming dengan surround sound 7.1 dan microphone noise cancelling',
      stok: 12,
    },
    {
      nama: "Smartphone Samsung Galaxy",
      kategori: "Elektronik",
      harga: 6200000,
      deskripsi: "Smartphone Android dengan kamera jernih dan performa cepat",
      stok: 10
    },
    {
        nama: "Power Bank 20000mAh",
        kategori: "Aksesoris",
        harga: 400000,
        deskripsi: "Power bank kapasitas besar dengan fast charging",
        stok: 25
    },
    {
        nama: "Tablet Xiaomi Pad",
        kategori: "Elektronik",
        harga: 4800000,
        deskripsi: "Tablet layar lebar cocok untuk belajar dan hiburan",
        stok: 7
    },
    {
        nama: "Webcam Full HD",
        kategori: "Aksesoris",
        harga: 500000,
        deskripsi: "Webcam Full HD untuk meeting online dan streaming",
        stok: 18
    },
    {
        nama: "Smart TV 43 Inch",
        kategori: "Elektronik",
        harga: 5200000,
        deskripsi: "Smart TV dengan resolusi 4K dan fitur Android TV",
        stok: 6
    },
    {
        nama: "Cooling Pad Laptop",
        kategori: "Aksesoris",
        harga: 275000,
        deskripsi: "Cooling pad dengan kipas ganda untuk menjaga suhu laptop",
        stok: 14
    },
    {
        nama: "Kamera Mirrorless Sony",
        kategori: "Elektronik",
        harga: 12500000,
        deskripsi: "Kamera mirrorless dengan kualitas foto dan video profesional",
        stok: 4
    },
    {
        nama: "USB Hub Type-C",
        kategori: "Aksesoris",
        harga: 220000,
        deskripsi: "USB Hub multifungsi dengan dukungan HDMI dan USB 3.0",
        stok: 30
    },
    {
        nama: "Speaker Bluetooth JBL",
        kategori: "Elektronik",
        harga: 950000,
        deskripsi: "Speaker portable dengan suara bass kuat dan tahan air",
        stok: 11
    },
    {
        nama: "Mouse Pad Gaming XL",
        kategori: "Aksesoris",
        harga: 150000,
        deskripsi: "Mouse pad ukuran besar dengan permukaan halus untuk gaming",
        stok: 22
    },
    {
        nama: "Printer Epson EcoTank",
        kategori: "Elektronik",
        harga: 3200000,
        deskripsi: "Printer hemat tinta dengan kualitas cetak tajam",
        stok: 9
    },
    {
        nama: "Earbuds Wireless",
        kategori: "Aksesoris",
        harga: 650000,
        deskripsi: "Earbuds wireless dengan fitur noise reduction",
        stok: 17
    },
    {
        nama: "Router WiFi Dual Band",
        kategori: "Elektronik",
        harga: 850000,
        deskripsi: "Router WiFi dual band dengan koneksi stabil dan cepat",
        stok: 13
    },
    {
        nama: "Stand Laptop Aluminium",
        kategori: "Aksesoris",
        harga: 180000,
        deskripsi: "Stand laptop ergonomis berbahan aluminium kokoh",
        stok: 19
    },
    {
        nama: "Drone Kamera 4K",
        kategori: "Elektronik",
        harga: 7800000,
        deskripsi: "Drone dengan kamera 4K dan fitur stabilisasi video",
        stok: 3
    },
  ];

  await prisma.product.createMany({
  data: products,
  skipDuplicates: true,
  });

  console.log('✅ Seed data berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });