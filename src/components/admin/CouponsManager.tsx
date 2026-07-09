"use client";

import { useState } from "react";

type Coupon = {
  code: string;
  type: "PERCENT" | "FLAT" | "SHIPPING";
  value: number;
  active: boolean;
  expiresAt: string | null;
};

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtValue(c: Coupon) {
  if (c.type === "PERCENT") return `${c.value}%`;
  if (c.type === "FLAT") return `Rs. ${c.value}`;
  return "Free shipping";
}

export default function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const [rows, setRows] = useState(coupons);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<Coupon["type"]>("PERCENT");
  const [value, setValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    if (!code.trim()) {
      setError("Code is required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim(),
        type,
        value: Number(value) || 0,
        expiresAt: expiresAt || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not create coupon.");
      return;
    }
    const created = await res.json();
    setRows((prev) => [
      { code: created.code, type: created.type, value: created.value, active: created.active, expiresAt: created.expiresAt },
      ...prev,
    ]);
    setCode("");
    setValue("");
    setExpiresAt("");
    setShowForm(false);
  }

  async function deactivate(couponCode: string) {
    const res = await fetch(`/api/admin/coupons/${couponCode}`, { method: "PATCH" });
    if (res.ok) {
      setRows((prev) => prev.map((c) => (c.code === couponCode ? { ...c, active: false } : c)));
    }
  }

  return (
    <>
      <div className="section-header">
        <span className="section-title">Coupon Codes</span>
        <button className="btn btn-gold btn-sm" onClick={() => setShowForm((v) => !v)}>
          + New Coupon
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 20 }}>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>New Coupon</div>
            {error && (
              <div
                style={{
                  background: "rgba(224,92,92,.12)",
                  border: "1px solid rgba(224,92,92,.3)",
                  color: "var(--red)",
                  padding: "10px 14px",
                  borderRadius: 6,
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {error}
              </div>
            )}
            <div className="form-grid">
              <div className="form-group">
                <label>Code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="SAVE20"
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as Coupon["type"])}>
                  <option value="PERCENT">Percent (%)</option>
                  <option value="FLAT">Flat (Rs.)</option>
                  <option value="SHIPPING">Free Shipping</option>
                </select>
              </div>
              {type !== "SHIPPING" && (
                <div className="form-group">
                  <label>Value</label>
                  <input value={value} onChange={(e) => setValue(e.target.value)} type="number" placeholder="20" />
                </div>
              )}
              <div className="form-group">
                <label>Expires At</label>
                <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn btn-gold" onClick={submit} disabled={saving}>
                {saving ? "Creating..." : "Create Coupon"}
              </button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.code}>
                    <td className="mono">{c.code}</td>
                    <td>{c.type.toLowerCase()}</td>
                    <td>{fmtValue(c)}</td>
                    <td>{fmtDate(c.expiresAt)}</td>
                    <td>
                      <span className={`badge ${c.active ? "badge-green" : "badge-muted"}`}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {c.active && (
                        <button className="btn btn-danger btn-sm" onClick={() => deactivate(c.code)}>
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
