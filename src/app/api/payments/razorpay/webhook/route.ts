import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

// Defense-in-depth alongside /api/payments/razorpay/verify: if a customer closes the tab
// right after paying but before the client-side verify call fires, this webhook still
// marks the order paid asynchronously once Razorpay confirms the capture.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id;
    const razorpayPaymentId = payment?.id;
    if (razorpayOrderId) {
      const order = await prisma.order.findFirst({ where: { razorpayOrderId } });
      if (order && order.paymentStatus !== "PAID") {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID", status: "CONFIRMED", razorpayPaymentId },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
