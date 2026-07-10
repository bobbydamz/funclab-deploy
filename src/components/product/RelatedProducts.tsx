"use client";

import { useState } from "react";
import Link from "next/link";
import type { SerializedProduct as Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

const STAR_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);

export default function RelatedProducts({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  if (!products.length) return null;

  function addToCart(p: Product) {
    add({ id: p.id, name: p.name, price: p.price, image: p.image, slug: p.slug });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="related-section">
      <h2 className="section-title">You May Also Like</h2>
      <div className="products-grid">
        {products.map((p) => {
          const pct = p.compareAtPrice ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : null;
          return (
            <div className="product-card" key={p.id}>
              <div className="product-img-wrap">
                <Link href={`/${p.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} loading="lazy" />
                </Link>
              </div>
              <div className="product-info">
                <div className="product-rating">
                  <span className="rating-pill">
                    {STAR_ICON}
                    {p.rating?.toString()}
                    <span className="rating-max">/5</span>
                  </span>
                  <span className="rating-count">({p.reviewCount})</span>
                </div>
                <div className="product-name">
                  <Link href={`/${p.slug}`}>{p.name}</Link>
                </div>
                <div className="product-price">
                  <span className="price-now">₹{p.price.toLocaleString("en-IN")}</span>
                  {p.compareAtPrice && (
                    <span className="price-was">₹{p.compareAtPrice.toLocaleString("en-IN")}</span>
                  )}
                  {pct !== null && <span className="price-save">{pct}% off</span>}
                </div>
                <button className="add-btn" onClick={() => addToCart(p)}>
                  {addedId === p.id ? "✓ Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
