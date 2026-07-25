import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderStatusControls from "@/components/admin/OrderStatusControls";

export const metadata: Metadata = { title: "Order Details — Admin" };

const STATUS_BADGE: Record<string, string> = {
  PENDING: "badge-gold",
  CONFIRMED: "badge-blue",
  SHIPPED: "badge-orange",
  DELIVERED: "badge-green",
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { email: true, createdAt: true } } },
  });
  if (!order) notFound();

  return (
    <>
      <div className="section-header">
        <div>
          <Link href="/admin/orders" className="section-action" style={{ marginBottom: 6, display: "inline-block" }}>
            ← All Orders
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="mono" style={{ fontSize: 18, fontWeight: 700 }}>
              {order.orderNumber}
            </span>
            <span className={`badge ${STATUS_BADGE[order.status] ?? "badge-muted"}`}>{order.status.toLowerCase()}</span>
            <span className={`badge ${order.paymentStatus === "PAID" ? "badge-green" : "badge-red"}`}>
              {order.paymentStatus.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="section-header">
            <span className="section-title">Items</span>
          </div>
          <div className="table-wrap">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td className="mono">Rs. {item.price.toLocaleString("en-IN")}</td>
                      <td className="mono">Rs. {(item.price * item.qty).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span className="mono">Rs. {order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Shipping</span>
                <span className="mono">Rs. {order.shipping.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>
                    Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>
                  <span className="mono">− Rs. {order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  borderTop: "1px solid var(--border)",
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span className="mono">Rs. {order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="section-header">
            <span className="section-title">Update Order</span>
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <OrderStatusControls orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
          </div>

          <div className="section-header">
            <span className="section-title">Customer</span>
          </div>
          <div className="card" style={{ marginBottom: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontWeight: 600 }}>{order.customerName}</div>
            <div style={{ color: "var(--muted)" }}>{order.email}</div>
            <div style={{ color: "var(--muted)" }}>{order.phone}</div>
            {order.user ? (
              <span className="badge badge-blue" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                Registered customer
              </span>
            ) : (
              <span className="badge badge-muted" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                Guest checkout
              </span>
            )}
          </div>

          <div className="section-header">
            <span className="section-title">Shipping Address</span>
          </div>
          <div className="card" style={{ marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
            <div>{order.addressLine1}</div>
            {order.addressLine2 && <div>{order.addressLine2}</div>}
            <div>
              {order.city}, {order.state} {order.pincode}
            </div>
          </div>

          <div className="section-header">
            <span className="section-title">Payment</span>
          </div>
          <div className="card" style={{ marginBottom: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <span style={{ color: "var(--muted)" }}>Method: </span>
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"}
            </div>
            {order.razorpayOrderId && (
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                Order: {order.razorpayOrderId}
              </div>
            )}
            {order.razorpayPaymentId && (
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                Payment: {order.razorpayPaymentId}
              </div>
            )}
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Placed {fmtDate(order.createdAt)}</div>
          </div>

          {order.notes && (
            <>
              <div className="section-header">
                <span className="section-title">Notes</span>
              </div>
              <div className="card" style={{ fontSize: 13 }}>
                {order.notes}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
