import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import HomePage from "@/components/HomePage";
import "./home.css";

// Reads live product data from Postgres -- must not be statically generated at build
// time, since that makes every deploy depend on the DB being reachable from Vercel's
// build machine at that exact moment (bit us once already with a Neon free-tier cold
// start, which failed the entire production build).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BioHAK Wellness — Clean Supplements",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default async function Home() {
  const products = await getAllProducts();
  return <HomePage products={products} />;
}
