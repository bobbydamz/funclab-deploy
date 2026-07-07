"use client";

import { useEffect, useRef } from "react";

/**
 * Shown once per browser (localStorage flag), fades out after ~4.2s. Ported verbatim
 * from the inline #bhSplash script that used to be duplicated at the top of every page —
 * including its imperative style.display/opacity approach, so the initial server-rendered
 * markup (hidden) always matches the client's first paint with no visibility flicker.
 */
export default function SplashScreen() {
  const elRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode's dev-only double-invoke: without this, the
    // first invocation would mark bh_splash_seen, and the second (real) invocation
    // would then see it already set and skip showing the splash.
    if (hasRun.current) return;
    hasRun.current = true;

    const el = elRef.current;
    if (!el || localStorage.getItem("bh_splash_seen")) return;
    localStorage.setItem("bh_splash_seen", "1");
    el.style.display = "flex";

    const fadeTimer = setTimeout(() => {
      el.style.transition = "opacity 0.65s ease";
      el.style.opacity = "0";
    }, 4200);
    const hideTimer = setTimeout(() => {
      el.style.display = "none";
    }, 4200 + 680);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      id="bhSplash"
      ref={elRef}
      style={{
        display: "none",
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-text-only.png"
        alt=""
        style={{
          height: 60,
          width: "auto",
          display: "block",
          animation: "bhLogoIn 3.2s ease-out both",
        }}
      />
    </div>
  );
}
