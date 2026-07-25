import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RevenueChart, OrderStatusChart } from "@/components/admin/AnalyticsCharts";

export const metadata: Metadata = { title: "Reports — Admin" };

const REVENUE_CHART_DAYS = 30;
const STATUS_ORDER = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;
const STATUS_LABEL: Record<(typeof STATUS_ORDER)[number], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default async function AdminReportsPage() {
  const chartRangeStart = new Date();
  chartRangeStart.setHours(0, 0, 0, 0);
  chartRangeStart.setDate(chartRangeStart.getDate() - (REVENUE_CHART_DAYS - 1));

  const [orderCount, revenueAgg, customerCount, ordersInRange, statusCounts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      where: { createdAt: { gte: chartRangeStart }, paymentStatus: "PAID" },
      select: { createdAt: true, total: true },
    }),
    Promise.all(STATUS_ORDER.map((status) => prisma.order.count({ where: { status } }))),
  ]);

  const totalRevenue = revenueAgg._sum.total ?? 0;
  const avgOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  const stats = [
    { label: "Total Revenue (Paid)", value: `Rs. ${totalRevenue.toLocaleString("en-IN")}` },
    { label: "Total Orders", value: orderCount.toLocaleString("en-IN") },
    { label: "Average Order Value", value: `Rs. ${avgOrderValue.toLocaleString("en-IN")}` },
    { label: "Customers", value: customerCount.toLocaleString("en-IN") },
  ];

  const revenueByDay = new Map<string, number>();
  for (let i = 0; i < REVENUE_CHART_DAYS; i++) {
    const d = new Date(chartRangeStart);
    d.setDate(d.getDate() + i);
    revenueByDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of ordersInRange) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (revenueByDay.has(key)) revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + o.total);
  }
  const revenueSeries = [...revenueByDay.entries()].map(([key, revenue]) => ({
    label: new Date(key).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    revenue,
  }));

  const statusSeries = STATUS_ORDER.map((status, i) => ({ status: STATUS_LABEL[status], count: statusCounts[i] }));

  return (
    <>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div>
          <div className="section-header">
            <span className="section-title">Revenue — Last {REVENUE_CHART_DAYS} Days</span>
          </div>
          <div className="card">
            <RevenueChart data={revenueSeries} />
          </div>
        </div>
        <div>
          <div className="section-header">
            <span className="section-title">Orders by Status</span>
          </div>
          <div className="card">
            <OrderStatusChart data={statusSeries} />
          </div>
        </div>
      </div>
    </>
  );
}
