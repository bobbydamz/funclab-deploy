import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "Multivitamins – BioHAK Wellness",
  description: "100% RDA core vitamins plus Zinc, Copper & Selenium. 60 tablets for complete daily nutrition.",
};

export default function Page() {
  return <ProductDetailPage slug="multivitamins" />;
}
