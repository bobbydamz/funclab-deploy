import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vitamin D-3 + K2 – BioHAK Wellness",
  description: "2000 IU Vitamin D3 with 100mcg K2 MK-7 for bone health, heart health and immunity.",
};

export default function Page() {
  return <ProductDetailPage slug="vitamin-d3-k2" />;
}
