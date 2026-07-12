"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

type Tab = "login" | "register";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function afterAuthSuccess(router: ReturnType<typeof useRouter>) {
  const redirect = sessionStorage.getItem("funclab_redirect_after_login");
  if (redirect) {
    sessionStorage.removeItem("funclab_redirect_after_login");
    router.push(redirect);
    return;
  }
  router.refresh();
}

export default function AuthScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [regFirst, setRegFirst] = useState("");
  const [regLast, setRegLast] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPw2, setRegPw2] = useState("");
  const [regError, setRegError] = useState("");
  const [regBusy, setRegBusy] = useState(false);

  async function doLogin() {
    setLoginError("");
    if (!loginEmail.trim() || !loginPw) {
      setLoginError("Please enter your email and password");
      return;
    }
    setLoginBusy(true);
    try {
      await postJson("/api/auth/login", { email: loginEmail.trim(), password: loginPw });
      afterAuthSuccess(router);
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function doRegister() {
    setRegError("");
    if (!regFirst.trim() || !regEmail.trim() || !regPw) {
      setRegError("Name, email and password are required");
      return;
    }
    if (regPw.length < 8) {
      setRegError("Password must be at least 8 characters");
      return;
    }
    if (regPw !== regPw2) {
      setRegError("Passwords do not match");
      return;
    }
    setRegBusy(true);
    try {
      await postJson("/api/auth/register", {
        firstName: regFirst.trim(),
        lastName: regLast.trim() || undefined,
        email: regEmail.trim(),
        phone: regPhone.trim() || undefined,
        password: regPw,
      });
      afterAuthSuccess(router);
    } catch (e) {
      setRegError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setRegBusy(false);
    }
  }

  return (
    <div id="authScreen">
      <div className="page-hero">
        <h1>My Account</h1>
        <p>Sign in to view your orders, wishlist and profile</p>
      </div>
      <div className="auth-container">
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>
            Sign In
          </button>
          <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>
            Create Account
          </button>
        </div>

        <div className={`auth-form${tab === "login" ? " active" : ""}`}>
          {loginError && <div className="form-error" style={{ display: "block" }}>{loginError}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <PasswordInput value={loginPw} onChange={(e) => setLoginPw(e.target.value)} placeholder="••••••••" />
          </div>
          <a href="/forgot-password" className="forgot-link">Forgot password?</a>
          <button className="submit-btn" onClick={doLogin} disabled={loginBusy}>
            {loginBusy ? "Signing in…" : "Sign In"}
          </button>
          <div className="divider">or</div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
            Don&apos;t have an account?{" "}
            <span style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer" }} onClick={() => setTab("register")}>
              Create one
            </span>
          </p>
        </div>

        <div className={`auth-form${tab === "register" ? " active" : ""}`}>
          {regError && <div className="form-error" style={{ display: "block" }}>{regError}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={regFirst} onChange={(e) => setRegFirst(e.target.value)} placeholder="Priya" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={regLast} onChange={(e) => setRegLast(e.target.value)} placeholder="Sharma" />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <PasswordInput value={regPw} onChange={(e) => setRegPw(e.target.value)} placeholder="Minimum 8 characters" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <PasswordInput value={regPw2} onChange={(e) => setRegPw2(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="submit-btn" onClick={doRegister} disabled={regBusy}>
            {regBusy ? "Creating account…" : "Create Account"}
          </button>
          <div className="divider">or</div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
            Already have an account?{" "}
            <span style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer" }} onClick={() => setTab("login")}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
