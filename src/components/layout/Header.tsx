"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [{ href: "/", label: "Home" }];

const SHOP_LINKS = [
  { href: "/all-products", label: "All Products" },
  { href: "/b-complex", label: "B-Complex" },
  { href: "/biotin", label: "Biotin" },
  { href: "/iron-vitamin-c", label: "Iron + Vitamin C" },
  { href: "/moringa-mushroom", label: "Moringa + Mushroom Lions Mane" },
  { href: "/multivitamins", label: "Multivitamins" },
  { href: "/omega-3-algal", label: "Omega-3 (Algal)" },
  { href: "/plant-protein", label: "Plant Protein" },
  { href: "/vitamin-d3-k2", label: "Vitamin D-3 + K2" },
  { href: "/whey-protein", label: "Whey Protein" },
];

const ABOUT_LINKS = [
  { href: "/origin-story", label: "The Origin Story" },
  { href: "/func-manifesto", label: "The BioHAK Manifesto" },
  { href: "/meet-the-founders", label: "Meet The Founders" },
  { href: "/why-these-formulas", label: "Why These Formulas" },
];

function isActive(pathname: string, href: string) {
  const normalize = (p: string) => (p === "/" ? "/" : p.replace(/\/$/, ""));
  return normalize(pathname) === normalize(href);
}

export default function Header({
  onSearchOpen,
  onMenuOpen,
}: {
  onSearchOpen: () => void;
  onMenuOpen: () => void;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-top">
      <AnnouncementBar />
      <header className={`site-header${scrolled ? " scrolled" : ""}`} id="siteHeader">
        <div className="header-wrap">
          <div className="logo-outer" style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-transparent.png"
              alt="BioHAK Wellness"
              className="nav-logo"
              style={{ height: 52, width: "auto", objectFit: "contain" }}
            />
          </div>

          <nav className="main-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(pathname, link.href) ? "active-page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <div className="nav-item">
              <Link href="#">About Us</Link>
              <div className="nav-dropdown">
                {ABOUT_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-item">
              <Link href="#">Shop</Link>
              <div className="nav-dropdown">
                {SHOP_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/ingredients"
              className={isActive(pathname, "/ingredients") ? "active-page" : undefined}
            >
              Ingredients
            </Link>
            <Link
              href="/certified"
              className={isActive(pathname, "/certified") ? "active-page" : undefined}
            >
              Certified
            </Link>
            <Link href="/news" className={isActive(pathname, "/news") ? "active-page" : undefined}>
              News
            </Link>
            <Link
              href="/blogs"
              className={isActive(pathname, "/blogs") ? "active-page" : undefined}
            >
              Blogs
            </Link>
          </nav>

          <div className="header-right">
            <button className="hdr-icon-btn" onClick={onSearchOpen} aria-label="Search">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <Link href="/account" className="hdr-icon-btn" id="loginLink" aria-label="Account">
              <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="230" cy="148" r="100" stroke="currentColor" strokeWidth={26} />
                <path
                  d="M300 271c-22-9-46-14-70-14-95 0-181 62-192 148-3 24 16 45 40 45h183"
                  stroke="currentColor"
                  strokeWidth={26}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="384" cy="366" r="92" stroke="currentColor" strokeWidth={24} />
                <path
                  d="M350 366h68M392 332l38 34-38 34"
                  stroke="currentColor"
                  strokeWidth={24}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/cart" className="cart-link" id="cartBtn" aria-label="Cart">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M44 58h42c8 0 15 5 17 13l10 39"
                  fill="none"
                  stroke="#ff5a3c"
                  strokeWidth={28}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M113 110h360l-46 210a34 34 0 01-33 27H176a34 34 0 01-33-26L98 130a34 34 0 00-1-4"
                  fill="#bcd8f7"
                  strokeWidth={18}
                  strokeLinejoin="round"
                />
                <path d="M170 110v237M240 110v237M310 110v237M380 110v237" strokeWidth={9} />
                <path d="M118 160h372M133 210h348M148 260h326" strokeWidth={9} />
                <circle cx="205" cy="440" r="34" fill="#1a2b4c" strokeWidth={14} />
                <circle cx="360" cy="440" r="34" fill="#1a2b4c" strokeWidth={14} />
                <circle cx="205" cy="440" r="8" fill="#5b9cf6" />
                <circle cx="360" cy="440" r="8" fill="#5b9cf6" />
              </svg>
              <span className={`cart-badge${count > 0 ? " has-items" : ""}`} id="cartCount">
                {count}
              </span>
            </Link>
            <button className="hamburger" onClick={onMenuOpen} aria-label="Open menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
