"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SerializedProduct as Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

const PRICE_MIN = 1800;
const PRICE_MAX = 5500;
const STAR_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);
const HEART_ICON = (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

type SortMethod = "featured" | "relevant" | "best-selling" | "price-low" | "price-high";

type FilterPanelProps = {
  mobile: boolean;
  stockOpen: boolean;
  setStockOpen: (v: boolean) => void;
  priceOpen: boolean;
  setPriceOpen: (v: boolean) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  outOfStockOnly: boolean;
  setOutOfStockOnly: (v: boolean) => void;
  priceMin: number;
  setPriceMin: (v: number) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
};

function FilterPanel({
  mobile,
  stockOpen,
  setStockOpen,
  priceOpen,
  setPriceOpen,
  inStockOnly,
  setInStockOnly,
  outOfStockOnly,
  setOutOfStockOnly,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
}: FilterPanelProps) {
  const priceDisplay = `Price: Rs. ${priceMin.toLocaleString("en-IN")} – Rs. ${priceMax.toLocaleString("en-IN")}`;

  return (
    <>
      <div className="filter-group" style={mobile ? { borderTop: "none" } : undefined}>
        <div className={`filter-group-title${stockOpen ? " open" : ""}`} onClick={() => setStockOpen(!stockOpen)}>
          Availability <span className="chevron">▲</span>
        </div>
        <div className={`filter-options${stockOpen ? " open" : ""}`}>
          <label className="filter-option">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            <label>In Stock</label>
          </label>
          <label className="filter-option">
            <input type="checkbox" checked={outOfStockOnly} onChange={(e) => setOutOfStockOnly(e.target.checked)} />
            <label>Out of Stock</label>
          </label>
        </div>
      </div>
      <div className="filter-group">
        <div className={`filter-group-title${priceOpen ? " open" : ""}`} onClick={() => setPriceOpen(!priceOpen)}>
          Price <span className="chevron">▲</span>
        </div>
        <div className={`filter-options${priceOpen ? " open" : ""}`}>
          <div className="price-range-wrap">
            <div className="price-display">{priceDisplay}</div>
            <div className="price-inputs">
              <span>₹</span>
              <input
                type="number"
                value={priceMin}
                min={PRICE_MIN}
                max={PRICE_MAX}
                onChange={(e) => setPriceMin(Number(e.target.value) || PRICE_MIN)}
              />
              <span>–</span>
              <input
                type="number"
                value={priceMax}
                min={PRICE_MIN}
                max={PRICE_MAX}
                onChange={(e) => setPriceMax(Number(e.target.value) || PRICE_MAX)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AllProductsCatalog({ products }: { products: Product[] }) {
  const { add } = useCart();
  const router = useRouter();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [sort, setSort] = useState<SortMethod>("featured");
  const [mobFilterOpen, setMobFilterOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [stockOpen, setStockOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { productId: number }[]) => setWishlisted(new Set(items.map((i) => i.productId))))
      .catch(() => {});
  }, []);

  const visible = useMemo(() => {
    // Every seeded product is in stock — no per-product stock flag in the schema yet,
    // matching the original site (all 9 cards were hardcoded data-stock="in").
    const stockMatch = !inStockOnly && !outOfStockOnly ? true : inStockOnly;
    return products.filter((p) => stockMatch && p.price >= priceMin && p.price <= priceMax);
  }, [products, inStockOnly, outOfStockOnly, priceMin, priceMax]);

  const sorted = useMemo(() => {
    const list = [...visible];
    if (sort === "best-selling") list.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    // "featured" and "relevant" both fall back to the original curated (id) order —
    // there's no real relevance signal (like a search query) to rank by here.
    else list.sort((a, b) => a.id - b.id);
    return list;
  }, [visible, sort]);

  function clearAll() {
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  }

  async function toggleWishlist(productId: number) {
    const meRes = await fetch("/api/auth/me");
    if (!meRes.ok) {
      sessionStorage.setItem("funclab_redirect_after_login", "/all-products");
      router.push("/account");
      return;
    }

    const isWishlisted = wishlisted.has(productId);
    if (isWishlisted) {
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      setWishlisted((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setWishlisted((prev) => new Set(prev).add(productId));
    }
  }

  function addToCart(p: Product) {
    add({ id: p.id, name: p.name, price: p.price, image: p.image, slug: p.slug });
    setAddedSlug(p.slug);
    setTimeout(() => setAddedSlug(null), 2000);
  }

  const filterPanelProps: FilterPanelProps = {
    mobile: false,
    stockOpen,
    setStockOpen,
    priceOpen,
    setPriceOpen,
    inStockOnly,
    setInStockOnly,
    outOfStockOnly,
    setOutOfStockOnly,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
  };

  return (
    <>
      <div className={`mob-filter-drawer${mobFilterOpen ? " open" : ""}`}>
        <div className="mob-filter-bg" onClick={() => setMobFilterOpen(false)} />
        <div className="mob-filter-panel">
          <div className="mob-filter-header">
            <h3>Filter</h3>
            <button className="mob-filter-close" onClick={() => setMobFilterOpen(false)}>
              ✕
            </button>
          </div>
          <FilterPanel {...filterPanelProps} mobile />
        </div>
      </div>

      <div className="shop-wrap">
        <div className="collection-wrap">
          <aside className="sidebar">
            <div className="filter-header">
              <h2>Filter</h2>
              <button className="filter-clear-all" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <FilterPanel {...filterPanelProps} />
          </aside>

          <main>
            <button className="mob-filter-btn" onClick={() => setMobFilterOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filter &amp; Sort
            </button>

            <div className="active-filters">
              {inStockOnly && (
                <div className="filter-chip" onClick={() => setInStockOnly(false)}>
                  In Stock <span className="x">×</span>
                </div>
              )}
              {outOfStockOnly && (
                <div className="filter-chip" onClick={() => setOutOfStockOnly(false)}>
                  Out of Stock <span className="x">×</span>
                </div>
              )}
              {(priceMin > PRICE_MIN || priceMax < PRICE_MAX) && (
                <div
                  className="filter-chip"
                  onClick={() => {
                    setPriceMin(PRICE_MIN);
                    setPriceMax(PRICE_MAX);
                  }}
                >
                  Rs. {priceMin.toLocaleString("en-IN")} – Rs. {priceMax.toLocaleString("en-IN")}{" "}
                  <span className="x">×</span>
                </div>
              )}
            </div>

            <div className="sort-bar">
              <span className="product-count">
                {sorted.length} product{sorted.length !== 1 ? "s" : ""}
              </span>
              <div className="sort-select-wrap">
                <span className="sort-label">Sort by</span>
                <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortMethod)}>
                  <option value="featured">Featured</option>
                  <option value="relevant">Most Relevant</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price, low to high</option>
                  <option value="price-high">Price, high to low</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {sorted.map((p) => {
                const pct = p.compareAtPrice
                  ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                  : null;
                return (
                  <div className="product-card" key={p.id}>
                    <div className="product-img-wrap">
                      <Link href={`/${p.slug}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </Link>
                      <button
                        className={`wish-heart${wishlisted.has(p.id) ? " active" : ""}`}
                        aria-label="Add to wishlist"
                        onClick={() => toggleWishlist(p.id)}
                      >
                        {HEART_ICON}
                      </button>
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
                      <div className="tag-row">
                        {p.benefitTags.map((t) => (
                          <span className="tag-pill" key={t}>
                            {t}
                          </span>
                        ))}
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
                      <button
                        className={`add-btn${addedSlug === p.slug ? " added" : ""}`}
                        onClick={() => addToCart(p)}
                      >
                        {addedSlug === p.slug ? "✓ Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
