import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already gates /admin/** at the edge, but re-checking here (fresh from the
  // database, not the JWT) is the authoritative check — see lib/auth.ts for why.
  const admin = await requireAdmin();
  if (!admin) redirect("/account");

  return <AdminShell user={admin}>{children}</AdminShell>;
}
