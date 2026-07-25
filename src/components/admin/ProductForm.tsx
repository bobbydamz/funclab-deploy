"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type ProductFormValues = {
  id?: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  description: string;
  benefits: string[];
  benefitTags: string[];
  rating: number | null;
  reviewCount: number;
  stock: number;
  active: boolean;
};

const LOW_STOCK_THRESHOLD = 10;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initial?.compareAtPrice != null ? String(initial.compareAtPrice) : ""
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [benefits, setBenefits] = useState(initial?.benefits.join(", ") ?? "");
  const [benefitTags, setBenefitTags] = useState(initial?.benefitTags.join(", ") ?? "");
  const [rating, setRating] = useState(initial?.rating != null ? String(initial.rating) : "");
  const [reviewCount, setReviewCount] = useState(initial ? String(initial.reviewCount) : "0");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "100");
  const [active, setActive] = useState(initial?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !slug.trim() || !image.trim()) {
      setError("Name, slug, and image are required.");
      return;
    }

    const payload = {
      slug: slug.trim(),
      name: name.trim(),
      price: Math.round(Number(price)),
      compareAtPrice: compareAtPrice.trim() ? Math.round(Number(compareAtPrice)) : null,
      image: image.trim(),
      description: description.trim(),
      benefits: benefits.split(",").map((b) => b.trim()).filter(Boolean),
      benefitTags: benefitTags.split(",").map((b) => b.trim()).filter(Boolean),
      rating: rating.trim() ? Number(rating) : null,
      reviewCount: Math.round(Number(reviewCount)) || 0,
      stock: Math.round(Number(stock)) || 0,
      active,
    };

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    setSaving(true);
    const res = await fetch(mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial!.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${initial.name}"? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not delete product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const stockNum = Math.round(Number(stock)) || 0;

  return (
    <form onSubmit={submit}>
      {error && (
        <div
          style={{
            background: "var(--red-bg)",
            border: "1px solid rgba(224,92,92,.3)",
            color: "var(--red)",
            padding: "10px 14px",
            borderRadius: 6,
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Basics
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Whey Protein" required />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="whey-protein"
              required
            />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: 14 }}>
          <label>Image path or URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/product-whey-protein.png" required />
        </div>
        <div className="form-group" style={{ marginTop: 14 }}>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Pricing & Stock
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Price (Rs.)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min={0} required />
          </div>
          <div className="form-group">
            <label>Compare-at price (Rs., optional)</label>
            <input value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} type="number" min={0} />
          </div>
          <div className="form-group">
            <label>
              Stock {stockNum > 0 && stockNum <= LOW_STOCK_THRESHOLD && <span className="badge badge-orange" style={{ marginLeft: 6 }}>Low</span>}
              {stockNum === 0 && <span className="badge badge-red" style={{ marginLeft: 6 }}>Out of stock</span>}
            </label>
            <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min={0} />
          </div>
          <div className="form-group">
            <label>Active on storefront</label>
            <select value={active ? "true" : "false"} onChange={(e) => setActive(e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive (hidden)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Merchandising
        </div>
        <div className="form-group">
          <label>Benefits (comma-separated)</label>
          <input value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Muscle recovery, Digestive support" />
        </div>
        <div className="form-group" style={{ marginTop: 14 }}>
          <label>Benefit tags (comma-separated)</label>
          <input value={benefitTags} onChange={(e) => setBenefitTags(e.target.value)} placeholder="High Protein, Gluten Free" />
        </div>
        <div className="form-grid" style={{ marginTop: 14 }}>
          <div className="form-group">
            <label>Rating (0–5, optional)</label>
            <input value={rating} onChange={(e) => setRating(e.target.value)} type="number" min={0} max={5} step={0.1} />
          </div>
          <div className="form-group">
            <label>Review count</label>
            <input value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} type="number" min={0} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-gold" disabled={saving}>
            {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
          </button>
          <Link href="/admin/products" className="btn btn-outline">
            Cancel
          </Link>
        </div>
        {mode === "edit" && (
          <button type="button" className="btn btn-danger" onClick={onDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        )}
      </div>
    </form>
  );
}
