import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Multivitamins – BioHAK Wellness",
  description: "100% RDA core vitamins plus Zinc, Copper & Selenium. 60 tablets for complete daily nutrition.",
};

export default function Page() {
  return <ProductDetailPage slug="multivitamins" />;
}
