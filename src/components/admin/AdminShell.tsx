"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";

const NAV = [
  {
    label: "Overview",
    items: [{ href: "/admin", text: "Dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" }],
  },
  {
    label: "Store",
    items: [
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

export default function AdminShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/account");
    router.refresh();
  }

  const title = NAV.flatMap((s) => s.items).find((i) => i.href === pathname)?.text ?? "Dashboard";
  const initial = user.firstName?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="admin-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="brand">BioHAK Wellness</div>
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
            <div className="status-dot" />
            <span className="status-label">API connected</span>
            <button className="refresh-btn" onClick={() => router.refresh()}>
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
