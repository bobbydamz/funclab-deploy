import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";

// Reads live product data from Postgres -- see (site)/page.tsx for why this can't be
// statically generated at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moringa + Mushroom Lions Mane – BioHAK Wellness",
  description: "Lion's Mane mushroom and Moringa blend for vitality, cognitive support and longevity.",
};

export default function Page() {
  return <ProductDetailPage slug="moringa-mushroom" />;
}
