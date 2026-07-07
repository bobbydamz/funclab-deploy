"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

type Cat = "plant" | "wpi" | "wpc";
type Flavour = "assorted" | "coffee" | "chocolate" | "vanilla" | "unflavoured";

type Pack = {
  cat: Cat;
  flavour: Flavour;
  price: number;
  compareAt: number;
  name: string;
  sachetInfo: string;
  image: string;
  badge: "launch" | "pct";
  pct?: number;
  date: number;
};

const PACKS: Pack[] = [
  { cat: "plant", flavour: "assorted", price: 525, compareAt: 600, name: "Plant Protein – Assorted Flavor Travel Pack Sachets", sachetInfo: "4 × 35g sachets · All flavours", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&fit=crop", badge: "launch", date: 1 },
  { cat: "plant", flavour: "coffee", price: 699, compareAt: 800, name: "Plant Protein - Single Coffee Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&fit=crop", badge: "pct", pct: 13, date: 2 },
  { cat: "plant", flavour: "chocolate", price: 699, compareAt: 800, name: "Plant Protein - Single Chocolate Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Chocolate", image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&q=80&fit=crop", badge: "pct", pct: 13, date: 3 },
  { cat: "plant", flavour: "vanilla", price: 699, compareAt: 800, name: "Plant Protein - Single Vanilla Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Vanilla", image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=80&fit=crop", badge: "pct", pct: 13, date: 4 },
  { cat: "plant", flavour: "unflavoured", price: 699, compareAt: 800, name: "Plant Protein - Single Unflavoured Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Unflavoured", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop", badge: "pct", pct: 13, date: 5 },
  { cat: "wpi", flavour: "assorted", price: 1299, compareAt: 1400, name: "Whey Protein - Assorted Flavor Travel Pack Sachets", sachetInfo: "4 × 35g sachets · All flavours", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&fit=crop", badge: "launch", date: 6 },
  { cat: "wpi", flavour: "coffee", price: 1725, compareAt: 2000, name: "Whey Protein - Single Coffee Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Coffee", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&q=80&fit=crop", badge: "pct", pct: 14, date: 7 },
  { cat: "wpi", flavour: "chocolate", price: 1725, compareAt: 2000, name: "Whey Protein - Single Chocolate Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Chocolate", image: "https://images.unsplash.com/photo-1612200900624-56e2eb3c7561?w=600&q=80&fit=crop", badge: "pct", pct: 14, date: 8 },
  { cat: "wpi", flavour: "vanilla", price: 1725, compareAt: 2000, name: "Whey Protein - Single Vanilla Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Vanilla", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop", badge: "pct", pct: 14, date: 9 },
  { cat: "wpi", flavour: "unflavoured", price: 1725, compareAt: 2000, name: "Whey Protein - Single Unflavoured Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Unflavoured", image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600&q=80&fit=crop", badge: "pct", pct: 14, date: 10 },
  { cat: "wpc", flavour: "assorted", price: 699, compareAt: 900, name: "Whey Protein – Assorted Flavor Travel Pack Sachets", sachetInfo: "4 × 35g sachets · All flavours", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&fit=crop", badge: "launch", date: 11 },
  { cat: "wpc", flavour: "coffee", price: 899, compareAt: 1500, name: "Whey Protein - Single Coffee Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&fit=crop", badge: "pct", pct: 40, date: 12 },
  { cat: "wpc", flavour: "chocolate", price: 899, compareAt: 1500, name: "Whey Protein - Single Chocolate Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Chocolate", image: "https://images.unsplash.com/photo-1627467959547-dc9b5bfda8e2?w=600&q=80&fit=crop", badge: "pct", pct: 40, date: 13 },
  { cat: "wpc", flavour: "vanilla", price: 899, compareAt: 1500, name: "Whey Protein - Single Vanilla Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Vanilla", image: "https://images.unsplash.com/photo-1627467959547-dc9b5bfda8e2?w=600&q=80&fit=crop", badge: "pct", pct: 40, date: 14 },
  { cat: "wpc", flavour: "unflavoured", price: 899, compareAt: 1500, name: "Whey Protein - Single Unflavoured Flavor Travel Pack Sachets", sachetInfo: "8 × 35g sachets · Unflavoured", image: "https://images.unsplash.com/photo-1627467959547-dc9b5bfda8e2?w=600&q=80&fit=crop", badge: "pct", pct: 40, date: 15 },
];

const CAT_LABEL: Record<Cat, string> = { plant: "Plant Protein", wpi: "Whey Protein", wpc: "Whey Protein" };
const TAG_LABEL: Record<Cat, string> = { plant: "Plant Protein", wpi: "WPI", wpc: "WPC" };
const FLAVOUR_LABEL: Record<Flavour, string> = {
  assorted: "Assorted",
  coffee: "Coffee",
  chocolate: "Chocolate",
  vanilla: "Vanilla",
  unflavoured: "Unflavoured",
};

type SortMethod = "featured" | "best-selling" | "a-z" | "z-a" | "price-low" | "price-high" | "date-old" | "date-new";

export default function TravelPacksPage() {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [flavourOpen, setFlavourOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [mobFilterOpen, setMobFilterOpen] = useState(false);
  const [flavExpanded, setFlavExpanded] = useState(false);
  const [cats, setCats] = useState<Set<Cat>>(new Set());
  const [flavs, setFlavs] = useState<Set<Flavour>>(new Set());
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2069);
  const [sort, setSort] = useState<SortMethod>("featured");
  const [addedIdx, setAddedIdx] = useState<number | null>(null);

  function toggleCat(c: Cat) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }
  function toggleFlav(f: Flavour) {
    setFlavs((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  const visible = useMemo(() => {
    return PACKS.map((p, i) => ({ p, i })).filter(({ p }) => {
      const catMatch = cats.size === 0 || cats.has(p.cat);
      const flavMatch = flavs.size === 0 || flavs.has(p.flavour);
      const priceMatch = p.price >= priceMin && p.price <= priceMax;
      return catMatch && flavMatch && priceMatch;
    });
  }, [cats, flavs, priceMin, priceMax]);

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
    setCats(new Set());
    setFlavs(new Set());
    setPriceMin(0);
    setPriceMax(2069);
  }

  function addToCart(i: number) {
    setAddedIdx(i);
    setTimeout(() => setAddedIdx(null), 2000);
  }

  const categoryFilters = (
    <>
      <label className="filter-option">
        <input type="checkbox" checked={cats.has("plant")} onChange={() => toggleCat("plant")} />
        <label>
          Plant Protein <span className="count">(5)</span>
        </label>
      </label>
      <label className="filter-option">
        <input type="checkbox" checked={cats.has("wpc")} onChange={() => toggleCat("wpc")} />
        <label>
          Whey Protein <span className="count">(5)</span>
        </label>
      </label>
      <label className="filter-option">
        <input type="checkbox" checked={cats.has("wpi")} onChange={() => toggleCat("wpi")} />
        <label>
          Whey Protein <span className="count">(5)</span>
        </label>
      </label>
    </>
  );

  const flavourFilters = (
    <>
      {(["chocolate", "coffee", "unflavoured", "vanilla", "assorted"] as Flavour[]).map((f) => (
        <label className="filter-option" key={f}>
          <input type="checkbox" checked={flavs.has(f)} onChange={() => toggleFlav(f)} />
          <label>
            {FLAVOUR_LABEL[f]} <span className="count">(3)</span>
          </label>
        </label>
      ))}
      {flavExpanded && (
        <label className="filter-option">
          <input type="checkbox" disabled />
          <label>
            Single Flavour <span className="count">(12)</span>
          </label>
        </label>
      )}
      <button className="show-more-btn" onClick={() => setFlavExpanded((v) => !v)}>
        {flavExpanded ? "Show less" : "Show more"}
      </button>
    </>
  );

  const activeChips = [
    ...[...cats].map((c) => ({ label: CAT_LABEL[c], onClear: () => toggleCat(c) })),
    ...[...flavs].map((f) => ({ label: `Flavour: ${FLAVOUR_LABEL[f]}`, onClear: () => toggleFlav(f) })),
  ];

  return (
    <div>
      <ScrollReveal />

      <section className="collection-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop" alt="B-Complex" />
        <div className="collection-hero-overlay">
          <h1 className="collection-hero-title">On The Go Travel Pack</h1>
          <p className="hero-sub">8 × 35g sachets · Take your nutrition anywhere</p>
        </div>
      </section>

      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href="/all-products">Collections</Link>
        <span className="sep">/</span>
        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>On The Go Travel Pack</span>
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
            <div className="filter-options open">{categoryFilters}</div>
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
            <div className={`filter-group-title${categoryOpen ? " open" : ""}`} onClick={() => setCategoryOpen((v) => !v)}>
              Category <span className="chevron">▲</span>
            </div>
            <div className={`filter-options${categoryOpen ? " open" : ""}`}>{categoryFilters}</div>
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
                    max={2069}
                    placeholder="From"
                    onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    value={priceMax}
                    min={0}
                    max={2069}
                    placeholder="To"
                    onChange={(e) => setPriceMax(Number(e.target.value) || 2069)}
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
                  <span className={`protein-tag tag-${p.cat}`}>{TAG_LABEL[p.cat]}</span>
                </div>
                <div className="product-body">
                  <div className="product-title">{p.name}</div>
                  <div className="sachet-info">{p.sachetInfo}</div>
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

          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn next">Next ›</button>
          </div>
        </main>
      </div>

      <div className="travel-strip">
        <div className="travel-strip-inner">
          <div className="reveal">
            <div className="ts-icon">✈️</div>
            <div className="ts-head">Airport-friendly</div>
            <div className="ts-body">Pre-measured sachets pass security without any hassle</div>
          </div>
          <div className="reveal">
            <div className="ts-icon">🎒</div>
            <div className="ts-head">Gym bag ready</div>
            <div className="ts-body">Toss a sachet in your bag — no scoops, no mess, no over-packing</div>
          </div>
          <div className="reveal">
            <div className="ts-icon">⚖️</div>
            <div className="ts-head">35g per sachet</div>
            <div className="ts-body">Exactly one serving. Same formula as the full-size tub</div>
          </div>
          <div className="reveal">
            <div className="ts-icon">🌿</div>
            <div className="ts-head">3 protein types</div>
            <div className="ts-body">WPI, WPC, and Plant Protein — all available in travel format</div>
          </div>
        </div>
      </div>
    </div>
  );
}
