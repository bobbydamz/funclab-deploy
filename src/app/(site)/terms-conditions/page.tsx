import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <div className="page-hero-blk">
        <span className="hero-label">Legal</span>
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated: January 2026</p>
      </div>
      <div className="policy-wrap">
        <p>
          Please read these Terms and Conditions carefully before using the BioHAK Wellness
          website. By accessing or placing an order, you agree to be bound by these terms.
        </p>

        <h2>1. General</h2>
        <p>
          These terms govern your use of our website and purchase of our products. BioHAK
          Wellness reserves the right to update these terms at any time. Continued use of the
          site constitutes acceptance of the updated terms.
        </p>

        <h2>2. Products</h2>
        <ul>
          <li>
            All products are dietary supplements and are not intended to diagnose, treat, cure, or
            prevent any disease.
          </li>
          <li>Results may vary between individuals.</li>
          <li>Product images are for illustrative purposes; packaging may vary slightly.</li>
          <li>We reserve the right to discontinue any product at any time.</li>
        </ul>

        <h2>3. Ordering &amp; Payment</h2>
        <ul>
          <li>All prices are listed in Indian Rupees (INR) and include applicable taxes.</li>
          <li>Payment is processed securely through Razorpay.</li>
          <li>We accept Visa, Mastercard, UPI, Net Banking, and Razorpay.</li>
          <li>Orders are confirmed only upon successful payment.</li>
          <li>We reserve the right to cancel orders due to stock unavailability or payment issues.</li>
        </ul>

        <h2>4. Shipping</h2>
        <p>
          Please refer to our <a href="/shipping-policy">Shipping Policy</a> for full details on
          delivery timelines and charges.
        </p>

        <h2>5. Returns &amp; Refunds</h2>
        <p>
          Please refer to our <a href="/refunds-cancellation">Refunds &amp; Cancellation Policy</a>{" "}
          for full details.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on this website — including logos, images, text, and product names — is the
          property of BioHAK Wellness and may not be reproduced without written permission.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          BioHAK Wellness shall not be liable for any indirect, incidental, or consequential
          damages arising from the use of our products or website. Our total liability shall not
          exceed the amount paid for the product in question.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of the courts of Mumbai, Maharashtra.
        </p>

        <h2>9. Contact</h2>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a>
        </p>
      </div>
    </>
  );
}
