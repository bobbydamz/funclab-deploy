"use client";

import { useRef, useState } from "react";

export default function Newsletter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);

  function submit() {
    const email = inputRef.current?.value.trim() ?? "";
    if (!email || !email.includes("@")) return;
    if (inputRef.current) inputRef.current.value = "";
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  }

  return (
    <div className="newsletter reveal">
      <h2>Stay in the loop</h2>
      <p>Press features, brand news, and clean nutrition insights — straight to your inbox.</p>
      <div className="nl-form">
        <input ref={inputRef} type="email" placeholder="your@email.com" autoComplete="email" />
        <button onClick={submit}>Subscribe</button>
      </div>
      <div className="nl-success" style={{ display: success ? "block" : "none" }}>
        ✓ You&apos;re subscribed! Welcome to BioHAK Wellness community.
      </div>
    </div>
  );
}
