"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

type Step = 1 | 2 | 3;

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [s1Error, setS1Error] = useState("");
  const [s1Busy, setS1Busy] = useState(false);

  const [resetToken, setResetToken] = useState("");
  const [displayCode, setDisplayCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [s2Error, setS2Error] = useState("");
  const [s2Busy, setS2Busy] = useState(false);

  async function requestReset() {
    setS1Error("");
    if (!email.trim()) return setS1Error("Please enter your email address");
    if (!email.includes("@")) return setS1Error("Please enter a valid email address");

    setS1Busy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setS1Error(data.error || "Something went wrong.");
        return;
      }
      setResetToken(data.token);
      setDisplayCode(data.code);
      setEnteredCode(data.code);
      setStep(2);
    } catch {
      setS1Error("Something went wrong.");
    } finally {
      setS1Busy(false);
    }
  }

  async function doReset() {
    setS2Error("");
    if (!enteredCode.trim()) return setS2Error("Please enter the reset code");
    if (!newPw) return setS2Error("Please enter a new password");
    if (newPw.length < 8) return setS2Error("Password must be at least 8 characters");
    if (newPw !== newPw2) return setS2Error("Passwords do not match");

    setS2Busy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, code: enteredCode, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setS2Error(data.error || "Something went wrong.");
        return;
      }
      setStep(3);
    } catch {
      setS2Error("Something went wrong.");
    } finally {
      setS2Busy(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="reset-box">
        {step === 1 && (
          <div className="step">
            <div className="step-icon">🔐</div>
            <div className="step-title">Forgot Password?</div>
            <div className="step-sub">Enter your email address and we&apos;ll generate a reset code for you.</div>
            {s1Error && <div className="form-error">{s1Error}</div>}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && requestReset()}
                placeholder="you@email.com"
              />
            </div>
            <button className="submit-btn" onClick={requestReset} disabled={s1Busy}>
              {s1Busy ? "Sending…" : "Get Reset Code"}
            </button>
            <p className="back-link">
              Remembered your password? <Link href="/account">Sign In</Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <div className="step-icon">✉️</div>
            <div className="step-title">Your Reset Code</div>
            <div className="step-sub">
              Use the code below to reset your password. This code expires in 1 hour.
            </div>

            <div className="code-box">
              <div className="code-label">Your Reset Code</div>
              <div className="code-value">{displayCode}</div>
              <div className="code-note">Copy this code — you&apos;ll need it below</div>
            </div>

            {s2Error && <div className="form-error">{s2Error}</div>}

            <div className="form-group">
              <label>Reset Code</label>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                placeholder="Enter the code above"
                maxLength={8}
                style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <PasswordInput
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <PasswordInput
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doReset()}
                placeholder="••••••••"
              />
            </div>
            <button className="submit-btn" onClick={doReset} disabled={s2Busy}>
              {s2Busy ? "Resetting…" : "Reset Password"}
            </button>
            <button className="back-link" onClick={() => setStep(1)}>
              ← Try a different email
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <div className="step-icon">✅</div>
            <div className="step-title">Password Reset!</div>
            <div className="step-sub">
              Your password has been updated successfully. You can now sign in with your new password.
            </div>
            <Link href="/account" className="submit-btn">
              Go to Sign In
            </Link>
            <p className="back-link">
              <Link href="/">Back to Homepage</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
