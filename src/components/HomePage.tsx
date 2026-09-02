"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const HERO_SLIDES = [
  {
    img: "/hero-lift-wide.png",
    mobileImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85&fit=crop",
    caption: "Performance today. Health for tomorrow.",
  },
  {
    img: "/hero-yoga-sunset-wide.png",
    mobileImg: "/hero-yoga-sunset-mobile.png",
    caption: "Invest in your biology.",
  },
  {
    img: "/hero-runner-sunset-wide.png",
    mobileImg: "/hero-runner-sunset-mobile.png",
    caption: "Know what you take. Know why you take it.",
  },
];

const WHY_ITEMS = [
  {
    paths: ["M24 8a16 16 0 100 32 16 16 0 100-32z", "M24 16a8 8 0 100 16 8 8 0 100-16z", "M24 22a2 2 0 100 4 2 2 0 100-4z"],
    title: "Radical Precision",
    desc: "We're precise in everything we make — clear ingredients, meaningful doses and formulas built with real purpose. No fillers, no fluff, nothing without a reason to be there.",
  },
  {
    paths: ["M24 4l16 6v12c0 10-7 18-16 22C17 40 8 32 8 22V10z", "M17 24l5 5 9-10"],
    title: "Absolute Integrity",
    desc: "We say what's true and stand behind it. Honest claims, full regulatory compliance and zero shortcuts — even when it would be easier to cut a corner.",
  },
  {
    paths: ["M24 6L6 16l18 10 18-10z", "M6 24l18 10 18-10", "M6 32l18 10 18-10"],
    title: "Aesthetic Utility",
    desc: "Good nutrition should be easy to trust and easy to use. We design every product and label to help you actually understand what's inside and why it matters.",
  },
  {
    paths: ["M24 40C10 30 4 22 4 15c0-6 5-10 10-10 5 0 8 3 10 7 2-4 5-7 10-7 5 0 10 4 10 10 0 7-6 15-20 25z"],
    title: "Human Understanding",
    desc: "You're not a data point. We build around real lives, real routines and real goals — because nutrition only works when it fits the life you're actually living.",
  },
  {
    paths: ["M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z", "M16 24l6 6 10-12"],
    title: "Earned Trust",
    desc: "Trust isn't a tagline — it's built one batch, one order, one honest answer at a time. We earn it through consistency, not promises.",
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
            <picture>
              <source media="(max-width: 767px)" srcSet={s.mobileImg} />
              <img src={s.img} alt={s.caption} />
            </picture>
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

export default function HomePage() {
  return (
    <div className="home">
      <ScrollReveal />
      <HeroSlider />

      <section className="about-section reveal">
        <h2 className="section-title">What is BioHAK Wellness?</h2>
        <p>
          <strong>Precision nutrition for life performance.</strong>
        </p>
        <p>
          BioHAK Wellness is a premium nutrition brand for ambitious people who want to perform better today and
          build a healthier future. We combine science, transparency and thoughtful design to make better nutrition
          simple — and trustworthy.
        </p>
        <p>
          Every formula starts with a question: what does your body actually need? Then we answer it with clear
          ingredients, meaningful doses and honest information — nothing hidden, nothing wasted.
        </p>
        <p>Know what you take. Know why you take it. Trust what&apos;s inside.</p>
        <p>
          <strong>Invest in your biology.</strong>
        </p>
      </section>

      <div className="feature-strip">
        <div className="feature-strip-grid">
          <div className="feature-img reveal d1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-african-man.jpg" alt="Training" />
          </div>
          <div className="feature-img reveal d2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-man-yoga.jpg" alt="Strength training" />
          </div>
          <div className="feature-img reveal d3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-woman-gym.jpg" alt="Active lifestyle" />
          </div>
          <div className="feature-img reveal d4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/feature-woman-dumbbell.jpg" alt="Wellness" />
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
            <a href="https://www.instagram.com/biohakwellness/" target="_blank" rel="noreferrer">
              @biohakwellness
            </a>
          </div>
          <div className="insta-grid reveal">
            {INSTA_IMAGES.map((src) => (
              <a
                className="insta-cell"
                href="https://www.instagram.com/biohakwellness/"
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
