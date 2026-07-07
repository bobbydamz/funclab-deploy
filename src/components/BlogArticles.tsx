"use client";

import { useState } from "react";

const ARROW_LG = (
  <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const ARROW_SM = (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

type Article = {
  href: string;
  img: string;
  alt: string;
  category: "protein" | "hydration";
  categoryLabel: string;
  title: string;
  meta: string;
  excerpt: string;
};

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "hydration", label: "Hydration + Electrolyte" },
  { key: "protein", label: "Protein" },
] as const;

export default function BlogArticles({
  featured,
  articles,
}: {
  featured: Article;
  articles: Article[];
}) {
  const [category, setCategory] = useState<string>("all");

  return (
    <>
      <div className="category-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`cat-tab${category === c.key ? " active" : ""}`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <a
        className="featured-article reveal"
        href={featured.href}
        target="_blank"
        rel="noreferrer"
        style={{ display: category === "all" || category === featured.category ? "grid" : "none" }}
      >
        <div className="fa-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.img} alt={featured.alt} />
        </div>
        <div className="fa-body">
          <span className={`fa-tag tag-${featured.category}`}>{featured.categoryLabel}</span>
          <h2 className="fa-title">{featured.title}</h2>
          <div className="fa-meta">{featured.meta}</div>
          <p className="fa-excerpt">{featured.excerpt}</p>
          <span className="fa-readmore">Read more {ARROW_LG}</span>
        </div>
      </a>

      <div className="articles-grid">
        {articles.map((a) => (
          <a
            className="article-card reveal"
            key={a.href}
            href={a.href}
            target="_blank"
            rel="noreferrer"
            style={{ display: category === "all" || category === a.category ? "block" : "none" }}
          >
            <div className="ac-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.img} alt={a.alt} loading="lazy" />
            </div>
            <span className={`ac-tag tag-${a.category}`}>{a.categoryLabel}</span>
            <div className="ac-title">{a.title}</div>
            <div className="ac-meta">{a.meta}</div>
            <p className="ac-excerpt">{a.excerpt}</p>
            <span className="ac-readmore">Read more {ARROW_SM}</span>
          </a>
        ))}
      </div>
    </>
  );
}
