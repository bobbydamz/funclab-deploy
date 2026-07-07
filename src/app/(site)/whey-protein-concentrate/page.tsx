import type { Metadata } from "next";
import WheyConcentratePage from "@/components/collections/WheyConcentratePage";
import "../collection-shared.css";
import "./whey-protein-concentrate.css";

export const metadata: Metadata = {
  title: "Whey Protein – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function Page() {
  return <WheyConcentratePage />;
}
