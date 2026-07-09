import type { NextConfig } from "next";

// Slugs that map 1:1 from the old "<slug>.html" static pages to their new clean-URL
// routes, so old bookmarks/search-engine-indexed links from the pre-Next.js site
// still resolve instead of 404ing.
const LEGACY_HTML_SLUGS = [
  "account",
  "admin",
  "all-products",
  "b-complex",
  "biotin",
  "blogs",
  "cart",
  "certified",
  "contact",
  "faqs",
  "forgot-password",
  "func-manifesto",
  "ingredients",
  "iron-vitamin-c",
  "meet-the-founders",
  "merchandise",
  "moringa-mushroom",
  "multivitamins",
  "news",
  "omega-3-algal",
  "on-the-go-travel-packs",
  "origin-story",
  "plant-protein",
  "privacy-policy",
  "refunds-cancellation",
  "shipping-policy",
  "terms-conditions",
  "value-bundles",
  "vitamin-d3-k2",
  "whey-protein",
  "whey-protein-concentrate",
  "whey-protein-isolate",
  "why-these-formulas",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...LEGACY_HTML_SLUGS.map((slug) => ({
        source: `/${slug}.html`,
        destination: `/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
