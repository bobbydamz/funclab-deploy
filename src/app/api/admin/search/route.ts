import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type SearchResult = {
  type: "product" | "order" | "customer";
  id: string;
  label: string;
  sublabel: string;
  href: string;
};

const LIMIT = 5;

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const [products, orders, customers] = await Promise.all([
    prisma.product.findMany({
      where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] },
      take: LIMIT,
      select: { id: true, name: true, slug: true, price: true },
    }),
    prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { contains: q, mode: "insensitive" } },
          { customerName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: LIMIT,
      select: { id: true, orderNumber: true, customerName: true, total: true },
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: LIMIT,
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
  ]);

  const results: SearchResult[] = [
    ...products.map((p) => ({
      type: "product" as const,
      id: String(p.id),
      label: p.name,
      sublabel: `Rs. ${p.price.toLocaleString("en-IN")} · /${p.slug}`,
      href: `/admin/products/${p.id}/edit`,
    })),
    ...orders.map((o) => ({
      type: "order" as const,
      id: o.id,
      label: o.orderNumber,
      sublabel: `${o.customerName} · Rs. ${o.total.toLocaleString("en-IN")}`,
      href: `/admin/orders/${o.id}`,
    })),
    ...customers.map((c) => ({
      type: "customer" as const,
      id: c.id,
      label: `${c.firstName} ${c.lastName ?? ""}`.trim(),
      sublabel: c.email,
      href: `/admin/customers`,
    })),
  ];

  return NextResponse.json({ results });
}
