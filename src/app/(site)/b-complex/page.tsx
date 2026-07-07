import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "B-Complex – BioHAK Wellness",
  description: "Complete B1-B12 formula for energy, nervous system support and red blood cell formation.",
};

export default function Page() {
  return <ProductDetailPage slug="b-complex" />;
}
