"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import SplashScreen from "./SplashScreen";
import BackToTop from "./BackToTop";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <SplashScreen />
      <Header onSearchOpen={() => setSearchOpen(true)} onMenuOpen={() => setMenuOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
}
