import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

export const metadata: Metadata = {
  title: "Whey Protein – BioHAK Wellness",
  description: "Clean whey protein isolate with 29-30g protein per scoop. No artificial sweeteners, no gums. Enhanced with digestive enzymes.",
};

export default function Page() {
  return <ProductDetailPage slug="whey-protein" />;
}
