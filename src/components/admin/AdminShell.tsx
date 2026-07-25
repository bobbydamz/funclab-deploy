"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";
import CommandPalette from "./CommandPalette";

const HEALTH_CHECK_INTERVAL_MS = 30_000;
type ApiStatus = "checking" | "connected" | "error";

const NAV = [
  {
    label: "Overview",
    items: [{ href: "/admin", text: "Dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" }],
  },
  {
    label: "Store",
    items: [
      {
        href: "/admin/products",
        text: "Products",
        icon: "M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      },
      { href: "/admin/orders", text: "Orders", icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" },
      { href: "/admin/coupons", text: "Coupons", icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" },
    ],
  },
  {
    label: "People",
    items: [
      {
        href: "/admin/customers",
        text: "Customers",
        icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
      },
    ],
  },
];

// Handles both exact nav matches (Dashboard, Orders, ...) and the dynamic detail/edit/new
// routes underneath them, which have no exact NAV entry of their own.
function pageTitle(pathname: string): string {
  const items = NAV.flatMap((s) => s.items);
  const exact = items.find((i) => i.href === pathname);
  if (exact) return exact.text;

  if (pathname === "/admin/products/new") return "New Product";
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return "Order Details";

  const prefixMatch = items
    .filter((i) => i.href !== "/admin" && pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return prefixMatch?.text ?? "Dashboard";
}

export default function AdminShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [dark, setDark] = useState(false);
  const checkingRef = useRef(false);

  useEffect(() => {
    // Mirrors the DOM attribute the blocking inline script (admin/layout.tsx) already set
    // before first paint into React state, so the toggle's icon matches reality. This is a
    // one-time read of external state on mount (not a derived value), which is the standard
    // exception to this rule -- see e.g. next-themes for the same pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("admin-theme", "light");
    }
  }

  const checkHealth = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setApiStatus("checking");
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" });
      setApiStatus(res.ok ? "connected" : "error");
    } catch {
      setApiStatus("error");
    } finally {
      checkingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount-then-poll idiom: checkHealth only calls setApiStatus after
    // an await, so nothing runs synchronously here -- the linter can't see past that
    // boundary and flags it as if it were a direct setState call in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkHealth();
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkHealth]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/account");
    router.refresh();
  }

  async function handleRefresh() {
    router.refresh();
    checkHealth();
  }

  const statusLabel =
    apiStatus === "connected" ? "API connected" : apiStatus === "error" ? "API disconnected" : "Checking API…";

  const title = pageTitle(pathname);
  const initial = user.firstName?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="admin-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="BioHAK Wellness" className="brand" />
          <div className="sub">Admin Panel</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-label">{section.label}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${pathname === item.href ? " active" : ""}`}
                >
                  <svg className="icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                  {item.text}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-chip">
            <div className="admin-avatar">{initial}</div>
            <div className="admin-info">
              <div className="name">
                {user.firstName} {user.lastName ?? ""}
              </div>
              <div className="role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="page-title">{title}</div>
          <div className="topbar-right">
            <CommandPalette />
            <button className="theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
              {dark ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
            <div className={`status-dot${apiStatus !== "connected" ? ` ${apiStatus}` : ""}`} />
            <span className="status-label">{statusLabel}</span>
            <button className="refresh-btn" onClick={handleRefresh}>
              ↻ Refresh
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
