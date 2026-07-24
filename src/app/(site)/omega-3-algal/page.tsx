import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Omega-3 (Algal) – BioHAK Wellness",
  description: "Vegan algal omega-3 with DHA and EPA. Sustainable, plant-sourced, one capsule daily.",
};

export default function Page() {
  return <ProductDetailPage slug="omega-3-algal" />;
}
