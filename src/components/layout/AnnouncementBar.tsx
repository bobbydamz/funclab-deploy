"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Shows one message at a time, auto-advancing every 10s. Prev/next buttons jump directly
 * (reversing the travel direction) and restart the timer. This is a careful transcription
 * of the original assets/js/chrome.js `initAnnBar()` logic (direction-aware translateX,
 * the offsetHeight layout-flush trick, the `animating` guard) — deliberately NOT rewritten
 * as "equivalent" declarative CSS transitions, since that class of rewrite is exactly what
 * silently regressed the timing/direction behavior that took real debugging to get right.
 */
export default function AnnouncementBar() {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idxRef = useRef(0);
  const animatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const goToRef = useRef((dir: number) => {
    void dir;
  });

  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!slides.length) return;

    function show(newIdxRaw: number, dir: number) {
      const newIdx = ((newIdxRaw % slides.length) + slides.length) % slides.length;
      if (newIdx === idxRef.current || animatingRef.current || !dir) return;
      const oldSlide = slides[idxRef.current];
      const newSlide = slides[newIdx];
      animatingRef.current = true;
      newSlide.style.transition = "none";
      newSlide.style.transform = `translateX(${dir > 0 ? "100%" : "-100%"})`;
      void newSlide.offsetHeight; // flush layout with the jump above before re-enabling the transition
      newSlide.style.transition = "";
      oldSlide.style.transform = `translateX(${dir > 0 ? "-100%" : "100%"})`;
      newSlide.style.transform = "translateX(0)";
      oldSlide.classList.remove("active");
      newSlide.classList.add("active");
      idxRef.current = newIdx;
      setTimeout(() => {
        animatingRef.current = false;
      }, 500);
    }

    function restart() {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => show(idxRef.current + 1, 1), 10000);
    }

    goToRef.current = (dir: number) => {
      show(idxRef.current + dir, dir);
      restart();
    };

    restart();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="ann-bar">
      <button
        className="ann-nav ann-prev"
        onClick={() => goToRef.current(-1)}
        aria-label="Previous announcement"
      >
        ‹
      </button>
      <div className="ann-slides" id="annSlides">
        <div
          className="ann-slide active"
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
        >
          Free shipping on all orders over Rs. 1000
        </div>
        <div
          className="ann-slide"
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
        >
          <Link href="/all-products" className="ann-highlight">
            Get up to 26% off on all orders
          </Link>
        </div>
      </div>
      <button
        className="ann-nav ann-next"
        onClick={() => goToRef.current(1)}
        aria-label="Next announcement"
      >
        ›
      </button>
    </div>
  );
}
