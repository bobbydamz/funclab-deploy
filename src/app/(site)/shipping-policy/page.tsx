import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <div className="page-hero-blk">
        <span className="hero-label">Orders</span>
        <h1>Shipping Policy</h1>
        <p>Fast, reliable delivery across India.</p>
      </div>
      <div className="policy-wrap">
        <h2>Free Shipping</h2>
        <p>
          We offer <strong>free shipping on all orders over ₹1,000</strong> across India. Orders
          below ₹1,000 will incur a flat shipping fee of ₹99.
        </p>

        <h2>Processing Time</h2>
        <p>
          All orders are processed within <strong>1–2 business days</strong> (Monday to Friday,
          excluding public holidays). Orders placed on weekends or public holidays will be
          processed on the next business day.
        </p>

        <h2>Delivery Timelines</h2>
        <ul>
          <li>
            <strong>Metro cities</strong> (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad):
            2–4 business days
          </li>
          <li>
            <strong>Tier 2 &amp; Tier 3 cities:</strong> 4–7 business days
          </li>
          <li>
            <strong>Remote areas:</strong> 7–10 business days
          </li>
        </ul>

        <h2>Order Tracking</h2>
        <p>
          Once your order is dispatched, you will receive a confirmation email with your tracking
          number and courier details. You can track your shipment directly through the courier&apos;s
          website.
        </p>

        <h2>Damaged or Lost Shipments</h2>
        <p>
          If your order arrives damaged or is lost in transit, please contact us within{" "}
          <strong>48 hours of the expected delivery date</strong> at{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a> with your order
          number and photos of the damaged packaging.
        </p>

        <h2>Address Changes</h2>
        <p>
          Address changes can only be made before the order is dispatched. Please contact us
          immediately at <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a> if
          you need to update your delivery address.
        </p>

        <h2>International Shipping</h2>
        <p>
          We currently ship within India only. International shipping will be available soon —
          sign up for our newsletter to be notified.
        </p>

        <h2>Contact</h2>
        <p>
          For any shipping queries:
          <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a>
          <br />
          <strong>Customer Service Hours:</strong> Monday to Friday, 10am – 6pm
          <br />
          For weekend queries:{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a>
        </p>
      </div>
    </>
  );
}
