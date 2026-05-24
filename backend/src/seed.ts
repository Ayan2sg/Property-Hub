import { ListingApprovalStatus, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const properties = [
  {
    title: "Modern Downtown Apartment",
    price: "$450,000",
    location: "Downtown Manhattan, NY",
    beds: 2,
    baths: 2,
    sqft: "1,200 sq ft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    type: "SALE" as const,
    featured: true,
    amenities: ["wifi", "parking", "gym"],
    availableFrom: "Immediate"
  },
  {
    title: "Luxury Villa with Pool",
    price: "$3,200",
    location: "Beverly Hills, CA",
    beds: 4,
    baths: 3,
    sqft: "2,800 sq ft",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    type: "RENT" as const,
    featured: true,
    amenities: ["pool", "garden", "parking"],
    availableFrom: "March 1st"
  },
  {
    title: "Cozy Family Home",
    price: "$280,000",
    location: "Suburban Chicago, IL",
    beds: 3,
    baths: 2,
    sqft: "1,800 sq ft",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    type: "SALE" as const,
    featured: false,
    amenities: ["garden", "garage"],
    availableFrom: "Available Now"
  },
  {
    title: "Contemporary Glass House",
    price: "$2,100",
    location: "Seattle, WA",
    beds: 3,
    baths: 2,
    sqft: "2,200 sq ft",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    type: "RENT" as const,
    featured: false,
    amenities: ["wifi", "smart home", "view"],
    availableFrom: "April 15th"
  },
  {
    title: "Urban Loft Space",
    price: "$650,000",
    location: "Brooklyn, NY",
    beds: 2,
    baths: 1,
    sqft: "1,400 sq ft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    type: "SALE" as const,
    featured: false,
    amenities: ["exposed brick", "high ceilings"],
    availableFrom: null
  },
  {
    title: "Suburban Ranch Home",
    price: "$1,800",
    location: "Austin, TX",
    beds: 4,
    baths: 3,
    sqft: "2,400 sq ft",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    type: "RENT" as const,
    featured: false,
    amenities: ["large yard", "parking", "pet friendly"],
    availableFrom: "May 1st"
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@prophaven.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.payment.deleteMany();
  await prisma.property.deleteMany();
  console.log('🗑️  Cleared existing properties');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, passwordHash: adminPasswordHash, name: 'Admin' },
    create: {
      name: 'Admin',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Admin user ready: ${admin.email}`);

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        amenities: JSON.stringify(property.amenities),
        approvalStatus: ListingApprovalStatus.APPROVED,
      }
    });
  }

  console.log(`✅ Seeded ${properties.length} approved properties`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
