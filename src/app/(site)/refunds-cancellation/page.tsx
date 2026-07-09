import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds & Cancellation — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function RefundsCancellationPage() {
  return (
    <>
      <div className="page-hero-blk">
        <span className="hero-label">Orders</span>
        <h1>Refunds &amp; Cancellation</h1>
        <p>Simple, fair, and hassle-free.</p>
      </div>
      <div className="policy-wrap">
        <h2>Cancellations</h2>
        <p>
          Orders can be cancelled within <strong>24 hours of placing the order</strong>, provided
          they have not yet been dispatched. To cancel, contact us immediately at{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a> with your order
          number.
        </p>
        <p>
          Once an order has been dispatched, it cannot be cancelled. You may initiate a return
          once the order is delivered.
        </p>

        <h2>Returns</h2>
        <p>
          We accept returns within <strong>7 days of delivery</strong> under the following
          conditions:
        </p>
        <ul>
          <li>The product is unused and in its original, sealed packaging</li>
          <li>The product was received damaged or defective</li>
          <li>An incorrect product was delivered</li>
        </ul>
        <p>We do not accept returns for:</p>
        <ul>
          <li>Opened or used products</li>
          <li>Products returned after 7 days of delivery</li>
          <li>Products without original packaging</li>
          <li>Change of mind purchases</li>
        </ul>

        <h2>Refunds</h2>
        <p>
          Once we receive and inspect the returned product, we will notify you of the approval or
          rejection of your refund. Approved refunds will be processed within{" "}
          <strong>5–7 business days</strong> to your original payment method.
        </p>
        <ul>
          <li>
            <strong>Credit/Debit Card &amp; Net Banking:</strong> 5–7 business days
          </li>
          <li>
            <strong>UPI:</strong> 1–3 business days
          </li>
          <li>
            <strong>Store Credit:</strong> Immediately upon approval
          </li>
        </ul>

        <h2>Damaged or Defective Products</h2>
        <p>
          If you receive a damaged or defective product, please email us at{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a> within{" "}
          <strong>48 hours of delivery</strong> with:
        </p>
        <ul>
          <li>Your order number</li>
          <li>Clear photos of the damaged product and packaging</li>
          <li>A brief description of the issue</li>
        </ul>
        <p>We will arrange a replacement or full refund at no additional cost.</p>

        <h2>Return Shipping</h2>
        <p>
          For approved returns due to our error (wrong or damaged product), return shipping costs
          will be covered by BioHAK Wellness. For other approved returns, the customer is
          responsible for return shipping costs.
        </p>

        <h2>Contact</h2>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a>
          <br />
          <strong>Customer Service Hours:</strong> Monday to Friday, 10am – 6pm
        </p>
      </div>
    </>
  );
}
