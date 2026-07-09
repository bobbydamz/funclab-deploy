import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import AllProductsCatalog from "@/components/product/AllProductsCatalog";
import "./all-products.css";

export const metadata: Metadata = {
  title: "All Products – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <div className="page-hero">
        <h1>All Products</h1>
        <p>Clean, science-backed supplements — formulated for real results.</p>
      </div>
      <AllProductsCatalog products={products} />
    </>
  );
}
