export const FREE_SHIPPING_THRESHOLD = 1000;
export const FLAT_SHIPPING_COST = 99;

export type CartItemInput = { price: number; qty: number };
export type CouponInput = { type: "PERCENT" | "FLAT" | "SHIPPING"; value: number } | null;

/**
 * Single source of truth for subtotal/shipping/discount/total math — imported by both the
 * client CartContext (for on-screen display) and the server order-creation route (for the
 * authoritative calculation), so the two can never silently drift apart. The server always
 * recomputes from its own freshly-fetched product prices and coupon record; it never trusts
 * a client-submitted total.
 */
export function computeTotals(items: CartItemInput[], coupon: CouponInput) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  let shipping = items.length && subtotal < FREE_SHIPPING_THRESHOLD ? FLAT_SHIPPING_COST : 0;
  let discount = 0;

  if (coupon) {
    if (coupon.type === "PERCENT") discount = (subtotal * coupon.value) / 100;
    else if (coupon.type === "FLAT") discount = coupon.value;
    else if (coupon.type === "SHIPPING") shipping = 0;
    discount = Math.min(discount, subtotal);
  }

  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, shipping, discount, total, freeShippingRemaining };
}
