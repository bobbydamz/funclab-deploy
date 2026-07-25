import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New Product — Admin" };

export default function NewProductPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <ProductForm mode="create" />
    </div>
  );
}
