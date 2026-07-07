"use client";

import { useEffect, useRef } from "react";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open]);

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
        <label>Search our site</label>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search…"
          id="searchInput"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
