"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrdersPanel from "./OrdersPanel";
import WishlistPanel from "./WishlistPanel";
import ProfilePanel from "./ProfilePanel";
import PasswordPanel from "./PasswordPanel";

type Tab = "orders" | "wishlist" | "profile" | "password";

type User = { firstName: string; lastName: string | null; email: string; phone: string | null };

export default function AccountDashboard({ user }: { user: User }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [displayName, setDisplayName] = useState(`${user.firstName} ${user.lastName ?? ""}`.trim());

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="account-layout">
      <div className="account-sidebar">
        <div className="account-avatar">
          <div className="acc-avatar-circle">{displayName[0]?.toUpperCase() ?? "?"}</div>
          <div className="acc-name">{displayName}</div>
          <div className="acc-email">{user.email}</div>
        </div>
        <div className="account-nav">
          <button className={`acc-nav-item${tab === "orders" ? " active" : ""}`} onClick={() => setTab("orders")}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            My Orders
          </button>
          <button className={`acc-nav-item${tab === "wishlist" ? " active" : ""}`} onClick={() => setTab("wishlist")}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Wishlist
          </button>
          <button className={`acc-nav-item${tab === "profile" ? " active" : ""}`} onClick={() => setTab("profile")}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
          <button className={`acc-nav-item${tab === "password" ? " active" : ""}`} onClick={() => setTab("password")}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Change Password
          </button>
          <button className="acc-nav-item acc-logout" onClick={signOut}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      <div>
        {tab === "orders" && <OrdersPanel />}
        {tab === "wishlist" && <WishlistPanel />}
        {tab === "profile" && <ProfilePanel user={user} onSaved={setDisplayName} />}
        {tab === "password" && <PasswordPanel />}
      </div>
    </div>
  );
}
