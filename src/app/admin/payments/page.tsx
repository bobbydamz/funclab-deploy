import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PaymentsTable from "@/components/admin/PaymentsTable";

export const metadata: Metadata = { title: "Payments — Admin" };

const STATUS_FILTERS = ["", "UNPAID", "PAID"] as const;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = STATUS_FILTERS.includes((status ?? "") as (typeof STATUS_FILTERS)[number]) ? status ?? "" : "";

  const [orders, paidAgg, unpaidAgg, razorpayCount, codCount] = await Promise.all([
    prisma.order.findMany({
      where: filter ? { paymentStatus: filter as "UNPAID" | "PAID" } : undefined,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "UNPAID" } }),
    prisma.order.count({ where: { paymentMethod: "RAZORPAY" } }),
    prisma.order.count({ where: { paymentMethod: "COD" } }),
  ]);

  const stats = [
    { label: "Collected", value: `Rs. ${(paidAgg._sum.total ?? 0).toLocaleString("en-IN")}` },
    { label: "Outstanding", value: `Rs. ${(unpaidAgg._sum.total ?? 0).toLocaleString("en-IN")}` },
    { label: "Razorpay Orders", value: razorpayCount.toLocaleString("en-IN") },
    { label: "COD Orders", value: codCount.toLocaleString("en-IN") },
  ];

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

      <PaymentsTable
        payments={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          total: o.total,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          razorpayPaymentId: o.razorpayPaymentId,
          createdAt: o.createdAt.toISOString(),
        }))}
        activeFilter={filter}
      />
    </>
  );
}
