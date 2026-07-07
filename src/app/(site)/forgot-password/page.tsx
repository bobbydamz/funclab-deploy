import type { Metadata } from "next";
import ForgotPasswordFlow from "@/components/ForgotPasswordFlow";
import "./forgot-password.css";

export const metadata: Metadata = {
  title: "Reset Password – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
