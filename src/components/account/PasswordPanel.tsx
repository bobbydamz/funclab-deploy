"use client";

import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

export default function PasswordPanel() {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function changePassword() {
    setSuccess("");
    setError("");
    if (!oldPw || !newPw) return setError("All fields are required");
    if (newPw.length < 8) return setError("New password must be at least 8 characters");
    if (newPw !== newPw2) return setError("New passwords do not match");

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: oldPw, newPassword: newPw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSuccess("Password changed successfully!");
      setOldPw("");
      setNewPw("");
      setNewPw2("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Change Password</div>
        <div className="panel-sub">Keep your account secure</div>
      </div>
      <div className="password-card">
        {success && <div className="form-success" style={{ display: "block" }}>{success}</div>}
        {error && <div className="form-error" style={{ display: "block" }}>{error}</div>}
        <div className="form-group">
          <label>Current Password</label>
          <PasswordInput value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <PasswordInput value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Minimum 8 characters" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <PasswordInput value={newPw2} onChange={(e) => setNewPw2(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="profile-save" onClick={changePassword} disabled={saving}>
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
