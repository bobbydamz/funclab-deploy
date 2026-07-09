"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartControls({
  product,
}: {
  product: { id: number; name: string; price: number; image: string; slug: string };
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function changeQty(delta: number) {
    setQty((q) => Math.max(1, Math.min(10, q + delta)));
  }

  function addToCart() {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="qty-row">
      <div className="qty-ctrl">
        <button onClick={() => changeQty(-1)}>−</button>
        <input type="number" value={qty} readOnly />
        <button onClick={() => changeQty(1)}>+</button>
      </div>
      <button className={`add-to-cart-btn${added ? " add-success" : ""}`} onClick={addToCart}>
        {added ? "Added ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
