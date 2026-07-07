"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

type Cat =
  | "essentials-whey"
  | "essentials-plant"
  | "training-whey"
  | "training-plant"
  | "performance-whey"
  | "performance-plant";

type Bundle = {
  cat: Cat;
  price: number;
  compareAt: number;
  savings: number;
  name: string;
  type: string;
  image: string;
  pct: number;
  inside: string[];
  soldOut?: boolean;
  date: number;
};

const BUNDLES: Bundle[] = [
  {
    cat: "essentials-whey",
    price: 4845,
    compareAt: 5700,
    savings: 855,
    name: "Essentials Bundle – Whey Protein",
    type: "Essentials Bundle",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&fit=crop",
    pct: 15,
    inside: ["WPI Chocolate", "Omega-3 (Algal) Assorted", "BioHAK Wellness Bottle"],
    date: 1,
  },
  {
    cat: "essentials-plant",
    price: 2465,
    compareAt: 3800,
    savings: 1335,
    name: "Essentials Bundle – Plant Protein",
    type: "Essentials Bundle",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fit=crop",
    pct: 35,
    inside: ["Plant Protein Chocolate", "Omega-3 (Algal) Assorted"],
    date: 2,
  },
  {
    cat: "training-whey",
    price: 6075,
    compareAt: 7200,
    savings: 1125,
    name: "Training Bundle – Whey Protein",
    type: "Training Bundle",
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800&q=80&fit=crop",
    pct: 16,
    inside: ["WPI Chocolate", "Omega-3 (Algal) Assorted", "WPI Travel Pack", "BioHAK Wellness Bottle"],
    date: 3,
  },
  {
    cat: "training-plant",
    price: 2965,
    compareAt: 4400,
    savings: 1435,
    name: "Training Bundle – Plant Protein",
    type: "Training Bundle",
    image: "https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=600&q=80&fit=crop",
    pct: 33,
    inside: ["Plant Protein Chocolate", "Omega-3 (Algal) Assorted", "Plant Protein Travel Pack"],
    date: 4,
  },
  {
    cat: "performance-whey",
    price: 5785,
    compareAt: 6700,
    savings: 915,
    name: "Performance Bundle – Whey Protein",
    type: "Performance Bundle",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80&fit=crop",
    pct: 14,
    inside: ["WPI Chocolate", "Omega-3 (Algal) Assorted", "WPI Travel Pack", "BioHAK Wellness Bottle"],
    soldOut: true,
    date: 5,
  },
  {
    cat: "performance-plant",
    price: 3399,
    compareAt: 4800,
    savings: 1401,
    name: "Performance Bundle – Plant Protein",
    type: "Performance Bundle",
    image: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=600&q=80&fit=crop",
    pct: 29,
    inside: ["Plant Protein Chocolate", "Omega-3 (Algal) Assorted", "Plant Protein Travel Pack"],
    soldOut: true,
    date: 6,
  },
];

const CAT_LABEL: Record<Cat, string> = {
  "essentials-whey": "Essentials – Whey",
  "essentials-plant": "Essentials – Plant",
  "training-whey": "Training – Whey",
  "training-plant": "Training – Plant",
  "performance-whey": "Performance – Whey",
  "performance-plant": "Performance – Plant",
};

// The original site's "Flavours" filters were never wired to applyFilters() — they
// toggle visually but never actually filter the grid. Preserved as decorative, not fixed.
const FLAVOUR_OPTIONS = [
  { value: "chocolate", label: "Chocolate", count: 6 },
  { value: "omega-3-algal", label: "Omega-3 (Algal)", count: 6 },
  { value: "wpi", label: "Whey Protein", count: 3 },
  { value: "bottle", label: "BioHAK Wellness bottle", count: 2 },
];
const FLAVOUR_EXTRA = [
  { value: "plant", label: "Plant Protein", count: 3 },
  { value: "pp-travel", label: "Plant Protein travel packs", count: 1 },
  { value: "wpi-travel", label: "WPI travel packs", count: 1 },
];

type SortMethod = "featured" | "best-selling" | "a-z" | "z-a" | "price-low" | "price-high" | "date-old" | "date-new";

