"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";

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
