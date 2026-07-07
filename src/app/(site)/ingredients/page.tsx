import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import "./ingredients.css";

export const metadata: Metadata = {
  title: "Ingredients — BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

const FREE_FROM_ICON = (
  <svg viewBox="0 0 48 48">
    <path d="M24 8C15 8 8 15 8 24s7 16 16 16 16-7 16-16S33 8 24 8z" />
    <path d="M16 16l16 16M32 16L16 32" />
  </svg>
);

const PROTEIN_ITEMS = [
  {
    title: "Whey Protein Concentrate",
    desc: "Sourced from pasture-raised cows. Gently processed, retaining a full amino acid profile to support recovery, energy, and immune health.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16S8 32.8 8 24z" />
        <path d="M24 14v10l6 4" />
      </svg>
    ),
  },
  {
    title: "Whey Protein Isolate",
    desc: "Ultra-purified for maximum protein, minimum lactose, fat, and carbs. Ideal for lean goals and easy digestion.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8l4 32M32 8l4 32M8 20h32M8 28h32" />
      </svg>
    ),
  },
  {
    title: "Pea Protein",
    desc: "The plant-based MVP. High in BCAAs and iron, naturally easy on digestion. Perfect for dairy-free lifestyles.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8C15 8 8 15 8 24s7 16 16 16 16-7 16-16S33 8 24 8z" />
        <path d="M20 24l3 3 6-6" />
      </svg>
    ),
  },
  {
    title: "Rice Protein",
    desc: "Complements pea protein to complete the amino acid profile. Together they make a plant-based formula your body can actually use.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
      </svg>
    ),
  },
  {
    title: "Bromelain & Papain (Digestive Enzymes)",
    desc: "From pineapple and papaya — these enzymes break down protein so you absorb more, feel less bloated, and recover smoother.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="16" />
        <path d="M16 24h16M24 16v16" />
      </svg>
    ),
  },
  {
    title: "Natural Flavours & Stevia",
    desc: "Real fruit-inspired taste. Zero artificial nonsense. Stevia brings clean sweetness with no sugar spikes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8c-8 0-14 8-14 16s6 16 14 16 14-8 14-16S32 8 24 8z" />
        <path d="M18 24s2 4 6 4 6-4 6-4" />
      </svg>
    ),
  },
];

const FREE_FROM = [
  "Artificial Sweeteners",
  "Gums, Emulsifiers & Thickeners",
  "Soy, Gluten & Lactose",
  "Amino Spiking or Ingredient Fluff",
];

const VITAMIN_ITEMS = [
  {
    title: "Vitamin D3 (Cholecalciferol)",
    desc: "2000 IU to support bone density, immune function, and mood regulation — especially important for those with limited sun exposure.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8l16 8v16l-16 8-16-8V16z" />
        <path d="M24 8v32M8 16l16 8 16-8" />
      </svg>
    ),
  },
  {
    title: "Vitamin K2 (MK-7)",
    desc: "100mcg of the most bioavailable form of K2, directing calcium to bones and away from arteries.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 36s0-20 12-28c12 8 12 28 12 28" />
        <path d="M12 24h24" />
      </svg>
    ),
  },
  {
    title: "Biotin (5,000 mcg)",
    desc: "High-potency biotin for hair growth, healthy nails, and radiant skin. Essential for keratin production.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="16" />
        <path d="M24 16v8l5 5" />
      </svg>
    ),
  },
  {
    title: "B-Complex (B1–B12)",
    desc: "Complete B vitamin formula supporting energy metabolism, nervous system function, and red blood cell formation.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8h16v8l4 8-4 8H16l-4-8 4-8V8z" />
      </svg>
    ),
  },
  {
    title: "Iron + Vitamin C",
    desc: "Iron with 100mg Vitamin C for dramatically improved absorption — addressing one of India's most prevalent deficiencies.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 10c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14S31.7 10 24 10z" />
        <path d="M20 24l3 3 6-6" />
      </svg>
    ),
  },
  {
    title: "Algal Omega-3 (DHA/EPA)",
    desc: "Plant-sourced omega-3 from algae — vegan, sustainable, and just as effective as fish oil for heart and brain health.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8C15 8 8 15 8 24s7 16 16 16 16-7 16-16S33 8 24 8z" />
        <path d="M18 20c0-3.3 2.7-6 6-6s6 2.7 6 6c0 4-6 8-6 8s-6-4-6-8z" />
      </svg>
    ),
  },
];

