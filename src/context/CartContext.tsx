"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { computeTotals, type CouponInput } from "@/lib/cart-totals";

const STORAGE_KEY = "funclab_cart";

export type CartItem = {
  lineId: string;
  productId: number;
  variantId: string | null;
  name: string;
  price: number;
  image: string;
  slug: string;
  qty: number;
};

export type AddableProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  variantId?: string | null;
};

type CartState = {
  items: CartItem[];
  couponCode: string | null;
};

type AppliedCoupon = { code: string; type: "PERCENT" | "FLAT" | "SHIPPING"; value: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  coupon: AppliedCoupon | null;
  totals: ReturnType<typeof computeTotals> & { coupon: AppliedCoupon | null };
  add: (product: AddableProduct, qty?: number) => void;
  update: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadState(): CartState {
  if (typeof window === "undefined") return { items: [], couponCode: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], couponCode: null };
    return JSON.parse(raw);
  } catch {
    return { items: [], couponCode: null };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], couponCode: null });
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage only after mount (avoids SSR/client mismatch): the server and
  // the client's first render both use the empty default, then this effect swaps in the
  // real persisted state. This is the standard hydrate-after-mount pattern for any
  // localStorage-backed store — there's no way to read localStorage before mount without
  // causing a real hydration mismatch, so the "cascading render" lint warning below is a
  // known false-positive for this specific idiom.
  useEffect(() => {
    const loaded = loadState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loaded);
    setHydrated(true);
    if (loaded.couponCode) {
      fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: loaded.couponCode }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((c) => setCoupon(c))
        .catch(() => setCoupon(null));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const add = useCallback((product: AddableProduct, qty = 1) => {
    const variantId = product.variantId ?? null;
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === product.id && i.variantId === variantId);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i)),
        };
      }
      const newItem: CartItem = {
        lineId: uid(),
        productId: product.id,
        variantId,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        qty,
      };
      return { ...prev, items: [...prev.items, newItem] };
    });
  }, []);

  const update = useCallback((lineId: string, qty: number) => {
    setState((prev) => {
      if (qty < 1) return { ...prev, items: prev.items.filter((i) => i.lineId !== lineId) };
      return { ...prev, items: prev.items.map((i) => (i.lineId === lineId ? { ...i, qty } : i)) };
    });
  }, []);

  const remove = useCallback((lineId: string) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((i) => i.lineId !== lineId) }));
  }, []);

  const clear = useCallback(() => {
    setState({ items: [], couponCode: null });
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || "Invalid or expired coupon code" };
    }
    const data: AppliedCoupon = await res.json();
    setCoupon(data);
    setState((prev) => ({ ...prev, couponCode: data.code }));
    return { success: true };
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setState((prev) => ({ ...prev, couponCode: null }));
  }, []);

  const count = state.items.reduce((s, i) => s + i.qty, 0);
  const totals = useMemo(() => {
    const base = computeTotals(state.items, coupon as CouponInput);
    return { ...base, coupon };
  }, [state.items, coupon]);

  const value: CartContextValue = {
    items: state.items,
    count,
    coupon,
    totals,
    add,
    update,
    remove,
    clear,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
