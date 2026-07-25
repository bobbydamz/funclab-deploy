import { prisma } from "./prisma";
import type { Prisma, Product } from "@prisma/client";

// Prisma's Decimal is a class instance, not a plain object, so it can't cross the
// Server -> Client Component boundary. Every product read from the DB gets its rating
// converted to a plain number before leaving this module.
export type SerializedProduct = Omit<Product, "rating"> & { rating: number | null };

function serializeProduct(p: Product): SerializedProduct {
  return { ...p, rating: p.rating === null ? null : p.rating.toNumber() };
}

export async function getProductBySlug(slug: string): Promise<SerializedProduct | null> {
  const product = await prisma.product.findUnique({ where: { slug, active: true } });
  return product ? serializeProduct(product) : null;
}

export type ProductFilters = {
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "best-selling" | "relevant";
};

export async function getAllProducts(filters: ProductFilters = {}): Promise<SerializedProduct[]> {
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

  const products = await prisma.product.findMany({ where, orderBy });
  return products.map(serializeProduct);
}

// Admin-only reads/writes -- unlike the storefront functions above, these deliberately do
// NOT filter on active:true, since admins need to see and edit inactive products too.

export async function getAllProductsAdmin(): Promise<SerializedProduct[]> {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return products.map(serializeProduct);
}

export async function getProductByIdAdmin(id: number): Promise<SerializedProduct | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? serializeProduct(product) : null;
}

export type ProductInput = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  description: string;
  benefits: string[];
  benefitTags: string[];
  rating: number | null;
  reviewCount: number;
  stock: number;
  active: boolean;
};

export async function createProduct(data: ProductInput) {
  const product = await prisma.product.create({ data });
  return serializeProduct(product);
}

export async function updateProduct(id: number, data: Partial<ProductInput>) {
  const product = await prisma.product.update({ where: { id }, data });
  return serializeProduct(product);
}

export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

/**
 * The original site's per-product-page "You May Also Like" section always referenced the
 * same small cluster of the first 4 catalog products (b-complex/biotin/iron-vitamin-c/
 * moringa-mushroom), just excluding whichever one was currently being viewed — not a real
 * per-product recommendation. Reproducing that exact static behavior here rather than
 * inventing a new "similar products" algorithm that wasn't part of the original design.
 */
export async function getRelatedProducts(currentSlug: string): Promise<SerializedProduct[]> {
  const cluster = await prisma.product.findMany({
    where: { active: true },
    orderBy: { id: "asc" },
    take: 4,
  });
  return cluster.filter((p) => p.slug !== currentSlug).slice(0, 3).map(serializeProduct);
}
