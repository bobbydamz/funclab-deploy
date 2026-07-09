"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = { id: string; name: string; qty: number };
type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">My Orders</div>
        <div className="panel-sub">Track and review your purchases</div>
      </div>
      <div className="account-panel-body">
        {orders === null ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div
              style={{
                width: 28, height: 28, border: "2px solid #e8e4de", borderTopColor: "#1a1a1a",
                borderRadius: "50%", margin: "0 auto", animation: "spin .7s linear infinite",
              }}
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h3>No orders yet</h3>
            <p>When you place an order, it will appear here.</p>
            <Link href="/all-products" className="empty-cta">
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((o) => {
            const itemCount = o.items.reduce((s, i) => s + i.qty, 0);
            return (
              <div className="order-card" key={o.id}>
                <div className="order-head">
                  <div>
                    <div className="order-num">{o.orderNumber}</div>
                    <div className="order-date">
                      {fmtDate(o.createdAt)} · {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span className={`status-pill status-${o.status}`}>{o.status.toLowerCase()}</span>
                    <div className="order-total">Rs. {Number(o.total).toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
