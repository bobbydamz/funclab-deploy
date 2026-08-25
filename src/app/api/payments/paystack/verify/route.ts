import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

const schema = z.object({ reference: z.string().trim().min(1) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { reference } = parsed.data;

  const order = await prisma.order.findFirst({ where: { paystackReference: reference } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const transaction = await verifyTransaction(reference);

  // The client controls the amount passed to the Inline popup, so re-check what Paystack
  // actually confirmed against the order's real total before trusting the payment.
  if (transaction.status !== "success" || transaction.amount !== order.total * 100 || transaction.currency !== "NGN") {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "PAID", status: "CONFIRMED" },
  });

  return NextResponse.json({ order: updated });
}
