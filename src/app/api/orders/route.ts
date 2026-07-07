import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { computeTotals, type CouponInput } from "@/lib/cart-totals";
import { getRazorpayClient } from "@/lib/razorpay";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int(),
        variantId: z.string().nullable().optional(),
        qty: z.number().int().min(1).max(10),
      })
    )
    .min(1),
  couponCode: z.string().trim().optional(),
  paymentMethod: z.enum(["razorpay", "cod"]),
  customerName: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(1),
  addressLine1: z.string().trim().min(1),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  pincode: z.string().trim().min(1),
  notes: z.string().trim().optional(),
});

function generateOrderNumber() {
  return "FL-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Never trust client-submitted prices/totals: look up every product fresh from the
  // database and recompute subtotal/shipping/discount/total server-side.
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const missing = data.items.find((i) => !productMap.has(i.productId));
  if (missing) {
    return NextResponse.json({ error: `Product ${missing.productId} is not available.` }, { status: 400 });
  }

  const lineItems = data.items.map((i) => {
    const product = productMap.get(i.productId)!;
    return { product, variantId: i.variantId ?? null, qty: i.qty };
  });

  let coupon: CouponInput = null;
  let couponCode: string | null = null;
  if (data.couponCode) {
    const found = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
    if (found && found.active && !(found.expiresAt && found.expiresAt < new Date())) {
      coupon = { type: found.type, value: found.value };
      couponCode = found.code;
    }
  }

  const totals = computeTotals(
    lineItems.map((li) => ({ price: li.product.price, qty: li.qty })),
    coupon
  );

  const session = await getSession();
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.userId ?? null,
      guestEmail: session ? null : data.email,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      discount: totals.discount,
      total: totals.total,
      couponCode,
      status: "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod: data.paymentMethod === "cod" ? "COD" : "RAZORPAY",
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      notes: data.notes,
      items: {
        create: lineItems.map((li) => ({
          productId: li.product.id,
          variantId: li.variantId,
          name: li.product.name,
          price: li.product.price,
          qty: li.qty,
        })),
      },
    },
    include: { items: true },
  });

  if (data.paymentMethod === "cod") {
    return NextResponse.json({ order });
  }

  // Razorpay path: create the counterpart order on Razorpay's side and hand the client
  // just enough to open the Checkout.js widget. The order stays UNPAID until the
  // signature-verification step actually confirms payment.
  const razorpay = getRazorpayClient();
  const rzpOrder = await razorpay.orders.create({
    amount: totals.total * 100, // paise
    currency: "INR",
    receipt: orderNumber,
  });

  await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: rzpOrder.id } });

  return NextResponse.json({
    order,
    razorpay: {
      orderId: rzpOrder.id,
      amount: totals.total * 100,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    },
  });
}
