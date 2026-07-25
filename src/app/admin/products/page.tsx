import type { Metadata } from "next";
import { getAllProductsAdmin } from "@/lib/products";
import ProductsTable from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <ProductsTable
      products={products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        image: p.image,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        active: p.active,
      }))}
    />
  );
}
