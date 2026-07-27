"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SearchResult = { slug: string; name: string; image: string; price: number };

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    // Nothing to reset synchronously here -- the render below already hides the whole
    // results block when the query is under 2 chars, so stale results/loading/searched
    // state from a previous query just sits unused until the next real search overwrites it.
    if (trimmed.length < 2) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(res.ok ? data.results : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div
      className={`search-overlay${open ? " open" : ""}`}
      id="searchOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-form">
        <button className="search-close" onClick={onClose}>
          ✕
        </button>
        <label htmlFor="searchInput">Search our site</label>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for a product…"
          id="searchInput"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) {
              window.location.href = `/${results[0].slug}`;
            }
          }}
        />

        {query.trim().length >= 2 && (
          <div className="search-results">
            {loading ? (
              <div className="search-results-status">Searching…</div>
            ) : results.length === 0 && searched ? (
              <div className="search-results-status">No products found for &ldquo;{query.trim()}&rdquo;.</div>
            ) : (
              results.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} className="search-result" onClick={onClose}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" />
                  <span className="search-result-name">{r.name}</span>
                  <span className="search-result-price">Rs. {r.price.toLocaleString("en-IN")}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
