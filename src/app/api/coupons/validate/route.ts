import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ code: z.string().trim().min(1) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const code = parsed.data.code.toUpperCase();
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
    return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
  }

  return NextResponse.json({ code: coupon.code, type: coupon.type, value: coupon.value });
}
