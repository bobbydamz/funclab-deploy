import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "Vitamin D-3 + K2 – BioHAK Wellness",
  description: "2000 IU Vitamin D3 with 100mcg K2 MK-7 for bone health, heart health and immunity.",
};

export default function Page() {
  return <ProductDetailPage slug="vitamin-d3-k2" />;
}
