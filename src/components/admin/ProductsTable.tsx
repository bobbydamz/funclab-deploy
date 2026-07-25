"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  active: boolean;
};

const LOW_STOCK_THRESHOLD = 10;

export default function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <>
      <div className="section-header">
        <span className="section-title">Products</span>
        <Link href="/admin/products/new" className="btn btn-gold btn-sm">
          + New Product
        </Link>
      </div>
      <div className="search-bar">
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input placeholder="Search by name or slug..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ width: 44 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", background: "var(--bg3)" }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>
                        {p.slug}
                      </div>
                    </td>
                    <td className="mono">
                      Rs. {p.price.toLocaleString("en-IN")}
                      {p.compareAtPrice != null && (
                        <span style={{ color: "var(--muted)", textDecoration: "line-through", marginLeft: 6, fontSize: 11 }}>
                          Rs. {p.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td>
                      {p.stock === 0 ? (
                        <span className="badge badge-red">Out of stock</span>
                      ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                        <span className="badge badge-orange">{p.stock} left</span>
                      ) : (
                        <span className="mono">{p.stock}</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${p.active ? "badge-green" : "badge-muted"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/products/${p.id}/edit`} className="btn btn-outline btn-sm">
                        Edit
                      </Link>
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
