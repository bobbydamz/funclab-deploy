import type { Metadata } from "next";
import CartPageContent from "@/components/cart/CartPageContent";
import "./cart.css";

export const metadata: Metadata = {
  title: "Your Cart – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function CartPage() {
  return <CartPageContent />;
}
