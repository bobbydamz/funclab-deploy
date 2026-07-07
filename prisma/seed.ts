import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    slug: "b-complex", name: "B-Complex", price: 2800, compareAtPrice: 3200, image: "/product-b-complex.png", rating: 4.9, reviewCount: 7,
    benefitTags: ["Energy Boost", "Nervous System"],
    description: "A complete B-Complex formula delivering all 8 essential B vitamins to support energy metabolism, nervous system function, and cellular health. Formulated for optimal bioavailability.",
    benefits: ["Boosts energy metabolism", "Supports nervous system health", "Enhances cognitive function", "Promotes healthy skin & hair", "Reduces fatigue & stress"],
  },
  {
    slug: "biotin", name: "Biotin", price: 1800, compareAtPrice: 2200, image: "/product-biotin.png", rating: 4.8, reviewCount: 16,
    benefitTags: ["Hair & Nails", "Healthy Skin"],
    description: "High-potency Biotin (Vitamin B7) supplement designed to strengthen hair, nails and skin. Supports healthy keratin infrastructure and normal macronutrient metabolism.",
    benefits: ["Strengthens hair & nails", "Supports healthy skin", "Improves keratin infrastructure", "Boosts energy metabolism", "Supports normal thyroid function"],
  },
  {
    slug: "iron-vitamin-c", name: "Iron + Vitamin C", price: 2200, compareAtPrice: 2600, image: "/product-iron-vitamin-c.png", rating: 4.3, reviewCount: 8,
    benefitTags: ["Iron Absorption", "Immune Support"],
    description: "Synergistic Iron and Vitamin C combination. Vitamin C significantly enhances iron absorption, making this the most effective way to address iron deficiency and support red blood cell production.",
    benefits: ["Enhanced iron absorption", "Supports red blood cell formation", "Reduces fatigue & weakness", "Immune system support", "Antioxidant protection"],
  },
  {
    slug: "moringa-mushroom", name: "Moringa + Mushroom Lions Mane", price: 3500, compareAtPrice: 4000, image: "/product-moringa-mushroom.png", rating: 4.9, reviewCount: 6,
    benefitTags: ["Cognitive Clarity", "Brain Health"],
    description: "A powerful blend of Moringa leaf extract and Lion's Mane mushroom — two of nature's most potent superfoods. Supports brain health, cognitive clarity, and whole-body nourishment.",
    benefits: ["Enhances cognitive clarity", "Supports brain & nerve health", "Rich in antioxidants", "Anti-inflammatory properties", "Whole-body nourishment"],
  },
  {
    slug: "multivitamins", name: "Multivitamins", price: 3000, compareAtPrice: 3500, image: "/product-multivitamins.png", rating: 4.8, reviewCount: 22,
    benefitTags: ["Daily Convenience", "Immune Support"],
    description: "A comprehensive once-daily multivitamin delivering 20+ essential vitamins and minerals. Formulated for complete nutritional coverage with premium bioavailable forms of each nutrient.",
    benefits: ["20+ vitamins & minerals", "Once-daily convenience", "Premium bioavailable forms", "Immune & energy support", "Fills nutritional gaps"],
  },
  {
    slug: "omega-3-algal", name: "Omega-3 (Algal)", price: 3800, compareAtPrice: 4500, image: "/product-omega-3-algal.png", rating: 4.8, reviewCount: 9,
    benefitTags: ["DHA + EPA", "Brain & Heart"],
    description: "Plant-based Omega-3 DHA & EPA derived from premium algae — the original source of Omega-3s. 100% vegan, sustainable, and free from fish contaminants. Superior absorption compared to fish oil.",
    benefits: ["100% vegan & sustainable", "High DHA + EPA content", "No fishy aftertaste", "Superior bioavailability", "Brain & heart health support"],
  },
  {
    slug: "plant-protein", name: "Plant Protein", price: 4500, compareAtPrice: 5200, image: "/product-plant-protein.png", rating: 4.7, reviewCount: 14,
    benefitTags: ["25g Protein", "Easy Digestion"],
    description: "Clean plant-based protein blend combining pea protein and brown rice protein for a complete amino acid profile. 25g protein per serving, with no artificial sweeteners or fillers.",
    benefits: ["25g protein per serving", "Complete amino acid profile", "No artificial sweeteners", "Easy on digestion", "Multiple flavour options"],
  },
  {
    slug: "vitamin-d3-k2", name: "Vitamin D-3 + K2", price: 2500, compareAtPrice: 3000, image: "/product-vitamin-d3-k2.png", rating: 4.9, reviewCount: 11,
    benefitTags: ["Bone Density", "Heart Health"],
    description: "The essential duo of Vitamin D3 and K2 working synergistically. D3 enhances calcium absorption while K2 directs it to your bones — not your arteries. Critical for bone density, immune function, and cardiovascular health.",
    benefits: ["Supports bone density", "Cardiovascular protection", "Immune system boost", "Enhances calcium utilisation", "Synergistic D3 + K2 formula"],
  },
  {
    slug: "whey-protein", name: "Whey Protein", price: 5500, compareAtPrice: 6500, image: "/product-whey-protein.png", rating: 4.8, reviewCount: 18,
    benefitTags: ["Muscle Recovery", "Grass-Fed"],
    description: "Premium grass-fed whey protein with 27g of protein per serving. Instantised for smooth mixing, with minimal lactose and no artificial ingredients. Available in multiple flavours.",
    benefits: ["27g protein per serving", "Grass-fed whey source", "Low lactose formula", "No artificial ingredients", "Rapid muscle recovery"],
  },
];

const coupons = [
  { code: "WELCOME10", type: "PERCENT" as const, value: 10 },
  { code: "FLAT200", type: "FLAT" as const, value: 200 },
  { code: "FREESHIP", type: "SHIPPING" as const, value: 0 },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: { ...c, active: true },
    });
  }

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD env var is required to seed the admin account (no hardcoded default password)."
    );
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: "admin@biohakwellness.com" },
    update: {},
    create: {
      firstName: "Admin",
      email: "admin@biohakwellness.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Seeded ${products.length} products, ${coupons.length} coupons, 1 admin user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
