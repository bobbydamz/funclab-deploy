import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug, active: true } });
}

export type ProductFilters = {
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "best-selling" | "relevant";
};

export function getAllProducts(filters: ProductFilters = {}) {
  const where: Prisma.ProductWhereInput = { active: true };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { id: "asc" };
  switch (filters.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "best-selling":
      orderBy = { reviewCount: "desc" };
      break;
    case "relevant":
      orderBy = { rating: "desc" };
      break;
    default:
      orderBy = { id: "asc" };
  }

  return prisma.product.findMany({ where, orderBy });
}

/**
 * The original site's per-product-page "You May Also Like" section always referenced the
 * same small cluster of the first 4 catalog products (b-complex/biotin/iron-vitamin-c/
 * moringa-mushroom), just excluding whichever one was currently being viewed — not a real
 * per-product recommendation. Reproducing that exact static behavior here rather than
 * inventing a new "similar products" algorithm that wasn't part of the original design.
 */
export async function getRelatedProducts(currentSlug: string) {
  const cluster = await prisma.product.findMany({
    where: { active: true },
    orderBy: { id: "asc" },
    take: 4,
  });
  return cluster.filter((p) => p.slug !== currentSlug).slice(0, 3);
}
