import type { Metadata } from "next";
import MerchandisePage from "@/components/collections/MerchandisePage";
import "../collection-shared.css";
import "./merchandise.css";

export const metadata: Metadata = {
  title: "Vitamin D-3 + K2 – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function Page() {
  return <MerchandisePage />;
}
