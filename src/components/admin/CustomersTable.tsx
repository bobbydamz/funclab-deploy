"use client";

import { useMemo, useState } from "react";

type Customer = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [rows, setRows] = useState(customers);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (c) => `${c.firstName} ${c.lastName ?? ""}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [rows, search]);

  async function toggleRole(id: string, current: Customer["role"]) {
    const next = current === "ADMIN" ? "CUSTOMER" : "ADMIN";
    setPending(id);
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    if (res.ok) {
      setRows((prev) => prev.map((c) => (c.id === id ? { ...c, role: next } : c)));
    }
    setPending(null);
  }

  return (
    <>
      <div className="section-header">
        <span className="section-title">Customers</span>
      </div>
      <div className="search-bar">
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.firstName} {c.lastName ?? ""}
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone ?? "—"}</td>
                    <td>
                      <span className={`badge ${c.role === "ADMIN" ? "badge-gold" : "badge-muted"}`}>
                        {c.role.toLowerCase()}
                      </span>
                    </td>
                    <td>{fmtDate(c.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={pending === c.id}
                        onClick={() => toggleRole(c.id, c.role)}
                      >
                        {c.role === "ADMIN" ? "Revoke admin" : "Make admin"}
                      </button>
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
