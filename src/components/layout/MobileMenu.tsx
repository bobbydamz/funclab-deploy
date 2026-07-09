"use client";

import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/origin-story", label: "About Us" },
  { href: "/all-products", label: "All Products" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/certified", label: "Certified" },
  { href: "/account", label: "Log in" },
];

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`mob-overlay${open ? " open" : ""}`}
        id="mobOverlay"
        onClick={onClose}
      />
      <nav className={`mobile-menu${open ? " open" : ""}`} id="mobMenu">
        <button className="mob-close" onClick={onClose}>
          ✕
        </button>
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={onClose}>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
