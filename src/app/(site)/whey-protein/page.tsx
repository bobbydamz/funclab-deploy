import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Whey Protein – BioHAK Wellness",
  description: "Clean whey protein isolate with 29-30g protein per scoop. No artificial sweeteners, no gums. Enhanced with digestive enzymes.",
};

export default function Page() {
  return <ProductDetailPage slug="whey-protein" />;
}
