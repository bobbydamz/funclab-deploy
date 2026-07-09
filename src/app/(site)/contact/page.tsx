import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact Us — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function ContactPage() {
  return (
    <>
      <div className="page-hero-blk">
        <span className="hero-label">Get In Touch</span>
        <h1>Contact Us</h1>
        <p>We&apos;d love to hear from you. Reach out anytime.</p>
      </div>
      <div className="contact-wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Let&apos;s Talk</h2>
            <p>
              Have a question about our products, your order, or just want to say hello? Our team
              is here to help. We typically respond within 24 hours on business days.
            </p>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-detail-text">
                <strong>Email Us</strong>
                <a href="mailto:hello@biohakwellness.com" style={{ color: "#4bb4b4" }}>
                  hello@biohakwellness.com
                </a>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div className="contact-detail-text">
                <strong>WhatsApp</strong>
                <a
                  href="https://api.whatsapp.com/send?phone=918291959606"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#4bb4b4" }}
                >
                  +91 82919 59606
                </a>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="contact-detail-text">
                <strong>Customer Service Hours</strong>
                Monday to Friday: 10am – 6pm IST
                <br />
                For weekend queries, email us.
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21 2H3v16h5l4 4 4-4h5V2z" />
                </svg>
              </div>
              <div className="contact-detail-text">
                <strong>Follow Us</strong>
                <a
                  href="https://www.instagram.com/biohakwellness/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#4bb4b4" }}
                >
                  Instagram
                </a>{" "}
                &nbsp;|&nbsp;{" "}
                <a
                  href="https://www.linkedin.com/company/biohakwellness"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#4bb4b4" }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
