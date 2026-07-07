import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.union([
  z.object({ field: z.literal("status"), value: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"]) }),
  z.object({ field: z.literal("payment"), value: z.enum(["UNPAID", "PAID"]) }),
]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // proxy.ts already gates /api/admin/** at the edge, but re-checking here (fresh from the
  // database, not the JWT) is the authoritative check — see lib/auth.ts for why.
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const data = parsed.data.field === "status" ? { status: parsed.data.value } : { paymentStatus: parsed.data.value };
  const order = await prisma.order.update({ where: { id }, data });
  return NextResponse.json(order);
}
