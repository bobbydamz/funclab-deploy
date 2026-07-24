import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plant Protein – BioHAK Wellness",
  description: "Vegan plant protein with 27-28g protein per scoop from pea and rice protein. Complete amino acid profile.",
};

export default function Page() {
  return <ProductDetailPage slug="plant-protein" />;
}
