import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paystack";

// Defense-in-depth alongside /api/payments/paystack/verify: if a customer closes the tab
// right after paying but before the client-side verify call fires, this webhook still
// marks the order paid asynchronously once Paystack confirms the charge.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    const amount = event.data?.amount;
    if (reference) {
      const order = await prisma.order.findFirst({ where: { paystackReference: reference } });
      if (order && order.paymentStatus !== "PAID" && amount === order.total * 100) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
