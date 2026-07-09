import type { Metadata } from "next";
import TravelPacksPage from "@/components/collections/TravelPacksPage";
import "../collection-shared.css";
import "./on-the-go-travel-packs.css";

export const metadata: Metadata = {
  title: "On The Go Travel Pack – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function Page() {
  return <TravelPacksPage />;
}
