import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard — Admin" };

const STATUS_BADGE: Record<string, string> = {
  PENDING: "badge-gold",
  CONFIRMED: "badge-blue",
  SHIPPED: "badge-orange",
  DELIVERED: "badge-green",
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const [orderCount, revenueAgg, customerCount, activeCouponCount, recentOrders, newCustomers, activeCoupons] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.coupon.count({ where: { active: true } }),
      prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
      prisma.user.findMany({ take: 6, orderBy: { createdAt: "desc" }, where: { role: "CUSTOMER" } }),
      prisma.coupon.findMany({ take: 6, where: { active: true }, orderBy: { createdAt: "desc" } }),
    ]);

  const pendingCount = await prisma.order.count({ where: { status: "PENDING" } });

  const stats = [
    { label: "Total Orders", value: orderCount.toLocaleString("en-IN") },
    { label: "Revenue (Paid)", value: `Rs. ${(revenueAgg._sum.total ?? 0).toLocaleString("en-IN")}` },
    { label: "Customers", value: customerCount.toLocaleString("en-IN") },
    { label: "Active Coupons", value: activeCouponCount.toLocaleString("en-IN") },
  ];

  return (
    <>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.label === "Total Orders" && pendingCount > 0 && (
              <div className="stat-sub">{pendingCount} pending</div>
            )}
          </div>
        ))}
      </div>

      <div className="two-col">
        <div>
          <div className="section-header">
            <span className="section-title">Recent Orders</span>
            <Link href="/admin/orders" className="section-action">
              View all →
            </Link>
          </div>
          <div className="table-wrap">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="mono">{o.orderNumber}</td>
                        <td>{o.customerName}</td>
                        <td className="mono">Rs. {o.total.toLocaleString("en-IN")}</td>
                        <td>
                          <span className={`badge ${STATUS_BADGE[o.status] ?? "badge-muted"}`}>
                            {o.status.toLowerCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="section-header">
            <span className="section-title">New Customers</span>
          </div>
          <div className="table-wrap">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {newCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty">
                        No customers yet.
                      </td>
                    </tr>
                  ) : (
                    newCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          {c.firstName} {c.lastName ?? ""}
                        </td>
                        <td>{c.email}</td>
                        <td>{fmtDate(c.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Active Coupons</span>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {activeCoupons.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty">
                    No active coupons.
                  </td>
                </tr>
              ) : (
                activeCoupons.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.code}</td>
                    <td>{c.type.toLowerCase()}</td>
                    <td>{c.type === "PERCENT" ? `${c.value}%` : `Rs. ${c.value}`}</td>
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
