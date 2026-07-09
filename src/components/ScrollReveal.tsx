"use client";

import { useEffect } from "react";

/**
 * Renders nothing — just sets up the fade/slide-in-on-scroll effect for any `.reveal`
 * element on the page, ported from the inline IntersectionObserver script duplicated
 * across content pages (certified.html, faqs.html, etc.).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return null;
}
