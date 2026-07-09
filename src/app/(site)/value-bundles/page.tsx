import type { Metadata } from "next";
import ValueBundlesPage from "@/components/collections/ValueBundlesPage";
import "../collection-shared.css";
import "./value-bundles.css";

export const metadata: Metadata = {
  title: "Multivitamins – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function Page() {
  return <ValueBundlesPage />;
}
