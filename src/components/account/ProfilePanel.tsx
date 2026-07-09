"use client";

import { useState } from "react";

type User = { firstName: string; lastName: string | null; email: string; phone: string | null };

export default function ProfilePanel({ user, onSaved }: { user: User; onSaved: (name: string) => void }) {
  const [name, setName] = useState(`${user.firstName} ${user.lastName ?? ""}`.trim());
  const [phone, setPhone] = useState(user.phone ?? "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSuccess("");
    setError("");
    setSaving(true);
    const [firstName, ...rest] = name.trim().split(/\s+/);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName || "", lastName: rest.join(" "), phone }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong.");
        return;
      }
      setSuccess("Profile updated successfully!");
      onSaved(name.trim());
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Profile Details</div>
        <div className="panel-sub">Update your personal information</div>
      </div>
      <div className="profile-card">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input value={user.email} disabled style={{ background: "#f7f4f0", color: "#999", cursor: "not-allowed" }} />
        </div>
        {success && <div className="form-success" style={{ display: "block" }}>{success}</div>}
        {error && <div className="form-error" style={{ display: "block" }}>{error}</div>}
        <button className="profile-save" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
