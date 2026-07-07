import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "Plant Protein – BioHAK Wellness",
  description: "Vegan plant protein with 27-28g protein per scoop from pea and rice protein. Complete amino acid profile.",
};

export default function Page() {
  return <ProductDetailPage slug="plant-protein" />;
}
