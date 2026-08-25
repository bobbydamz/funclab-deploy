import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import "../all-products/all-products.css";

// TEMPORARY internal preview page -- delete this route (and public/whitecap-preview/)
// once the jar-cap-color decision is made. The jar manufacturer can't match cap color
// to each label, so caps will ship white across every product; this page swaps in
// white-cap versions of the product photos so that can be seen for real before deciding.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "White Cap Preview (Internal) – BioHAK Wellness",
  robots: { index: false, follow: false },
};

export default async function WhiteCapPreviewPage() {
  const products = await getAllProducts();

  return (
    <div className="shop-wrap">
      <div className="page-hero">
        <h1>White Cap Preview</h1>
        <p>
          Internal preview only, not linked from the site. The jar manufacturer can&apos;t match cap color to each
          label, so every jar will ship with a white cap instead -- this page shows what that looks like across the
          full catalog. Delete this page once a decision is made.
        </p>
      </div>

      <div className="products-grid" style={{ padding: "0 24px 60px" }}>
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="product-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/whitecap-preview/product-${p.slug}.png`} alt={`${p.name} (white cap preview)`} loading="lazy" />
            </div>
            <div className="product-body">
              <div className="product-title">{p.name}</div>
              <div className="price-row">
                <span className="price-sale">Rs. {p.price.toLocaleString("en-IN")}.00</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
