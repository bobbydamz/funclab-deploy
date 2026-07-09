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
  hasSizeToggle: boolean;
  rating?: { stars: string; count: number };
};

const PRODUCTS: Product[] = [
  {
    flavour: "chocolate",
    name: "Whey Protein – Chocolate",
    image: "https://images.unsplash.com/photo-1627467959547-dc9b5bfda8e2?w=600&q=80&fit=crop",
    price: 1450,
    compareAt: 1700,
    date: 1,
    hasSizeToggle: true,
    rating: { stars: "★★★★★", count: 2 },
  },
  {
    flavour: "vanilla",
    name: "Whey Protein – Vanilla",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&q=80&fit=crop",
    price: 1450,
    compareAt: 1700,
    date: 2,
    hasSizeToggle: true,
  },
  {
    flavour: "coffee",
    name: "Whey Protein – Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&fit=crop",
    price: 1450,
    compareAt: 1700,
    date: 3,
    hasSizeToggle: true,
  },
  {
    flavour: "unflavoured",
    name: "Whey Protein – Unflavored",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&fit=crop",
    price: 1450,
    compareAt: 1700,
    date: 4,
    hasSizeToggle: true,
  },
  {
    flavour: "assorted",
    name: "Whey Protein – Assorted Travel Pack Sachets",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&fit=crop",
    price: 450,
    compareAt: 525,
    date: 5,
    hasSizeToggle: false,
  },
];

const FLAVOUR_LABEL: Record<Flavour, string> = {
  chocolate: "Chocolate",
  vanilla: "Vanilla",
  coffee: "Coffee",
  unflavoured: "Unflavored",
  assorted: "Assorted",
};

type SortMethod = "featured" | "best-selling" | "a-z" | "z-a" | "price-low" | "price-high" | "date-old" | "date-new";

