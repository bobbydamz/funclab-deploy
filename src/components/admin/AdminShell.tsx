"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";
import CommandPalette from "./CommandPalette";

const HEALTH_CHECK_INTERVAL_MS = 30_000;
type ApiStatus = "checking" | "connected" | "error";

const ICON = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  box: "M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  bookmark: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  card: "M2 5h20a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM1 10h22M5 16h4",
  ticket: "M4 7a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V7zM9 5v14",
  bars: "M4 20V10M12 20V4M20 20v-7",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  server: "M3 5h18v6H3zM3 13h18v6H3zM7 8h.01M7 16h.01",
  bug: "M9 9l-3-3M15 9l3-3M12 8v13M8 13H4M20 13h-4M9 21c0-3 1.5-4 3-4s3 1 3 4M6 9a6 6 0 0112 0v4a6 6 0 01-12 0z",
};

type NavLeaf = { href: string; text: string; icon: string };
type NavGroup = { text: string; icon: string; children: { href: string; text: string }[] };
type NavEntry = NavLeaf | NavGroup;

const NAV: { label: string; items: NavEntry[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", text: "Dashboard", icon: ICON.dashboard }],
  },
  {
    label: "Store",
    items: [
      {
        text: "Manage Orders",
        icon: ICON.truck,
        children: [
          { href: "/admin/orders", text: "All Orders" },
          { href: "/admin/orders?status=PENDING", text: "Pending" },
          { href: "/admin/orders?status=CONFIRMED", text: "Confirmed" },
          { href: "/admin/orders?status=SHIPPED", text: "Shipped" },
          { href: "/admin/orders?status=DELIVERED", text: "Delivered" },
        ],
      },
      {
        text: "Manage Product",
        icon: ICON.box,
        children: [
          { href: "/admin/products", text: "All Products" },
          { href: "/admin/products/new", text: "Add New" },
        ],
      },
      { href: "/admin/brand", text: "Manage Brand", icon: ICON.bookmark },
      { href: "/admin/category", text: "Manage Category", icon: ICON.list },
      { href: "/admin/coupons", text: "Coupons", icon: ICON.tag },
    ],
  },
  {
    label: "People",
    items: [{ href: "/admin/customers", text: "Manage Users", icon: ICON.users }],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/payments", text: "Payments", icon: ICON.card },
      { href: "/admin/support", text: "Support Ticket", icon: ICON.ticket },
      { href: "/admin/reports", text: "Report", icon: ICON.bars },
      { href: "/admin/settings", text: "System Setting", icon: ICON.settings },
      { href: "/admin/extra", text: "Extra", icon: ICON.server },
      { href: "/admin/report-request", text: "Report & Request", icon: ICON.bug },
    ],
  },
];

// Handles both exact nav matches (Dashboard, Orders, ...) and the dynamic detail/edit/new
// routes underneath them, which have no exact NAV entry of their own. Group children (e.g.
// "Manage Orders" -> All/Pending/Confirmed/...) all resolve back to their parent's text,
// since several of them share a pathname and only differ by query string.
function pageTitle(pathname: string): string {
  const flat = NAV.flatMap((s) =>
    s.items.flatMap((item) =>
      "children" in item
        ? item.children.map((c) => ({ href: c.href.split("?")[0], text: item.text }))
        : [{ href: item.href, text: item.text }]
    )
  );

  if (pathname === "/admin/products/new") return "New Product";
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return "Order Details";

  const exact = flat.find((i) => i.href === pathname);
  if (exact) return exact.text;

  const prefixMatch = flat
    .filter((i) => i.href !== "/admin" && pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return prefixMatch?.text ?? "Dashboard";
}

export default function AdminShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [dark, setDark] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const checkingRef = useRef(false);

  function isChildActive(href: string): boolean {
    const [hrefPath, hrefQuery] = href.split("?");
    if (hrefPath !== pathname) return false;
    if (!hrefQuery) return !searchParams.get("status");
    const hrefParams = new URLSearchParams(hrefQuery);
    for (const [key, val] of hrefParams) {
      if (searchParams.get(key) !== val) return false;
    }
    return true;
  }

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
              {section.items.map((item) => {
                if ("children" in item) {
                  const groupActive = item.children.some((c) => isChildActive(c.href));
                  const open = item.text in openGroups ? openGroups[item.text] : groupActive;
                  return (
                    <div key={item.text}>
                      <button
                        type="button"
                        className={`nav-item nav-item-toggle${groupActive ? " active" : ""}`}
                        onClick={() => setOpenGroups((prev) => ({ ...prev, [item.text]: !open }))}
                      >
                        <svg className="icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path d={item.icon} />
                        </svg>
                        <span className="nav-item-text">{item.text}</span>
                        <svg className={`chevron${open ? " open" : ""}`} width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {open && (
                        <div className="nav-children">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`nav-child${isChildActive(child.href) ? " active" : ""}`}
                            >
                              {child.text}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={item.href} href={item.href} className={`nav-item${pathname === item.href ? " active" : ""}`}>
                    <svg className="icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path d={item.icon} />
                    </svg>
                    {item.text}
                  </Link>
                );
              })}
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
