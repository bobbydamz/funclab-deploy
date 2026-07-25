import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByIdAdmin } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit Product — Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const product = await getProductByIdAdmin(productId);
  if (!product) notFound();

  return (
    <div style={{ maxWidth: 720 }}>
      <ProductForm mode="edit" initial={product} />
    </div>
  );
}
