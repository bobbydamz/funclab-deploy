import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import "./func-manifesto.css";

export const metadata: Metadata = {
  title: "The BioHAK Manifesto – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

const GUARANTEES = [
  {
    title: "Clean Ingredients",
    desc: "No gums, emulsifiers, or artificial sweeteners. Just high-quality, purposeful ingredients your body can recognise and use.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" />
        <path d="M16 24l6 6 10-12" />
      </svg>
    ),
  },
  {
    title: "Science-Backed Formulations",
    desc: "Every product is built on research — from amino profiles to electrolyte ratios — for better absorption, digestion, and real results.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4l4 8 9 1.3-6.5 6.3 1.5 9L24 24l-8 4.6 1.5-9L11 13.3l9-1.3z" />
        <path d="M24 34v10M18 40h12" />
      </svg>
    ),
  },
  {
    title: "Gut-Friendly & Effective",
    desc: "Formulated with natural digestive enzymes for smooth digestion and no bloat — even with daily use.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="24" rx="20" ry="12" />
        <path d="M24 12v24M4 24c5 5 10 8 20 8s15-3 20-8" />
      </svg>
    ),
  },
  {
    title: "Tested for Purity & Safety",
    desc: "Third-party lab tested for heavy metals, contaminants, and accurate nutrition labels — because transparency and trust matter.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4l16 6v12c0 10-7 18-16 22C17 40 8 32 8 22V10z" />
        <path d="M17 24l5 5 9-10" />
      </svg>
    ),
  },
];

export default function FuncManifestoPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-hero-blk">
        <span className="hero-label">About Us</span>
        <h1>The BioHAK Manifesto</h1>
        <p>Our beliefs, values, and the principles we build by.</p>
      </div>

      <section className="mf-intro">
        <div className="mf-intro-inner">
          <div className="mf-intro-img reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85&fit=crop"
              alt="The BioHAK Manifesto"
            />
          </div>

          <div className="mf-intro-text reveal d2">
            <span className="mf-label">Our Mission</span>
            <h2>Simple Solutions for a Healthier You</h2>
            <p>
              BioHAK Wellness exists to make nutrition simpler — for the athlete chasing
              performance gains, the busy parent trying to stay healthy, or someone who just wants
              to know they&apos;re fuelling their body with something real, clean, and something
              they can trust.
            </p>
            <p>No guesswork. Just simple solutions.</p>

            <span className="mf-label" style={{ marginTop: 32, display: "block" }}>
              Our Philosophy
            </span>
            <h2>No Gimmicks, Just Results</h2>
            <p>
              At BioHAK Wellness, we believe in cutting through the clutter. No confusing labels,
              no complicated formulas — just the essentials your body needs to perform at its
              best. Each ingredient has a purpose. Each product is designed to be{" "}
              <strong>clean, functional, and effective</strong>.
            </p>
            <p>
              Because wellness isn&apos;t about the latest trends or quick fixes — it&apos;s about
              showing up consistently, doing the work, and getting the basics right every single
              day.
            </p>
          </div>
        </div>
      </section>

      <section className="mf-guarantees">
        <div className="mf-guarantees-inner">
          <h2 className="reveal">Our Guarantees</h2>
          <p className="mf-guarantees-sub reveal">
            Every BioHAK Wellness product is built on four non-negotiable commitments.
          </p>
          <div className="mf-grid">
            {GUARANTEES.map((g, i) => (
              <div className={`mf-item reveal d${i + 1}`} key={g.title}>
                <div className="mf-icon">{g.icon}</div>
                <div className="mf-title">{g.title}</div>
                <div className="mf-desc">{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
