import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";

export const metadata: Metadata = { title: "Orders — Admin" };

const STATUS_FILTERS = ["", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = STATUS_FILTERS.includes((status ?? "") as (typeof STATUS_FILTERS)[number]) ? status ?? "" : "";

  const orders = await prisma.order.findMany({
    where: filter ? { status: filter as "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <OrdersTable
      orders={orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        itemCount: o._count.items,
        total: o.total,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      }))}
      activeFilter={filter}
    />
  );
}