export default function ValueBundlesPage() {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [flavourOpen, setFlavourOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [mobFilterOpen, setMobFilterOpen] = useState(false);
  const [flavExpanded, setFlavExpanded] = useState(false);
  const [cats, setCats] = useState<Set<Cat>>(new Set());
  const [flavs, setFlavs] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(6075);
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
  function toggleFlav(f: string) {
    setFlavs((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  const visible = useMemo(() => {
    return BUNDLES.map((b, i) => ({ b, i })).filter(({ b }) => {
      const catMatch = cats.size === 0 || cats.has(b.cat);
      const priceMatch = b.price >= priceMin && b.price <= priceMax;
      return catMatch && priceMatch;
    });
  }, [cats, priceMin, priceMax]);

  const sorted = useMemo(() => {
    const list = [...visible];
    if (sort === "a-z") list.sort((a, b) => a.b.name.localeCompare(b.b.name));
    else if (sort === "z-a") list.sort((a, b) => b.b.name.localeCompare(a.b.name));
    else if (sort === "price-low") list.sort((a, b) => a.b.price - b.b.price);
    else if (sort === "price-high") list.sort((a, b) => b.b.price - a.b.price);
    else if (sort === "date-old") list.sort((a, b) => a.b.date - b.b.date);
    else if (sort === "date-new") list.sort((a, b) => b.b.date - a.b.date);
    else list.sort((a, b) => a.b.date - b.b.date);
    return list;
  }, [visible, sort]);

  function clearAllFilters() {
    setCats(new Set());
    setFlavs(new Set());
    setPriceMin(0);
    setPriceMax(6075);
  }

  function addToCart(i: number) {
    setAddedIdx(i);
    setTimeout(() => setAddedIdx(null), 2000);
  }

  const categoryFilters = (
    <>
      {(Object.keys(CAT_LABEL) as Cat[]).map((c) => (
        <label className="filter-option" key={c}>
          <input type="checkbox" checked={cats.has(c)} onChange={() => toggleCat(c)} />
          <label>
            {CAT_LABEL[c]} <span className="count">(1)</span>
          </label>
        </label>
      ))}
    </>
  );

  const flavourFilters = (
    <>
      {FLAVOUR_OPTIONS.map((f) => (
        <label className="filter-option" key={f.value}>
          <input type="checkbox" checked={flavs.has(f.value)} onChange={() => toggleFlav(f.value)} />
          <label>
            {f.label} <span className="count">({f.count})</span>
          </label>
        </label>
      ))}
      {flavExpanded &&
        FLAVOUR_EXTRA.map((f) => (
          <label className="filter-option" key={f.value}>
            <input type="checkbox" checked={flavs.has(f.value)} onChange={() => toggleFlav(f.value)} />
            <label>
              {f.label} <span className="count">({f.count})</span>
            </label>
          </label>
        ))}
      <button className="show-more-btn" onClick={() => setFlavExpanded((v) => !v)}>
        {flavExpanded ? "Show less" : "Show more"}
      </button>
    </>
  );

  const activeChips = [...cats].map((c) => ({ label: CAT_LABEL[c], onClear: () => toggleCat(c) }));

  return (
    <div>
      <ScrollReveal />

      {/* HERO — mislabeled in the original site (this is the bundles page, "Multivitamins"
          hero copy); preserved verbatim rather than fixed silently. */}
      <section className="collection-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop" alt="Multivitamins" />
        <div className="collection-hero-overlay">
          <h1 className="collection-hero-title">Multivitamins</h1>
          <p className="hero-sub">Stack your savings · Save up to 35%</p>
        </div>
      </section>

      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href="/all-products">Collections</Link>
        <span className="sep">/</span>
        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Multivitamins</span>
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
                    max={6075}
                    placeholder="From"
                    onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    value={priceMax}
                    min={0}
                    max={6075}
                    placeholder="To"
                    onChange={(e) => setPriceMax(Number(e.target.value) || 6075)}
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
            {sorted.map(({ b, i }) => (
              <div className={`product-card reveal${b.soldOut ? " is-sold-out" : ""}`} key={i}>
                <div className="product-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={b.name} loading="lazy" />
                  {b.soldOut ? (
                    <span className="product-badge badge-sold">Sold out</span>
                  ) : (
                    <span className="product-badge badge-pct">–{b.pct}%</span>
                  )}
                </div>
                <div className="whats-inside">
                  {b.inside.map((tag) => (
                    <span className="inside-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="product-body">
                  <div className="bundle-type">{b.type}</div>
                  <div className="product-title">{b.name}</div>
                  <div className="price-row">
                    <span className="price-sale">Rs. {b.price.toLocaleString("en-IN")}.00</span>
                    <span className="price-compare">Rs. {b.compareAt.toLocaleString("en-IN")}.00</span>
                    <span className="savings-tag">Save Rs. {b.savings.toLocaleString("en-IN")}</span>
                  </div>
                  {b.soldOut ? (
                    <button className="atc-btn sold-out" disabled>
                      Sold out
                    </button>
                  ) : (
                    <button className={`atc-btn${addedIdx === i ? " added" : ""}`} onClick={() => addToCart(i)}>
                      {addedIdx === i ? "✓ Added" : "Add To Cart"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="savings-strip">
        <div className="savings-strip-inner">
          <div className="reveal">
            <div className="sv-num">Up to 35%</div>
            <div className="sv-label">Off vs. buying separately</div>
          </div>
          <div className="reveal">
            <div className="sv-num">6</div>
            <div className="sv-label">Bundles to choose from</div>
          </div>
          <div className="reveal">
            <div className="sv-num">Rs. 1,435</div>
            <div className="sv-label">Maximum savings per bundle</div>
          </div>
        </div>
      </div>

      <div className="compare-section reveal">
        <h2>Which Bundle Is Right For You?</h2>
        <p className="sub">Every bundle includes Omega-3 (Algal) Assorted. Pick your protein and your tier.</p>
        <table className="compare-table">
          <thead>
            <tr>
              <th>What&apos;s included</th>
              <th>
                Essentials <span className="tier-label tier-essentials">Starter</span>
              </th>
              <th>
                Training <span className="tier-label tier-training">Popular</span>
              </th>
              <th>
                Performance <span className="tier-label tier-performance">Best value</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Protein tub (500g)</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
            </tr>
            <tr>
              <td>Omega-3 (Algal) canister</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
            </tr>
            <tr>
              <td>Travel pack sachets (8×)</td>
              <td className="dash">—</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
            </tr>
            <tr>
              <td>BioHAK Wellness Bottle (Whey only)</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
              <td className="check">✓</td>
            </tr>
            <tr>
              <td>Whey version price</td>
              <td className="bundle-col-head">Rs. 4,845</td>
              <td className="bundle-col-head">Rs. 6,075</td>
              <td className="bundle-col-head">Rs. 5,785</td>
            </tr>
            <tr>
              <td>Plant version price</td>
              <td className="bundle-col-head">Rs. 2,465</td>
              <td className="bundle-col-head">Rs. 2,965</td>
              <td className="bundle-col-head">Rs. 3,399</td>
            </tr>
            <tr>
              <td>Savings vs. individual</td>
              <td>–15% / –35%</td>
              <td>–16% / –33%</td>
              <td>–14% / –29%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
