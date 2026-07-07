import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "Iron + Vitamin C – BioHAK Wellness",
  description: "Iron with 100mg Vitamin C for improved absorption. Addresses iron deficiency effectively.",
};

export default function Page() {
  return <ProductDetailPage slug="iron-vitamin-c" />;
}
