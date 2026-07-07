"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const BOTTLES = [
  {
    name: "Balance",
    image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&q=80&fit=crop",
    tagline: "“Train hard. Recover harder. Stay balanced.”",
  },
  {
    name: "Honest",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80&fit=crop",
    tagline: "“No shortcuts. No excuses. Just honest work.”",
  },
  {
    name: "Functional",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80&fit=crop",
    tagline: "“Form follows function. Always.”",
  },
];

export default function MerchandisePage() {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [mobFilterOpen, setMobFilterOpen] = useState(false);
  const [notified, setNotified] = useState<number | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);

  function notifyMe(i: number) {
    setNotified(i);
    setTimeout(() => setNotified(null), 3000);
  }

  function submitNotify() {
    if (!notifyEmail.trim() || !notifyEmail.includes("@")) return;
    setNotifyEmail("");
    setNotifySuccess(true);
    setTimeout(() => setNotifySuccess(false), 5000);
  }

  return (
    <div>
      <ScrollReveal />

      {/* HERO — mislabeled in the original site (bottle merch page, Vitamin D-3+K2 hero
          copy); preserved verbatim rather than fixed silently. */}
      <section className="collection-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&fit=crop"
          alt="Vitamin D-3 + K2"
        />
        <div className="collection-hero-overlay">
          <h1 className="collection-hero-title">Vitamin D-3 + K2</h1>
          <p className="hero-sub">BioHAK Wellness Bottle — built for function</p>
        </div>
      </section>

      <div className="sold-out-notice">
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>All BioHAK Wellness Bottles are currently sold out. Sign up below to get notified when we restock.</span>
      </div>

      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href="/all-products">Collections</Link>
        <span className="sep">/</span>
        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Vitamin D-3 + K2</span>
      </nav>

      <div
        className={`mob-filter-drawer${mobFilterOpen ? " open" : ""}`}
      >
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
                  Bottle <span className="count">(3)</span>
                </label>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="collection-wrap">
        <aside className="sidebar">
          <div className="filter-header">
            <h2>Filter</h2>
            <button className="filter-clear-all">Clear all</button>
          </div>

          <div className="filter-group">
            <div className={`filter-group-title${categoryOpen ? " open" : ""}`} onClick={() => setCategoryOpen((v) => !v)}>
              Category <span className="chevron">▲</span>
            </div>
            <div className={`filter-options${categoryOpen ? " open" : ""}`}>
              <label className="filter-option">
                <input type="checkbox" checked disabled readOnly />
                <label>
                  Bottle <span className="count">(3)</span>
                </label>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <div className={`filter-group-title${priceOpen ? " open" : ""}`} onClick={() => setPriceOpen((v) => !v)}>
              Price <span className="chevron">▲</span>
            </div>
            <div className={`filter-options${priceOpen ? " open" : ""}`}>
              <div className="price-range-wrap">
                <div className="price-display">Price: Rs. 0 – Rs. 999</div>
                <div className="price-inputs">
                  <span>₹</span>
                  <input type="number" defaultValue={0} min={0} max={999} placeholder="From" />
                  <span>–</span>
                  <input type="number" defaultValue={999} min={0} max={999} placeholder="To" />
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

          <div className="sort-bar">
            <span className="product-count">3 products</span>
            <div className="sort-select-wrap">
              <span className="sort-label">Sort by</span>
              <select className="sort-select" defaultValue="featured">
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="a-z">Alphabetically, A–Z</option>
                <option value="z-a">Alphabetically, Z–A</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {BOTTLES.map((b, i) => (
              <div className="product-card reveal" key={b.name}>
                <div className="product-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={`BioHAK Wellness Bottle - ${b.name}`} loading="lazy" />
                  <span className="badge-sold">Sold out</span>
                  <div className="bottle-name-tag">{b.name}</div>
                </div>
                <div className="product-body">
                  <div className="product-title">BioHAK Wellness Bottle – {b.name}</div>
                  <div className="bottle-tagline">{b.tagline}</div>
                  <div className="price-row">
                    <span className="price-sale">Rs. 999.00</span>
                  </div>
                  <button className={`notify-btn${notified === i ? " notified" : ""}`} onClick={() => notifyMe(i)}>
                    {notified === i ? "✓ You're on the list!" : "Notify Me When Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="features-strip">
        <div className="features-strip-inner">
          <div className="reveal">
            <div className="feat-icon">💧</div>
            <div className="feat-head">Leak-proof</div>
            <div className="feat-body">Secure seal — no drips in your gym bag or commute bag</div>
          </div>
          <div className="reveal">
            <div className="feat-icon">🧊</div>
            <div className="feat-head">BPA-free</div>
            <div className="feat-body">Food-grade materials, safe for protein shakes and omega-3-algal</div>
          </div>
          <div className="reveal">
            <div className="feat-icon">✍️</div>
            <div className="feat-head">A word on each</div>
            <div className="feat-body">Balance. Honest. Functional. Three words we live by</div>
          </div>
          <div className="reveal">
            <div className="feat-icon">🧴</div>
            <div className="feat-head">Wide mouth</div>
            <div className="feat-body">Easy to fill, easy to clean — designed to be used daily</div>
          </div>
        </div>
      </div>

      <div className="notify-section reveal">
        <h2>Get Notified When Bottles Restock</h2>
        <p>All three bottles sold out fast. Leave your email and we&apos;ll reach out the moment they&apos;re back — no spam, just one email.</p>
        <div className="notify-form">
          <input
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
          />
          <button onClick={submitNotify}>Notify Me</button>
        </div>
        <div className={`notify-success${notifySuccess ? " show" : ""}`}>
          ✓ You&apos;re on the list! We&apos;ll email you when bottles restock.
        </div>
      </div>

      <div className="brand-story">
        <div className="brand-story-inner reveal">
          <h2>More Than a Shaker</h2>
          <p>
            BioHAK Wellness Bottle wasn&apos;t designed to sit on a shelf. It was designed to be used — at 5am before
            your first set, on the commute home, and everywhere in between.
          </p>
          <p>
            Each bottle carries one word: <strong>Balance</strong>, <strong>Honest</strong>, or{" "}
            <strong>Functional</strong>. Three words that define how we think about nutrition, training, and life.
            Pick the one that resonates, or collect all three.
          </p>
          <p>Included in our Essentials and Training Bundles. Sold separately when in stock.</p>
        </div>
      </div>
    </div>
  );
}
