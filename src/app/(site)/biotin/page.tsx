import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Biotin – BioHAK Wellness",
  description: "High-potency 5000mcg biotin for hair growth, strong nails and radiant skin.",
};

export default function Page() {
  return <ProductDetailPage slug="biotin" />;
}