export default function IngredientsPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-hero-blk">
        <span className="hero-label">What&apos;s Inside</span>
        <h1>Ingredients</h1>
        <p>Clean, purposeful, and backed by science.</p>
      </div>

      <div className="ing-banner reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=1920&q=85&fit=crop"
          alt="BioHAK Wellness Ingredients"
        />
      </div>

      <div className="ing-intro reveal">
        <h2>
          At BioHAK Wellness, we believe in keeping things simple — and it starts with our
          ingredient list.
        </h2>
        <p>
          <strong>No fillers. No weird stuff. Just function.</strong>
          <br />
          <br />
          At BioHAK Wellness, we keep it clean and purposeful. Every ingredient you see on our
          label has a reason to be there — to fuel your body, support performance, and keep your
          gut happy. We don&apos;t do fluff, artificial additives, or marketing gimmicks. Just
          clean, effective nutrition rooted in science.
        </p>
      </div>

      <section className="ing-section reveal">
        <div className="ing-section-inner">
          <div className="ing-banner" style={{ marginBottom: 48 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=1920&q=80&fit=crop"
              alt="Protein Powders"
              style={{ maxHeight: 360 }}
            />
          </div>
          <div className="ing-section-header">
            <h2>Protein Powders</h2>
            <p>
              <strong>Protein that powers more than just your workout.</strong>
              <br />
              Whether you&apos;re here to build, recover, fuel, or just feel better — we keep our
              protein clean, gut-friendly, and effective. No fillers, no sketchy extras. Just
              quality you can trust.
            </p>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 24 }}>
            What&apos;s Inside
          </h3>
          <div className="ing-grid">
            {PROTEIN_ITEMS.map((item) => (
              <div className="ing-item" key={item.title}>
                <div className="ing-icon">{item.icon}</div>
                <div className="ing-item-text">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ing-free-from" style={{ marginTop: 48 }}>
            <h3>Always Free From</h3>
            <div className="ing-free-grid">
              {FREE_FROM.map((label) => (
                <div className="ing-free-item" key={label}>
                  <div className="ing-free-icon">{FREE_FROM_ICON}</div>
                  <span className="ing-free-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ing-section reveal">
        <div className="ing-section-inner">
          <div className="ing-banner" style={{ marginBottom: 48 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1549560704-0ec7f045b0ba?w=1920&q=85&fit=crop"
              alt="Vitamins"
              style={{ maxHeight: 360 }}
            />
          </div>
          <div className="ing-section-header">
            <h2>Vitamins &amp; Supplements</h2>
            <p>
              <strong>Every capsule has a purpose.</strong>
              <br />
              From bone health to hair and skin — our vitamin formulations are stripped back to
              exactly what your body needs.
            </p>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 24 }}>
            Key Ingredients
          </h3>
          <div className="ing-grid">
            {VITAMIN_ITEMS.map((item) => (
              <div className="ing-item" key={item.title}>
                <div className="ing-icon">{item.icon}</div>
                <div className="ing-item-text">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ing-promise reveal">
        <h2>Transparency over trends. Function over fluff.</h2>
        <p>
          At BioHAK Wellness, every ingredient is there for a reason — and every label tells the
          whole story. We don&apos;t do gimmicks. We don&apos;t do secrets. We do clean,
          functional nutrition backed by clarity, testing, and trust.
        </p>
        <p>
          <strong>
            Because you deserve to know exactly what you&apos;re putting in your body — and why
            it works.
          </strong>
        </p>
        <a
          href="/all-products"
          style={{
            display: "inline-block",
            background: "#4bb4b4",
            color: "#fff",
            padding: "14px 36px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Shop All Products
        </a>
      </div>
    </>
  );
}
