"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;
const PAYMENT_OPTIONS = ["UNPAID", "PAID"] as const;

export default function OrderStatusControls({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: (typeof STATUS_OPTIONS)[number];
  paymentStatus: (typeof PAYMENT_OPTIONS)[number];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function patch(field: "status" | "payment", value: string) {
    setPending(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    setPending(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Order status</label>
        <select value={status} disabled={pending} onChange={(e) => patch("status", e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s[0] + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Payment status</label>
        <select value={paymentStatus} disabled={pending} onChange={(e) => patch("payment", e.target.value)}>
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p[0] + p.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
