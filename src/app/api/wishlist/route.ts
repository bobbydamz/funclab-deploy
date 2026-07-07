import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
  return NextResponse.json(items);
}

const schema = z.object({ productId: z.number().int() });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.userId, productId: parsed.data.productId } },
    update: {},
    create: { userId: session.userId, productId: parsed.data.productId },
    include: { product: true },
  });
  return NextResponse.json(item);
}
