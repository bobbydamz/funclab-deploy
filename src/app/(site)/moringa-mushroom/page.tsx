import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "Moringa + Mushroom Lions Mane – BioHAK Wellness",
  description: "Lion's Mane mushroom and Moringa blend for vitality, cognitive support and longevity.",
};

export default function Page() {
  return <ProductDetailPage slug="moringa-mushroom" />;
}
