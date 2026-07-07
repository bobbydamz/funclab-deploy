"use client";

import { useRef, useState } from "react";

export default function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  function submit() {
    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const message = messageRef.current?.value ?? "";
    if (!name || !email || !message) {
      setError(true);
      return;
    }
    setError(false);
    setSuccess(true);
    setSent(true);
  }

  return (
    <div className="contact-form-wrap">
      <h2>Send Us a Message</h2>
      <div className="cf-group">
        <label>Your Name</label>
        <input ref={nameRef} type="text" placeholder="e.g. Priya Sharma" />
      </div>
      <div className="cf-group">
        <label>Email Address</label>
        <input ref={emailRef} type="email" placeholder="e.g. priya@email.com" />
      </div>
      <div className="cf-group">
        <label>Subject</label>
        <select defaultValue="">
          <option value="">Select a topic</option>
          <option>Order Enquiry</option>
          <option>Product Question</option>
          <option>Returns &amp; Refunds</option>
          <option>Shipping Issue</option>
          <option>Wholesale / Partnership</option>
          <option>Other</option>
        </select>
      </div>
      <div className="cf-group">
        <label>Message</label>
        <textarea ref={messageRef} placeholder="Tell us how we can help..." />
      </div>
      <button className="cf-submit" onClick={submit} disabled={sent}>
        {sent ? "Sent!" : "Send Message"}
      </button>
      {error && (
        <div className="cf-success" style={{ background: "#fdf0f0", borderColor: "#d9534f" }}>
          Please fill in all required fields.
        </div>
      )}
      <div className="cf-success" style={{ display: success ? "block" : "none" }}>
        ✓ Thank you! We&apos;ll get back to you within 24 hours.
      </div>
    </div>
  );
}
