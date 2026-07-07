"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  itemCount: number;
  total: number;
  paymentMethod: "RAZORPAY" | "COD";
  paymentStatus: "UNPAID" | "PAID";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED";
  createdAt: string;
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;
const PAYMENT_OPTIONS = ["UNPAID", "PAID"] as const;

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersTable({ orders, activeFilter }: { orders: Order[]; activeFilter: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [rows, setRows] = useState(orders);

  async function patch(id: string, field: "status" | "payment", value: string) {
    setPending(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    if (res.ok) {
      setRows((prev) =>
        prev.map((o) =>
          o.id === id
            ? field === "status"
              ? { ...o, status: value as Order["status"] }
              : { ...o, paymentStatus: value as Order["paymentStatus"] }
            : o
        )
      );
    }
    setPending(null);
  }

  function onFilterChange(value: string) {
    router.push(value ? `/admin/orders?status=${value}` : "/admin/orders");
  }

  return (
    <>
      <div className="section-header">
        <span className="section-title">All Orders</span>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{ fontSize: 12, padding: "5px 10px" }}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s[0] + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No orders found.
                  </td>
                </tr>
              ) : (
                rows.map((o) => (
                  <tr key={o.id}>
                    <td className="mono">{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td>{o.itemCount}</td>
                    <td className="mono">Rs. {o.total.toLocaleString("en-IN")}</td>
                    <td>
                      <select
                        value={o.paymentStatus}
                        disabled={pending === o.id}
                        onChange={(e) => patch(o.id, "payment", e.target.value)}
                        style={{ fontSize: 12, padding: "4px 8px" }}
                      >
                        {PAYMENT_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p[0] + p.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6 }}>
                        {o.paymentMethod === "COD" ? "COD" : "Razorpay"}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        disabled={pending === o.id}
                        onChange={(e) => patch(o.id, "status", e.target.value)}
                        style={{ fontSize: 12, padding: "4px 8px" }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s[0] + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{fmtDate(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
