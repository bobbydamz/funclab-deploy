import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

const SECTIONS = [
  {
    heading: "Products",
    items: [
      {
        q: "Are BioHAK Wellness products safe?",
        a: "Yes. All BioHAK Wellness products are third-party lab tested for purity, heavy metals, and accurate labelling. We use only clean, purposeful ingredients with no artificial additives or unnecessary fillers.",
      },
      {
        q: "Are your products vegetarian/vegan?",
        a: "Our Plant Protein and Algal Omega-3 are fully vegan. Our Whey Protein is vegetarian. All other products are vegetarian-friendly. Each product page lists dietary suitability clearly.",
      },
      {
        q: "Do your products contain artificial sweeteners?",
        a: "No. We use only natural sweeteners — Stevia and Monk Fruit — in products that require sweetening. No aspartame, sucralose, or acesulfame potassium.",
      },
      {
        q: "Are your products suitable for women?",
        a: "Absolutely. All BioHAK Wellness products are formulated for both men and women. Our Whey Protein, Plant Protein, and Multivitamins are especially popular with women looking for clean, effective supplementation.",
      },
      {
        q: "Can I take multiple BioHAK Wellness products together?",
        a: "Yes, our products are designed to complement each other. However, if you have any specific health conditions or are on medication, we recommend consulting your healthcare provider before combining supplements.",
      },
    ],
  },
  {
    heading: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Metro cities: 2–4 business days. Tier 2/3 cities: 4–7 business days. Remote areas: 7–10 business days. All orders are processed within 1–2 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free shipping on all orders over ₹1,000. A flat ₹99 shipping fee applies to orders below ₹1,000.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once your order is dispatched, you'll receive an email with your tracking number and courier details.",
      },
      {
        q: "Can I change or cancel my order?",
        a: (
          <>
            Orders can be cancelled within 24 hours of placing, provided they haven&apos;t been
            dispatched. Email us at{" "}
            <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a> immediately
            with your order number.
          </>
        ),
      },
    ],
  },
  {
    heading: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: (
          <>
            We accept returns within 7 days of delivery for unused, sealed products. Please see
            our <a href="/refunds-cancellation">Refunds &amp; Cancellation</a> page for full
            details.
          </>
        ),
      },
      {
        q: "How long do refunds take?",
        a: "Approved refunds are processed within 5–7 business days to your original payment method (1–3 days for UPI).",
      },
      {
        q: "I received a damaged product — what do I do?",
        a: (
          <>
            Please email us at{" "}
            <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a> within 48 hours
            of delivery with your order number and photos of the damage. We&apos;ll arrange a
            replacement or full refund.
          </>
        ),
      },
    ],
  },
  {
    heading: "Account & Payments",
    items: [
      {
        q: "Do I need an account to order?",
        a: "No. You can check out as a guest. However, creating an account lets you track orders, save your address, and access your order history.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, UPI, Net Banking, and payments via Razorpay. All transactions are secured with 256-bit SSL encryption.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. We do not store any card or payment details. All payments are processed securely by Razorpay, a PCI-DSS compliant payment gateway.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      <div className="page-hero-blk">
        <span className="hero-label">Help</span>
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about BioHAK Wellness.</p>
      </div>
      <FaqAccordion sections={SECTIONS} />
    </>
  );
}
