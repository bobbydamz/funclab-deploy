"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function AdminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Invalid email or password.");
      setLoading(false);
      return;
    }
    if (data.role !== "ADMIN") {
      setError("This account doesn't have admin access.");
      setLoading(false);
      return;
    }

    // Same URL, no navigation -- re-runs the server-side requireAdmin() check in
    // admin/layout.tsx, which now swaps this login screen for the real dashboard.
    router.refresh();
  }

  return (
    <div className="admin-root">
      <div className="login-screen">
        <div className="login-box">
          <div className="login-logo">BioHAK Wellness</div>
          <div className="login-title">Admin Dashboard</div>
          <div className="login-sub">Sign in to manage your store</div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@biohakwellness.com"
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 22 }}>
              <label>Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
