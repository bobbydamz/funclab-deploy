"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SerializedProduct as Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import ScrollReveal from "@/components/ScrollReveal";

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

const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=85&fit=crop",
    caption: "Simple solutions for a healthier you.",
  },
  {
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?fm=jpg&q=95&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0",
    caption: "Functional. Simple. Purposeful.",
  },
  {
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=85&fit=crop",
    caption: "Rooted in function. Designed for real life.",
  },
];

// Curated order for the "Shop Our Products" grid — matches the original homepage's
// hand-picked merchandising order, not the alphabetical order products.ts returns by default.
const GRID_ORDER = [
  "b-complex",
  "multivitamins",
  "iron-vitamin-c",
  "moringa-mushroom",
  "biotin",
  "vitamin-d3-k2",
  "omega-3-algal",
  "plant-protein",
  "whey-protein",
];

const TAB_ORDER = [
  "whey-protein",
  "plant-protein",
  "omega-3-algal",
  "multivitamins",
  "vitamin-d3-k2",
  "b-complex",
  "biotin",
  "iron-vitamin-c",
  "moringa-mushroom",
];

const TAB_COPY: Record<string, { title: string; pitch: string }> = {
  "whey-protein": {
    title: "Whey Protein",
    pitch:
      "Crafted for performance with uncompromising purity. 29–30g of fast-absorbing protein per scoop, with no added sugar, no gums, and no artificial sweeteners. Enhanced with digestive enzymes for easy absorption and gut comfort.",
  },
  "plant-protein": {
    title: "Plant Protein",
    pitch:
      "27–28g of protein per scoop from 98% pea protein and 2% rice protein for a complete amino acid profile. Vegan, gut-friendly, and free from fillers, gums, and artificial additives. One of the cleanest plant proteins available.",
  },
  "omega-3-algal": {
    title: "Algal Omega-3",
    pitch:
      "Plant-sourced DHA and EPA omega-3 from algae — vegan, sustainable, and as effective as fish oil. With added Vitamin E for enhanced absorption. One capsule a day for heart, brain, and eye health.",
  },
  multivitamins: {
    title: "Daily Multivitamin",
    pitch:
      "100% RDA of core vitamins plus Zinc, Copper, and Selenium in one daily tablet. Covers the nutritional gaps most Indians face — formulated for men and women with clean, bioavailable ingredients. No fillers, no excess.",
  },
  "vitamin-d3-k2": {
    title: "Vitamin D3 + K2",
    pitch:
      "2000 IU Vitamin D3 paired with 100mcg K2 (MK-7) — the most bioavailable form. D3 builds immunity and bone density; K2 directs calcium to bones and away from arteries. 60 capsules, once daily.",
  },
  "b-complex": {
    title: "Vitamin B-Complex",
    pitch:
      "A complete B vitamin formula — B1 through B12 — in one tablet. Supports energy metabolism, nervous system function, and red blood cell formation. 120 tablets for a full 4-month supply.",
  },
  biotin: {
    title: "Biotin 5,000 mcg",
    pitch:
      "High-potency biotin for stronger hair, healthier nails, and radiant skin. 5,000 mcg per capsule — the clinically effective dose for visible results. 60 capsules, free from artificial additives.",
  },
  "iron-vitamin-c": {
    title: "Iron + Vitamin C",
    pitch:
      "Iron supplementation paired with 100mg Vitamin C for dramatically improved absorption. Addresses one of India's most prevalent deficiencies — particularly important for women, athletes, and vegetarians.",
  },
  "moringa-mushroom": {
    title: "Lions Mane Moringa + Mushroom",
    pitch:
      "A powerful blend of Lion's Mane mushroom and Moringa for vitality, cognitive support, and longevity. Rich in antioxidants and adaptogens — supporting mental clarity, immunity, and sustained energy.",
  },
};

