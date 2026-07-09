"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart-totals";

const STATES = [
  "Andhra Pradesh", "Delhi", "Goa", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

function fmtMoney(n: number) {
  return "Rs. " + Math.round(n).toLocaleString("en-IN");
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CartPageContent() {
  const cart = useCart();
  const { items, count, totals } = cart;

  const [clearConfirming, setClearConfirming] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successOrderNum, setSuccessOrderNum] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  function showToast(msg: string, ok = true) {
    clearTimeout(toastTimer.current);
    setToast({ msg, ok });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  function handleClearCart() {
    if (!clearConfirming) {
      setClearConfirming(true);
      setTimeout(() => setClearConfirming(false), 3000);
      return;
    }
    cart.clear();
    setClearConfirming(false);
    showToast("Cart cleared");
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    setCouponMsg(null);
    if (!code) {
      setCouponMsg({ ok: false, text: "Please enter a coupon code" });
      return;
    }
    const result = await cart.applyCoupon(code);
    if (result.success) {
      showToast(`Coupon ${code} applied!`);
    } else {
      setCouponMsg({ ok: false, text: result.error || "Invalid or expired coupon code" });
    }
  }

  function handleRemoveCoupon() {
    cart.removeCoupon();
    setCouponInput("");
    setCouponMsg(null);
    showToast("Coupon removed");
  }

  async function placeOrder() {
    setCheckoutError("");
    if (!email.trim()) return setCheckoutError("Email address is required");
    if (!line1.trim()) return setCheckoutError("Shipping address is required");
    if (!city.trim()) return setCheckoutError("City is required");
    if (!state) return setCheckoutError("Please select a state");

    setPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })),
          couponCode: totals.coupon?.code,
          paymentMethod,
          customerName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          addressLine1: line1.trim(),
          addressLine2: line2.trim() || undefined,
          city: city.trim(),
          state,
          pincode: pincode.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || "Something went wrong placing your order.");
        setPlacingOrder(false);
        return;
      }

      if (paymentMethod === "cod") {
        finishOrder(data.order.orderNumber);
        return;
      }

      // Razorpay path: open the Checkout.js widget; only mark the order paid once
      // /api/payments/razorpay/verify confirms the signature server-side.
      const rzp = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        order_id: data.razorpay.orderId,
        name: "BioHAK Wellness",
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            finishOrder(data.order.orderNumber);
          } else {
            setCheckoutError("Payment verification failed. Please contact support with your order number: " + data.order.orderNumber);
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
      });
      rzp.open();
    } catch {
      setCheckoutError("Something went wrong placing your order.");
      setPlacingOrder(false);
    }
  }

  function finishOrder(orderNumber: string) {
    cart.clear();
    setCheckoutOpen(false);
    setSuccessOrderNum(orderNumber);
    setSuccessOpen(true);
    setPlacingOrder(false);
  }

  const shippingPct = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="page-wrap">
        <div className="page-heading">Your Cart</div>
        <div className="page-subhead">
          {count === 0 ? "You have no items in your cart." : `You have ${count} item${count !== 1 ? "s" : ""} in your cart.`}
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>
              Looks like you haven&apos;t added anything yet.
              <br />
              Let&apos;s fix that.
            </p>
            <Link href="/all-products" className="shop-btn">
              Shop All Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              <div className="cart-items-box">
                <div className="shipping-bar">
                  {totals.shipping === 0 ? (
                    <strong>✓ You&apos;ve got free shipping!</strong>
                  ) : (
                    <>
                      Add <strong>{fmtMoney(Math.ceil(totals.freeShippingRemaining))}</strong> more for free shipping
                    </>
                  )}
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${shippingPct}%` }} />
                  </div>
                </div>
                <div className="cart-items-head">
                  <h2>Items ({count})</h2>
                  <button className={`clear-btn${clearConfirming ? " confirming" : ""}`} onClick={handleClearCart}>
                    {clearConfirming ? "Click again to confirm" : "Clear cart"}
                  </button>
                </div>
                <div>
                  {items.map((item) => (
                    <div className="cart-item" key={item.lineId}>
                      <div className="item-img-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price-row">
                          <span className="item-price">{fmtMoney(item.price)}</span>
                        </div>
                      </div>
                      <div className="item-controls">
                        <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700 }}>
                          {fmtMoney(item.price * item.qty)}
                        </div>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => cart.update(item.lineId, item.qty - 1)}>
                            −
                          </button>
                          <div className="qty-display">{item.qty}</div>
                          <button className="qty-btn" onClick={() => cart.update(item.lineId, item.qty + 1)}>
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => {
                            cart.remove(item.lineId);
                            showToast("Item removed");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <Link
                  href="/all-products"
                  style={{ fontSize: 13, color: "#888", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M19 12H5" />
                    <path d="m12 5-7 7 7 7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div>
              <div className="summary-box">
                <div className="summary-head">
                  <h2>Order Summary</h2>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{fmtMoney(totals.subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span style={totals.shipping === 0 ? { color: "#2d7a4f", fontWeight: 600 } : undefined}>
                      {totals.shipping === 0 ? "Free" : fmtMoney(totals.shipping)}
                    </span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>− {fmtMoney(totals.discount)}</span>
                    </div>
                  )}
                  <div className="summary-row bold">
                    <span>Total</span>
                    <span>{fmtMoney(totals.total)}</span>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    {!totals.coupon ? (
                      <>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", marginBottom: 8 }}>
                          Coupon Code
                        </div>
                        <div className="coupon-row">
                          <input
                            className="coupon-input"
                            placeholder="Enter code (e.g. WELCOME10)"
                            maxLength={20}
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                          />
                          <button className="coupon-btn" onClick={handleApplyCoupon}>
                            Apply
                          </button>
                        </div>
                        {couponMsg && (
                          <div className={`coupon-msg ${couponMsg.ok ? "coupon-ok" : "coupon-err"}`}>{couponMsg.text}</div>
                        )}
                      </>
                    ) : (
                      <div className="coupon-applied">
                        <span>
                          ✓ <strong>{totals.coupon.code}</strong> applied
                        </span>
                        <button className="coupon-remove" onClick={handleRemoveCoupon} title="Remove coupon">
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="checkout-btn" onClick={() => setCheckoutOpen(true)}>
                    Proceed to Checkout
                  </button>
                  <div className="secure-note">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Secure checkout
                  </div>

                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                    {["UPI", "Razorpay", "Credit Card", "Debit Card", "Net Banking"].map((tag) => (
                      <span
                        key={tag}
                        style={{ fontSize: 10, background: "#f7f4f0", border: "1px solid #e8e4de", padding: "4px 10px", color: "#888", borderRadius: 2 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      <div
        className={`checkout-overlay${checkoutOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setCheckoutOpen(false);
        }}
      >
        <div className="checkout-modal">
          <div className="modal-head">
            <h2>Checkout</h2>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            {checkoutError && <div className="form-error">{checkoutError}</div>}

            <div className="order-summary-mini">
              <div className="row">
                <span>Subtotal ({count} items)</span>
                <span>{fmtMoney(totals.subtotal)}</span>
              </div>
              <div className="row">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? "Free" : fmtMoney(totals.shipping)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="row" style={{ color: "#2d7a4f" }}>
                  <span>Discount{totals.coupon ? ` (${totals.coupon.code})` : ""}</span>
                  <span>− {fmtMoney(totals.discount)}</span>
                </div>
              )}
              <div className="row total">
                <span>Total</span>
                <span>{fmtMoney(totals.total)}</span>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Contact Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Shipping Address</div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Flat / House no., Building, Street" />
              </div>
              <div className="form-group">
                <label>Address Line 2 (optional)</label>
                <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Area, Landmark" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="400001" maxLength={6} />
                </div>
              </div>
              <div className="form-group">
                <label>State</label>
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Payment Method</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    border: paymentMethod === "razorpay" ? "1.5px solid #1a1a1a" : "1.5px solid #e8e4de",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    style={{ width: "auto" }}
                  />
                  Razorpay (UPI / Card / Net Banking)
                </label>
                <label
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    border: paymentMethod === "cod" ? "1.5px solid #1a1a1a" : "1.5px solid #e8e4de",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    style={{ width: "auto" }}
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Order Notes (optional)</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." />
            </div>

            <button className="place-order-btn" onClick={placeOrder} disabled={placingOrder}>
              {placingOrder ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <div className={`success-overlay${successOpen ? " open" : ""}`}>
        <div className="success-modal">
          <div className="success-icon">🎉</div>
          <h2>Order Placed!</h2>
          <p>Thank you for your order. We&apos;ll confirm it shortly.</p>
          <div className="success-order-num">{successOrderNum}</div>
          <p style={{ fontSize: 12, color: "#aaa" }}>Save this order number to track your order</p>
          <div className="success-btns">
            <Link href="/all-products" className="success-btn btn-light" style={{ display: "inline-block" }}>
              Continue Shopping
            </Link>
            <Link href="/account" className="success-btn btn-dark" style={{ display: "inline-block" }}>
              My Orders
            </Link>
          </div>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`}>
        <div className="toast-dot" style={{ background: toast?.ok === false ? "#e05c5c" : "#4caf7d" }} />
        <span>{toast?.msg}</span>
      </div>
    </>
  );
}
