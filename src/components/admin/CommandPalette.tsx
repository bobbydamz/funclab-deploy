"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/app/api/admin/search/route";

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  product: "Products",
  order: "Orders",
  customer: "Customers",
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) return;
    debounceRef.current = setTimeout(async () => {
      // Runs inside the setTimeout callback, not synchronously in the effect body, so
      // this is the standard debounced-fetch idiom rather than a direct setState-in-effect.
      setLoading(true);
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setActiveIndex(0);
      }
      setLoading(false);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function go(result: SearchResult) {
    router.push(result.href);
    close();
  }

  const visibleResults = query.trim().length < 2 ? [] : results;

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && visibleResults[activeIndex]) {
      e.preventDefault();
      go(visibleResults[activeIndex]);
    }
  }

  const grouped = visibleResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <button className="cmdk-trigger" onClick={() => setOpen(true)}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>

      {open && (
        <div className="cmdk-overlay" onClick={close}>
          <div className="cmdk-box" onClick={(e) => e.stopPropagation()}>
            <div className="cmdk-input-row">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search products, orders, customers..."
              />
              <kbd>Esc</kbd>
            </div>
            <div className="cmdk-results">
              {loading && <div className="cmdk-empty">Searching…</div>}
              {!loading && query.trim().length >= 2 && visibleResults.length === 0 && (
                <div className="cmdk-empty">No results for &ldquo;{query}&rdquo;</div>
              )}
              {!loading && query.trim().length < 2 && <div className="cmdk-empty">Type at least 2 characters…</div>}
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type} className="cmdk-group">
                  <div className="cmdk-group-label">{TYPE_LABEL[type as SearchResult["type"]]}</div>
                  {items.map((r) => {
                    const idx = visibleResults.indexOf(r);
                    return (
                      <button
                        key={`${r.type}-${r.id}`}
                        className={`cmdk-result${idx === activeIndex ? " active" : ""}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => go(r)}
                      >
                        <span className="cmdk-result-label">{r.label}</span>
                        <span className="cmdk-result-sub">{r.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
