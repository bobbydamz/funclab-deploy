"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type WishlistItem = {
  id: string;
  productId: number;
  product: { id: number; slug: string; name: string; price: number; image: string };
};

export default function WishlistPanel() {
  const { add } = useCart();
  const [items, setItems] = useState<WishlistItem[] | null>(null);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function remove(productId: number) {
    await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
    setItems((prev) => prev?.filter((i) => i.productId !== productId) ?? null);
  }

  function addToCart(item: WishlistItem) {
    add({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      slug: item.product.slug,
    });
  }

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">My Wishlist</div>
        <div className="panel-sub">Products you&apos;ve saved</div>
      </div>
      <div className="account-panel-body">
        {items === null ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div
              style={{
                width: 28, height: 28, border: "2px solid #e8e4de", borderTopColor: "#1a1a1a",
                borderRadius: "50%", margin: "0 auto", animation: "spin .7s linear infinite",
              }}
            />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love and find them here later.</p>
            <Link href="/all-products" className="empty-cta">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((item) => (
              <div className="wish-card" key={item.id}>
                <Link href={`/${item.product.slug}`} className="wish-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.product.image} alt={item.product.name} />
                </Link>
                <div className="wish-body">
                  <div className="wish-name">{item.product.name}</div>
                  <div className="wish-price">Rs. {item.product.price.toLocaleString("en-IN")}</div>
                  <div className="wish-actions">
                    <button className="wish-btn wish-atc" onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                    <button className="wish-btn wish-remove" onClick={() => remove(item.productId)}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