// The original site only wired the 500g/1kg size toggle's price swap on the first
// (Chocolate) card — the other three flavour cards render identical-looking buttons with
// no click handler at all, a dead/broken feature. Preserved verbatim rather than fixed.
export default function WheyConcentratePage() {
  const [flavourOpen, setFlavourOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [mobFilterOpen, setMobFilterOpen] = useState(false);
  const [flavs, setFlavs] = useState<Set<Flavour>>(new Set());
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2850);
  const [sort, setSort] = useState<SortMethod>("featured");
  const [notified, setNotified] = useState<number | null>(null);
  const [chocSize, setChocSize] = useState<"500g" | "1kg">("500g");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);

  function toggleFlav(f: Flavour) {
    setFlavs((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  const priceFor = (p: Product) => {
    if (p.flavour === "chocolate") return chocSize === "500g" ? p.price : 2850;
    return p.price;
  };
  const compareForChoc = chocSize === "500g" ? 1700 : 3200;

  const visible = useMemo(() => {
    return PRODUCTS.map((p, i) => ({ p, i })).filter(({ p }) => {
      const flavMatch = flavs.size === 0 || flavs.has(p.flavour);
      const price = priceFor(p);
      const priceMatch = price >= priceMin && price <= priceMax;
      return flavMatch && priceMatch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flavs, priceMin, priceMax, chocSize]);

  const sorted = useMemo(() => {
    const list = [...visible];
    if (sort === "a-z") list.sort((a, b) => a.p.name.localeCompare(b.p.name));
    else if (sort === "z-a") list.sort((a, b) => b.p.name.localeCompare(a.p.name));
    else if (sort === "price-low") list.sort((a, b) => priceFor(a.p) - priceFor(b.p));
    else if (sort === "price-high") list.sort((a, b) => priceFor(b.p) - priceFor(a.p));
    else if (sort === "date-old") list.sort((a, b) => a.p.date - b.p.date);
    else if (sort === "date-new") list.sort((a, b) => b.p.date - a.p.date);
    else list.sort((a, b) => a.p.date - b.p.date);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, sort]);

  function clearAllFilters() {
    setFlavs(new Set());
    setPriceMin(0);
    setPriceMax(2850);
  }

  function notify(i: number) {
    setNotified(i);
    setTimeout(() => setNotified(null), 3000);
  }

  function submitNotify() {
    if (!notifyEmail.includes("@")) return;
    setNotifySuccess(true);
    setNotifyEmail("");
  }

  const flavourFilters = (
    <>
      {(["chocolate", "vanilla", "coffee", "unflavoured", "assorted"] as Flavour[]).map((f) => (
        <label className="filter-option" key={f}>
          <input type="checkbox" checked={flavs.has(f)} onChange={() => toggleFlav(f)} />
          <label>
            {FLAVOUR_LABEL[f]} <span className="count">(1)</span>
          </label>
        </label>
      ))}
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
        <span className="sep">/</span>
        <Link href="/all-products">Collections</Link>
        <span className="sep">/</span>
        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Whey Protein</span>
      </nav>

      <div className="sold-out-notice">
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>All Whey Protein flavours are currently sold out. Sign up below to get notified when we restock.</span>
      </div>

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
                  Whey Protein <span className="count">(5)</span>
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
                  Whey Protein <span className="count">(5)</span>
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
                    max={2850}
                    placeholder="From"
                    onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    value={priceMax}
                    min={0}
                    max={2850}
                    placeholder="To"
                    onChange={(e) => setPriceMax(Number(e.target.value) || 2850)}
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
            {sorted.map(({ p, i }) => {
              const isChoc = p.flavour === "chocolate";
              const price = priceFor(p);
              const compareAt = isChoc ? compareForChoc : p.compareAt;
              return (
                <div className="product-card reveal" key={i}>
                  <div className="product-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <span className="product-badge badge-sold">Sold out</span>
                  </div>
                  <div className="product-body">
                    <div className="product-title">{p.name}</div>
                    {p.rating && (
                      <div className="product-rating">
                        <span className="stars">{p.rating.stars}</span>
                        <span className="rating-count">({p.rating.count})</span>
                      </div>
                    )}
                    {p.hasSizeToggle && (
                      <div className="size-toggle">
                        {isChoc ? (
                          <>
                            <button
                              className={`size-btn${chocSize === "500g" ? " active" : ""}`}
                              onClick={() => setChocSize("500g")}
                            >
                              500g
                            </button>
                            <button
                              className={`size-btn${chocSize === "1kg" ? " active" : ""}`}
                              onClick={() => setChocSize("1kg")}
                            >
                              1kg
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="size-btn active">500g</button>
                            <button className="size-btn">1kg</button>
                          </>
                        )}
                      </div>
                    )}
                    <div className="price-row">
                      <span className="price-sale">Rs. {price.toLocaleString("en-IN")}.00</span>
                      <span className="price-compare">Rs. {compareAt.toLocaleString("en-IN")}.00</span>
                    </div>
                    <button className="atc-btn" disabled>
                      Sold out
                    </button>
                    <button className="notify-btn" onClick={() => notify(i)}>
                      {notified === i ? "✓ You're on the list!" : "Notify Me When Available"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <div className="wpc-strip">
        <div className="wpc-strip-inner">
          <div className="reveal">
            <div className="stat-num">25–26g</div>
            <div className="stat-unit">Protein per scoop</div>
            <div className="stat-label">Grass-fed WPC</div>
          </div>
          <div className="reveal">
            <div className="stat-num">0g</div>
            <div className="stat-unit">Added sugar</div>
            <div className="stat-label">No artificial sweeteners</div>
          </div>
          <div className="reveal">
            <div className="stat-num">100%</div>
            <div className="stat-unit">Single-source</div>
            <div className="stat-label">Never blended</div>
          </div>
          <div className="reveal">
            <div className="stat-num">5.98g</div>
            <div className="stat-unit">BCAAs per serving</div>
            <div className="stat-label">+ Digestive enzymes</div>
          </div>
        </div>
      </div>

      <div className="notify-section reveal">
        <h3>Get Notified When We Restock</h3>
        <p>Our Whey Protein has sold out due to overwhelming demand. Drop your email below and you&apos;ll be the first to know when it&apos;s back.</p>
        <div className="notify-form">
          <input
            type="email"
            placeholder="your@email.com"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
          />
          <button onClick={submitNotify}>Notify Me</button>
        </div>
        {notifySuccess && (
          <p style={{ marginTop: 14, fontSize: 13, color: "#2d6a4f" }}>
            ✓ You&apos;re on the list! We&apos;ll email you when WPC is back.
          </p>
        )}
      </div>
    </div>
  );
}
