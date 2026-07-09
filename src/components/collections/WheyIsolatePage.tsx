"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

type Flavour = "chocolate" | "vanilla" | "coffee" | "unflavoured" | "assorted";

type Product = {
  flavour: Flavour;
  name: string;
  image: string;
  price: number;
  compareAt: number;
  date: number;
  badge: "launch" | "pct";
  pct?: number;
  rating?: { stars: string; count: number };
};

const PRODUCTS: Product[] = [
  { flavour: "chocolate", name: "Whey Protein - Chocolate", image: "https://images.unsplash.com/photo-1612200900624-56e2eb3c7561?w=600&q=80&fit=crop", price: 2250, compareAt: 2500, date: 1, badge: "launch", rating: { stars: "★★★★★", count: 2 } },
  { flavour: "vanilla", name: "Whey Protein - Vanilla", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop", price: 2250, compareAt: 2500, date: 2, badge: "launch" },
  { flavour: "coffee", name: "Whey Protein - Coffee", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&q=80&fit=crop", price: 2250, compareAt: 2500, date: 3, badge: "launch", rating: { stars: "★★★★★", count: 1 } },
  { flavour: "unflavoured", name: "Whey Protein - Unflavored", image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600&q=80&fit=crop", price: 2250, compareAt: 2500, date: 4, badge: "launch" },
  { flavour: "assorted", name: "Whey Protein - Assorted Flavor Travel Pack Sachets", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&fit=crop", price: 1299, compareAt: 1400, date: 5, badge: "launch" },
  { flavour: "coffee", name: "Whey Protein - Single Coffee Flavor Travel Pack Sachets", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&q=80&fit=crop", price: 1725, compareAt: 2000, date: 6, badge: "pct", pct: 14 },
  { flavour: "chocolate", name: "Whey Protein - Single Chocolate Flavor Travel Pack Sachets", image: "https://images.unsplash.com/photo-1612200900624-56e2eb3c7561?w=600&q=80&fit=crop", price: 1725, compareAt: 2000, date: 7, badge: "pct", pct: 14 },
  { flavour: "vanilla", name: "Whey Protein - Single Vanilla Flavor Travel Pack Sachets", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop", price: 1725, compareAt: 2000, date: 8, badge: "pct", pct: 14 },
  { flavour: "unflavoured", name: "Whey Protein - Single Unflavoured Flavor Travel Pack Sachets", image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600&q=80&fit=crop", price: 1725, compareAt: 2000, date: 9, badge: "pct", pct: 14 },
];

const FLAVOUR_LABEL: Record<Flavour, string> = {
  chocolate: "Chocolate",
  coffee: "Coffee",
  unflavoured: "Unflavoured",
  vanilla: "Vanilla",
  assorted: "Assorted",
};
const FLAVOUR_COUNT: Record<Flavour, number> = { chocolate: 2, coffee: 2, unflavoured: 1, vanilla: 2, assorted: 1 };

type SortMethod = "featured" | "best-selling" | "a-z" | "z-a" | "price-low" | "price-high" | "date-old" | "date-new";

export default function WheyIsolatePage() {
  const [flavourOpen, setFlavourOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [mobFilterOpen, setMobFilterOpen] = useState(false);
  const [flavExpanded, setFlavExpanded] = useState(false);
  const [flavs, setFlavs] = useState<Set<Flavour>>(new Set());
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(4450);
  const [sort, setSort] = useState<SortMethod>("featured");
  const [addedIdx, setAddedIdx] = useState<number | null>(null);

  function toggleFlav(f: Flavour) {
    setFlavs((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  const visible = useMemo(() => {
    return PRODUCTS.map((p, i) => ({ p, i })).filter(({ p }) => {
      const flavMatch = flavs.size === 0 || flavs.has(p.flavour);
      const priceMatch = p.price >= priceMin && p.price <= priceMax;
      return flavMatch && priceMatch;
    });
  }, [flavs, priceMin, priceMax]);

  const sorted = useMemo(() => {
    const list = [...visible];
    if (sort === "a-z") list.sort((a, b) => a.p.name.localeCompare(b.p.name));
    else if (sort === "z-a") list.sort((a, b) => b.p.name.localeCompare(a.p.name));
    else if (sort === "price-low") list.sort((a, b) => a.p.price - b.p.price);
    else if (sort === "price-high") list.sort((a, b) => b.p.price - a.p.price);
    else if (sort === "date-old") list.sort((a, b) => a.p.date - b.p.date);
    else if (sort === "date-new") list.sort((a, b) => b.p.date - a.p.date);
    else list.sort((a, b) => a.p.date - b.p.date);
    return list;
  }, [visible, sort]);

  function clearAllFilters() {
    setFlavs(new Set());
    setPriceMin(0);
    setPriceMax(4450);
  }

  function addToCart(i: number) {
    setAddedIdx(i);
    setTimeout(() => setAddedIdx(null), 2000);
  }

  const flavourFilters = (
    <>
      {(["chocolate", "coffee", "unflavoured", "vanilla", "assorted"] as Flavour[]).map((f) => (
        <label className="filter-option" key={f}>
          <input type="checkbox" checked={flavs.has(f)} onChange={() => toggleFlav(f)} />
          <label>
            {FLAVOUR_LABEL[f]} <span className="count">({FLAVOUR_COUNT[f]})</span>
          </label>
        </label>
      ))}
      {flavExpanded && (
        <label className="filter-option">
          <input type="checkbox" disabled />
          <label>
            Single Flavour <span className="count">(4)</span>
          </label>
        </label>
      )}
      <button className="show-more-btn" onClick={() => setFlavExpanded((v) => !v)}>
        {flavExpanded ? "Show less" : "Show more"}
      </button>
    </>
  );

  const activeChips = [...flavs].map((f) => ({ label: `Flavour: ${FLAVOUR_LABEL[f]}`, onClear: () => toggleFlav(f) }));

  return (
    <div>
      <ScrollReveal />

      <section className="collection-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop" alt="Whey Protein" />
        <div className="collection-hero-overlay">
          <h1 className="collection-hero-title">Whey Protein</h1>
        </div>
      </section>

      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/all-products">Collections</Link>
        <span>/</span>
        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Whey Protein</span>
      </nav>

      <div className={`mob-filter-drawer${mobFilterOpen ? " open" : ""}`}>
        <div className="mob-filter-bg" onClick={() => setMobFilterOpen(false)} />
        <div className="mob-filter-panel">
          <div className="mob-filter-header">
            <h3>Filter</h3>
            <button className="mob-filter-close" onClick={() => setMobFilterOpen(false)}>
              ✕
            </button>
          </div>
          <div className="filter-group" style={{ borderTop: "none" }}>
            <div className="filter-group-title open">
              Category <span className="chevron">▲</span>
            </div>
            <div className="filter-options open">
              <label className="filter-option">
                <input type="checkbox" checked disabled readOnly />
                <label>
                  Whey Protein <span className="count">(9)</span>
                </label>
              </label>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-group-title open">
              Flavours <span className="chevron">▲</span>
            </div>
            <div className="filter-options open">{flavourFilters}</div>
          </div>
        </div>
      </div>

      <div className="collection-wrap">
        <aside className="sidebar">
          <div className="filter-header">
            <h2>Filter</h2>
            <button className="filter-clear-all" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>

          <div className="filter-group">
            <div className="filter-group-title open">
              Category <span className="chevron">▲</span>
            </div>
            <div className="filter-options open">
              <label className="filter-option">
                <input type="checkbox" checked disabled readOnly />
                <label>
                  Whey Protein <span className="count">(9)</span>
                </label>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <div className={`filter-group-title${flavourOpen ? " open" : ""}`} onClick={() => setFlavourOpen((v) => !v)}>
              Flavours <span className="chevron">▲</span>
            </div>
            <div className={`filter-options${flavourOpen ? " open" : ""}`}>{flavourFilters}</div>
          </div>

          <div className="filter-group">
            <div className={`filter-group-title${priceOpen ? " open" : ""}`} onClick={() => setPriceOpen((v) => !v)}>
              Price <span className="chevron">▲</span>
            </div>
            <div className={`filter-options${priceOpen ? " open" : ""}`}>
              <div className="price-range-wrap">
                <div className="price-display">
                  Price: Rs. {priceMin.toLocaleString("en-IN")} – Rs. {priceMax.toLocaleString("en-IN")}
                </div>
                <div className="price-inputs">
                  <span>₹</span>
                  <input
                    type="number"
                    value={priceMin}
                    min={0}
                    max={4450}
                    placeholder="From"
                    onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    value={priceMax}
                    min={0}
                    max={4450}
                    placeholder="To"
                    onChange={(e) => setPriceMax(Number(e.target.value) || 4450)}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button className="mob-filter-btn" onClick={() => setMobFilterOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filter &amp; Sort
            </button>
          </div>

          {activeChips.length > 0 && (
            <div className="active-filters">
              {activeChips.map((chip) => (
                <div className="filter-chip" key={chip.label} onClick={chip.onClear}>
                  {chip.label} <span className="x">×</span>
                </div>
              ))}
            </div>
          )}

          <div className="sort-bar">
            <span className="product-count">{sorted.length} products</span>
            <div className="sort-select-wrap">
              <span className="sort-label">Sort by</span>
              <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortMethod)}>
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="a-z">Alphabetically, A–Z</option>
                <option value="z-a">Alphabetically, Z–A</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="date-old">Date, old to new</option>
                <option value="date-new">Date, new to old</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {sorted.map(({ p, i }) => (
              <div className="product-card reveal" key={i}>
                <div className="product-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.badge === "launch" ? (
                    <span className="product-badge badge-launch">Launch Offer</span>
                  ) : (
                    <span className="product-badge badge-pct">–{p.pct}%</span>
                  )}
                </div>
                <div className="product-body">
                  <div className="product-title">{p.name}</div>
                  {p.rating && (
                    <div className="product-rating">
                      <span className="stars">{p.rating.stars}</span>
                      <span className="rating-count">({p.rating.count})</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span className="price-sale">Rs. {p.price.toLocaleString("en-IN")}.00</span>
                    <span className="price-compare">Rs. {p.compareAt.toLocaleString("en-IN")}.00</span>
                  </div>
                  <button className={`atc-btn${addedIdx === i ? " added" : ""}`} onClick={() => addToCart(i)}>
                    {addedIdx === i ? "✓ Added" : "Add To Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="wpi-info-strip">
        <div className="wpi-info-inner">
          <div className="reveal">
            <div className="wpi-stat-num">29–30g</div>
            <div className="wpi-stat-unit">Protein per scoop</div>
            <div className="wpi-stat-label">Highest in market</div>
          </div>
          <div className="reveal">
            <div className="wpi-stat-num">&gt;90%</div>
            <div className="wpi-stat-unit">Protein per serving</div>
            <div className="wpi-stat-label">Pure isolate, no blends</div>
          </div>
          <div className="reveal">
            <div className="wpi-stat-num">0g</div>
            <div className="wpi-stat-unit">Added sugar</div>
            <div className="wpi-stat-label">No artificial sweeteners</div>
          </div>
          <div className="reveal">
            <div className="wpi-stat-num">100%</div>
            <div className="wpi-stat-unit">Single-source WPI</div>
            <div className="wpi-stat-label">With digestive enzymes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
