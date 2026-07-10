import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import AdminLoginScreen from "@/components/admin/AdminLoginScreen";
import "./admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The authoritative check: a fresh DB lookup, not just a valid-looking JWT (see
  // lib/auth.ts for why that distinction matters). Renders a login screen in place
  // rather than redirecting elsewhere, so /admin is a self-contained entry point.
  const admin = await requireAdmin();
  if (!admin) return <AdminLoginScreen />;

  return <AdminShell user={admin}>{children}</AdminShell>;
}
