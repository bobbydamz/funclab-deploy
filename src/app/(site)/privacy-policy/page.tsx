import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="page-hero-blk">
        <span className="hero-label">Legal</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: January 2026</p>
      </div>
      <div className="policy-wrap">
        <p>
          BioHAK Wellness (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
          protecting your personal information and your right to privacy. This Privacy Policy
          explains how we collect, use, and share information about you when you use our website
          at <Link href="/">biohakwellness.com</Link>.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Information you provide to us:</h3>
        <ul>
          <li>Name, email address, phone number when you create an account or place an order</li>
          <li>Billing and shipping address</li>
          <li>
            Payment information (processed securely via Razorpay — we do not store card details)
          </li>
          <li>Communications you send us via email or contact forms</li>
        </ul>
        <h3>Information collected automatically:</h3>
        <ul>
          <li>Browser type, IP address, and device information</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring URLs and search terms</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process and fulfil your orders</li>
          <li>To send order confirmations and shipping updates</li>
          <li>To respond to your enquiries and provide customer support</li>
          <li>To send marketing communications (only with your consent)</li>
          <li>To improve our website, products, and services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>We do not sell your personal data. We may share your information with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> — shipping partners, payment processors, email
            platforms — only as needed to fulfil our services
          </li>
          <li>
            <strong>Legal authorities</strong> — when required by law or to protect our rights
          </li>
          <li>
            <strong>Business transfers</strong> — in the event of a merger or acquisition
          </li>
        </ul>

        <h2>4. Cookies</h2>
        <p>
          We use cookies to enhance your experience, remember your preferences, and analyse site
          traffic. You can control cookie settings through your browser. Disabling cookies may
          affect some site functionality.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain your personal data for as long as necessary to fulfil the purposes outlined in
          this policy, or as required by law. Order data is typically retained for 7 years for
          accounting purposes.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (subject to legal obligations)</li>
          <li>Opt out of marketing communications at any time</li>
        </ul>

        <h2>7. Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. However, no
          method of transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          For any privacy-related queries, please contact us at:
          <br />
          <strong>Email:</strong> <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a>
          <br />
          <strong>Customer Service Hours:</strong> Monday to Friday, 10am – 6pm
        </p>
      </div>
    </>
  );
}