const WHY_ITEMS = [
  {
    paths: ["M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z", "M16 24l6 6 10-12"],
    title: "Simple, Effective Formulas",
    desc: "We believe less is more. Every ingredient is carefully selected and backed by purpose — no fillers, no fluff. Just clean, functional blends that deliver best-in-class results.",
  },
  {
    paths: ["M24 4l4 8 9 1.3-6.5 6.3 1.5 9L24 24l-8 4.6 1.5-9L11 13.3l9-1.3z", "M24 34v10M18 40h12"],
    title: "Performance-First Philosophy",
    desc: "At BioHAK Wellness, functionality leads the way. Our products are designed with one goal: to perform. That means maximum impact, minimal compromise.",
  },
  {
    paths: ["M24 12v24M4 24c5 5 10 8 20 8s15-3 20-8"],
    ellipse: true,
    title: "Gut-Friendly by Design",
    desc: "Say goodbye to bloating and heaviness. Our protein blends include digestive enzymes that support smooth digestion — so you get all the power, none of the discomfort.",
  },
  {
    paths: ["M24 4l16 6v12c0 10-7 18-16 22C17 40 8 32 8 22V10z", "M17 24l5 5 9-10"],
    title: "No-Nonsense Transparency",
    desc: "We don't hide behind proprietary blends or fancy jargon. What you see is what you get — clean labels, clear benefits, and full ingredient transparency you can trust.",
  },
];

const TESTIMONIAL_SLIDES = [
  [
    {
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=70&q=80&fit=crop&crop=face",
      name: "Tanvi Takhtani",
      loc: "Mumbai",
      text: "I'm someone who's been having protein shakes for years now to meet my protein requirement. I've tried pretty much every protein powder on the market but nothing was ever \"it\". I've been having BioHAK Wellness protein powder for over a month now and i have to say - it's the best I've tried. It's super light on the gut, got the highest amount of protein per scoop, tastes good and doesn't make my skin breakout. Love having this every morning, I'm already on my second box!",
    },
    {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=70&q=80&fit=crop&crop=face",
      name: "Raghav Garg",
      loc: "Mumbai",
      text: "Great product very light which is key difference vs status quo for me.",
    },
  ],
  [
    {
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=70&q=80&fit=crop&crop=face",
      name: "Pratap Pandit",
      loc: "Mumbai",
      text: "I love BioHAK Wellness whey isolate powder because it's really light on the stomach and doesn't taste overly sweet like other protein powders. BioHAK Wellnesss' team is really passionate about fitness and nutrition and their latest whey and plant-based protein powders are a game changer.",
    },
    {
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=70&q=80&fit=crop&crop=face",
      name: "Sarah Sham",
      loc: "Mumbai",
      text: "Loved the chocolate protein - super clean, easy on my gut and most of all very very very yummy. No aftertaste and mixes extremely fast and easily. I'm sure I'll be buying repeatedly since it ticks every single box for me.",
    },
  ],
];

const INSTA_IMAGES = [
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1579722821273-0f6c1d44362f?w=600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=85&fit=crop",
];

const INSTA_ICON = (
  <svg width={28} height={28} fill="none" stroke="#fff" strokeWidth={1.5} viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
  </svg>
);

