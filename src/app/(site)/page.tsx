import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import "./home.css";

export const metadata: Metadata = {
  title: "BioHAK Wellness — Clean Supplements",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function Home() {
  return <HomePage />;
}
