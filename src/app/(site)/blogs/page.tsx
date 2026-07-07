import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import BlogArticles from "@/components/BlogArticles";
import "./blogs.css";

export const metadata: Metadata = {
  title: "Blogs – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

const FEATURED = {
  href: "https://thefunclab.com/blogs/news/the-ultimate-beginner-s-guide-to-protein-powders",
  img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop",
  alt: "Beginner's Guide to Protein Powders",
  category: "protein" as const,
  categoryLabel: "Protein",
  title: "The Ultimate Beginner's Guide to Protein Powders",
  meta: "May 26, 2025  ·  Chiranjiv Kant",
  excerpt:
    "Whey vs. Plant vs. Isolate — The BioHAK Wellness Lab Report. At The BioHAK Wellness, we know protein can feel confusing — every brand claims theirs is the best. This guide cuts through the noise and tells you exactly what to look for, what to avoid, and which type suits your body and goals.",
};

const ARTICLES = [
  {
    href: "https://thefunclab.com/blogs/news/how-to-get-enough-protein-without-eating-chicken-4-times-a-day",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop",
    alt: "Protein Without Chicken",
    category: "protein" as const,
    categoryLabel: "Protein",
    title: "How to Get Enough Protein Without Eating Chicken 4 Times a Day",
    meta: "May 26, 2025  ·  Chiranjiv Kant",
    excerpt:
      "The BioHAK Wellness Guide to Creative Protein (Veg-Friendly Too!) — At The BioHAK Wellness, we believe getting your protein shouldn't mean force-feeding yourself the same boring meals on repeat.",
  },
  {
    href: "https://thefunclab.com/blogs/news/protein-bloating-101-why-it-happens-how-to-fix-it",
    img: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80&fit=crop",
    alt: "Protein Bloating 101",
    category: "protein" as const,
    categoryLabel: "Protein",
    title: "Protein Bloating 101: Why It Happens & How to Fix It",
    meta: "May 26, 2025  ·  Chiranjiv Kant",
    excerpt:
      "The BioHAK Wellness Fix-It Guide — Bloating after upping your protein? At The BioHAK Wellness, we get it. Here's why it happens and the exact steps to fix it for good.",
  },
  {
    href: "https://thefunclab.com/blogs/news/the-ultimate-protein-powder-label-cheat-sheet",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&fit=crop",
    alt: "Protein Label Cheat Sheet",
    category: "protein" as const,
    categoryLabel: "Protein",
    title: "The Ultimate Protein Powder Label Cheat Sheet",
    meta: "May 26, 2025  ·  Chiranjiv Kant",
    excerpt:
      "How to Pick the Cleanest, Healthiest Shake — The BioHAK Wellness Way. At The BioHAK Wellness, we nerd out on labels so you don't have to. Here's exactly how to read them.",
  },
  {
    href: "https://thefunclab.com/blogs/news/what-you-eat-first-sets-the-tone-for-everything-that-follows",
    img: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80&fit=crop",
    alt: "What You Eat First",
    category: "protein" as const,
    categoryLabel: "Protein",
    title: "What You Eat First Sets the Tone for Everything That Follows",
    meta: "May 26, 2025  ·  Chiranjiv Kant",
    excerpt:
      "The BioHAK Wellness Protocol to Win the Morning, Win the Day — At The BioHAK Wellness, we believe your first bite of the day sets off a chain reaction — not just for energy, but for your entire metabolic rhythm.",
  },
  {
    href: "https://thefunclab.com/blogs/news/the-real-deal-with-protein-and-women-will-it-make-you-bulky",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop",
    alt: "Protein and Women",
    category: "protein" as const,
    categoryLabel: "Protein",
    title: "The Real Deal With Protein and Women: Will It Make You Bulky?",
    meta: "May 26, 2025  ·  Chiranjiv Kant",
    excerpt:
      "The BioHAK Wellness Truth Bomb — At The BioHAK Wellness, we want every woman to understand: protein won't make you bulky — it'll make you strong, lean, and hormonally balanced.",
  },
];

export default function BlogsPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-wrap">
        <h1 className="page-title">Blogs</h1>

        <BlogArticles featured={FEATURED} articles={ARTICLES} />

        <div className="pagination reveal">
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn next-btn">Next ›</button>
        </div>
      </div>

      <div className="blog-cta reveal">
        <h2>Ready to put this into practice?</h2>
        <p>Clean protein and real omega-3-algal — the exact formulas behind every article we write.</p>
        <div className="blog-cta-btns">
          <a href="/all-products">
            <button className="cta-btn-primary">Shop All Products</button>
          </a>
          <a href="/omega-3-algal">
            <button className="cta-btn-outline">Explore Omega-3 (Algal)</button>
          </a>
        </div>
      </div>
    </>
  );
}
