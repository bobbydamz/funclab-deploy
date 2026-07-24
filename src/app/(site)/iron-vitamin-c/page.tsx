import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Iron + Vitamin C – BioHAK Wellness",
  description: "Iron with 100mg Vitamin C for improved absorption. Addresses iron deficiency effectively.",
};

export default function Page() {
  return <ProductDetailPage slug="iron-vitamin-c" />;
}
