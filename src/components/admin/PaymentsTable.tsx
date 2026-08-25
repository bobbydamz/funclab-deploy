"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Payment = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  paymentMethod: "RAZORPAY" | "PAYSTACK" | "COD";
  paymentStatus: "UNPAID" | "PAID";
  razorpayPaymentId: string | null;
  createdAt: string;
};

const PAYMENT_OPTIONS = ["UNPAID", "PAID"] as const;

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PaymentsTable({
  payments,
  activeFilter,
}: {
  payments: Payment[];
  activeFilter: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [rows, setRows] = useState(payments);

  async function patch(id: string, value: string) {
    setPending(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: "payment", value }),
    });
    if (res.ok) {
      setRows((prev) => prev.map((p) => (p.id === id ? { ...p, paymentStatus: value as Payment["paymentStatus"] } : p)));
    }
    setPending(null);
  }

  function onFilterChange(value: string) {
    router.push(value ? `/admin/payments?status=${value}` : "/admin/payments");
  }

  return (
    <>
      <div className="section-header">
        <span className="section-title">Payments</span>
        <select value={activeFilter} onChange={(e) => onFilterChange(e.target.value)} style={{ fontSize: 12, padding: "5px 10px" }}>
          <option value="">All Payments</option>
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p[0] + p.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Razorpay Payment ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No payments found.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">
                      <Link href={`/admin/orders/${p.id}`} style={{ color: "var(--accent-dark)" }}>
                        {p.orderNumber}
                      </Link>
                    </td>
                    <td>{p.customerName}</td>
                    <td className="mono">Rs. {p.total.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`badge ${p.paymentMethod === "COD" ? "badge-muted" : "badge-blue"}`}>
                        {p.paymentMethod === "COD" ? "COD" : p.paymentMethod === "PAYSTACK" ? "Paystack" : "Razorpay"}
                      </span>
                    </td>
                    <td>
                      <select
                        value={p.paymentStatus}
                        disabled={pending === p.id}
                        onChange={(e) => patch(p.id, e.target.value)}
                        style={{ fontSize: 12, padding: "4px 8px" }}
                      >
                        {PAYMENT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt[0] + opt.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                      {p.razorpayPaymentId ?? "—"}
                    </td>
                    <td>{fmtDate(p.createdAt)}</td>
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
