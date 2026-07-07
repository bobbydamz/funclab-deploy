import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import AuthScreen from "@/components/AuthScreen";
import AccountDashboard from "@/components/account/AccountDashboard";
import "./account.css";

export const metadata: Metadata = {
  title: "My Account – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  return <div className="page-wrap">{!user ? <AuthScreen /> : <AccountDashboard user={user} />}</div>;
}