function HeroSlider() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [active, setActive] = useState(0);

  useEffect(() => {
    function goTo(n: number) {
      const idx = ((n % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;
      idxRef.current = idx;
      setActive(idx);
      if (wrapRef.current) wrapRef.current.style.transform = `translateX(-${idx * 100}%)`;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => goTo(idxRef.current + 1), 5000);
    }
    timerRef.current = setTimeout(() => goTo(idxRef.current + 1), 5000);
    return () => clearTimeout(timerRef.current);
  }, []);

  function nav(dir: number) {
    const idx = ((idxRef.current + dir) % HERO_SLIDES.length + HERO_SLIDES.length) % HERO_SLIDES.length;
    idxRef.current = idx;
    setActive(idx);
    if (wrapRef.current) wrapRef.current.style.transform = `translateX(-${idx * 100}%)`;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => nav(1), 5000);
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-slides" id="heroSlides" ref={wrapRef}>
        {HERO_SLIDES.map((s, i) => (
          <div className={`hero-slide${i === active ? " active" : ""}`} key={s.caption}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={s.caption} />
            <div className="hero-caption">
              <h2>{s.caption}</h2>
              <Link href="/all-products" className="hero-shop-btn">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      <button className="hero-prev" onClick={() => nav(-1)} aria-label="Previous slide">
        ←
      </button>
      <button className="hero-next" onClick={() => nav(1)} aria-label="Next slide">
        →
      </button>
      <div className="hero-dots">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.caption}
            className={`hero-dot${i === active ? " active" : ""}`}
            onClick={() => {
              idxRef.current = i;
              setActive(i);
              if (wrapRef.current) wrapRef.current.style.transform = `translateX(-${i * 100}%)`;
              clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => nav(1), 5000);
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function ProductsGrid({ products }: { products: Product[] }) {
  const { add } = useCart();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { productId: number }[]) => setWishlisted(new Set(items.map((i) => i.productId))))
      .catch(() => {});
  }, []);

  const ordered = GRID_ORDER.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is Product => Boolean(p)
  );

  async function toggleWishlist(productId: number) {
    const meRes = await fetch("/api/auth/me");
    if (!meRes.ok) {
      sessionStorage.setItem("funclab_redirect_after_login", "/");
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

  return (
    <section className="products-section">
      <div className="products-wrap">
        <h2 className="section-title reveal">Shop Our Products</h2>
        <div className="products-grid">
          {ordered.map((p, i) => {
            const pct = p.compareAtPrice
              ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
              : null;
            return (
              <div className={`product-card reveal d${(i % 4) + 1}`} key={p.id}>
                <div className="product-thumb">
                  <Link href={`/${p.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <button
                    className={`wish-heart${wishlisted.has(p.id) ? " active" : ""}`}
                    aria-label="Add to wishlist"
                    onClick={() => toggleWishlist(p.id)}
                  >
                    {HEART_ICON}
                  </button>
                </div>
                <div className="product-body">
                  <div className="product-title">
                    <Link href={`/${p.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {p.name}
                    </Link>
                  </div>
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
                  <div className="price-row">
                    <span className="price-sale">Rs. {p.price.toLocaleString("en-IN")}.00</span>
                    {p.compareAtPrice && (
                      <span className="price-compare">Rs. {p.compareAtPrice.toLocaleString("en-IN")}.00</span>
                    )}
                    {pct !== null && <span className="price-save">Save {pct}%</span>}
                  </div>
                  <button className={`atc-btn${addedSlug === p.slug ? " done" : ""}`} onClick={() => addToCart(p)}>
                    {addedSlug === p.slug ? "✓ Added!" : "Add To Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OurProductsTabs({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="our-products">
      <div className="our-products-wrap">
        <h2 className="section-title reveal">Our Products</h2>
        <div className="prod-tabs">
          {TAB_ORDER.map((slug, i) => (
            <button
              key={slug}
              className={`prod-tab${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              {TAB_COPY[slug].title}
            </button>
          ))}
        </div>
        <div className="prod-panels">
          {TAB_ORDER.map((slug, i) => {
            const product = products.find((p) => p.slug === slug);
            const copy = TAB_COPY[slug];
            return (
              <div className={`prod-panel${i === active ? " active" : ""}`} key={slug}>
                <div className="panel-text">
                  <h3>{copy.title}</h3>
                  <p>{copy.pitch}</p>
                  <Link href={`/${slug}`} className="shop-link">
                    Shop now
                  </Link>
                </div>
                <div className="panel-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product?.image ?? `/product-${slug}.png`} alt={copy.title} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSlider() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const idxRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const idx = (idxRef.current + 1) % TESTIMONIAL_SLIDES.length;
      idxRef.current = idx;
      setActive(idx);
      if (wrapRef.current) wrapRef.current.style.transform = `translateX(-${idx * 100}%)`;
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  function goto(n: number) {
    const idx = ((n % TESTIMONIAL_SLIDES.length) + TESTIMONIAL_SLIDES.length) % TESTIMONIAL_SLIDES.length;
    idxRef.current = idx;
    setActive(idx);
    if (wrapRef.current) wrapRef.current.style.transform = `translateX(-${idx * 100}%)`;
  }

  return (
    <section className="testimonials-section">
      <div className="testimonials-wrap">
        <h2 className="section-title reveal">What Clients Are Saying</h2>
        <div className="testimonials-slider-outer">
          <div className="testimonials-slider" id="tSlider" ref={wrapRef}>
            {TESTIMONIAL_SLIDES.map((slide, i) => (
              <div className="t-slide" key={i}>
                {slide.map((t) => (
                  <div className="t-card" key={t.name}>
                    <div className="t-reviewer-row">
                      <div className="t-avatar">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.avatar} alt="" />
                      </div>
                      <div>
                        <div className="t-reviewer-name">{t.name}</div>
                        <div className="t-reviewer-loc">{t.loc}</div>
                      </div>
                    </div>
                    <div className="t-stars">★★★★★</div>
                    <div className="t-text">&quot;{t.text}&quot;</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="t-controls">
          <button className="t-btn" onClick={() => goto(active - 1)} aria-label="Previous testimonial">
            ←
          </button>
          <div className="t-dots-row">
            {TESTIMONIAL_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`t-dot${i === active ? " active" : ""}`}
                onClick={() => goto(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button className="t-btn" onClick={() => goto(active + 1)} aria-label="Next testimonial">
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ products }: { products: Product[] }) {
  return (
    <div className="home">
      <ScrollReveal />
      <HeroSlider />
      <ProductsGrid products={products} />

      <section className="about-section reveal">
        <h2 className="section-title">What is BioHAK Wellness?</h2>
        <p>
          <strong>Rooted in function. Designed for real life.</strong>
        </p>
        <p>
          In a world of complicated supplements and wellness trends, BioHAK Wellness stands for something simple —
          function over fluff. We create products that serve a clear purpose: to give your body what it needs to
          function at its best.
        </p>
        <p>
          Our protein powders are made to deliver maximum high quality protein per scoop. Our omega-3-algal are
          loaded with essential sodium and minerals to truly hydrate.
        </p>
        <p>
          Every ingredient is there for a reason — clean, effective, and easy to understand. At BioHAK Wellness,
          we&apos;re all about functional ingredients, natural formulations and honest information. No fillers. No
          shortcuts.
        </p>
        <p>
          <strong>Functional. Purposeful. Simple.</strong>
        </p>
      </section>

      <OurProductsTabs products={products} />

      <div className="feature-strip">
        <div className="feature-strip-grid">
          <div className="feature-img reveal d1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-african-man.jpg" alt="Training" />
          </div>
          <div className="feature-img reveal d2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-indian-man.jpg" alt="Strength training" />
          </div>
          <div className="feature-img reveal d3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-african-woman.jpg" alt="Active lifestyle" />
          </div>
          <div className="feature-img reveal d4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-indian-woman.jpg" alt="Wellness" />
          </div>
        </div>
        <div className="feature-strip-cta reveal">
          <Link href="/all-products" className="view-all-btn">
            SHOP NOW
          </Link>
        </div>
      </div>

      <section className="quality-banner reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&q=85&fit=crop"
          alt="Tested for Purity And Safety"
        />
        <div className="quality-overlay">
          <h2>Tested for Purity And Safety</h2>
          <p>
            All BioHAK Wellness products are third-party tested for nutritional accuracy, heavy metals, and over 200
            contaminants.
          </p>
          <p>Our proteins and omega-3-algal are screened for sugar, sodium, pesticides etc., — with banned substance testing coming soon.</p>
          <p>Clean, safe, and high-performing — every batch, every time.</p>
          <Link href="/certified" className="read-more-btn">
            READ MORE
          </Link>
        </div>
      </section>

      <section className="why-section">
        <h2 className="section-title reveal">Why BioHAK Wellness?</h2>
        <div className="why-grid">
          {WHY_ITEMS.map((item, i) => (
            <div className={`why-item reveal d${i + 1}`} key={item.title}>
              <div className="why-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {item.ellipse && <ellipse cx="24" cy="24" rx="20" ry="12" />}
                  {item.paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </div>
              <div className="why-title">{item.title}</div>
              <div className="why-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSlider />

      <section className="insta-section">
        <div className="insta-wrap">
          <h2 className="section-title reveal">Straight From The Grid</h2>
          <div className="insta-handle reveal">
            <a href="https://www.instagram.com/thefunclab/" target="_blank" rel="noreferrer">
              @thefunclab
            </a>
          </div>
          <div className="insta-grid reveal">
            {INSTA_IMAGES.map((src) => (
              <a
                className="insta-cell"
                href="https://www.instagram.com/thefunclab/"
                target="_blank"
                rel="noreferrer"
                key={src}
              >
                <div className="insta-cell-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="@biohakwellness" />
                  <div className="insta-hover">{INSTA_ICON}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sohfit-section">
        <div className="sohfit-inner">
          <div className="sohfit-text reveal">
            <h2>Sohfit Approved</h2>
            <h3>Built on Trust, Backed by Results</h3>
            <p>
              For years, <strong>SOHFIT</strong> has set the gold standard in fitness, transforming lives with its
              no-nonsense approach to health. Founded by <strong>Sohrab Khushrushahi</strong>, SOHFIT&apos;s
              philosophy is simple: do the work, stay consistent, and keep things real.
            </p>
            <p>
              That&apos;s exactly why they stand by <strong>BioHAK Wellness</strong> — a brand that shares their
              belief in clean, effective nutrition. No frills, no fillers — just products that deliver.
            </p>
          </div>
          <div className="sohfit-img reveal d2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=85&fit=crop"
              alt="Sohfit Approved"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
