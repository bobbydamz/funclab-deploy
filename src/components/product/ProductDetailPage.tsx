import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import AddToCartControls from "./AddToCartControls";
import RelatedProducts from "./RelatedProducts";

const STAR_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);

export default async function ProductDetailPage({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug);
  const discountPct = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">Home</Link> &rsaquo; <Link href="/all-products">Shop</Link> &rsaquo;{" "}
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-gallery">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-meta">
          <div className="product-badge">BioHAK Wellness</div>
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating">
            <span className="rating-pill">
              {STAR_ICON}
              {product.rating?.toString()}
              <span className="rating-max">/5</span>
            </span>
            <span className="rating-count">({product.reviewCount} reviews)</span>
          </div>
          <div className="product-price-row">
            <span className="price-main">₹{product.price.toLocaleString("en-IN")}</span>
            {product.compareAtPrice && (
              <span className="price-compare">₹{product.compareAtPrice.toLocaleString("en-IN")}</span>
            )}
            {discountPct !== null && <span className="price-save-badge">{discountPct}% OFF</span>}
          </div>
          <p className="product-desc">{product.description}</p>
          <ul className="benefits-list">
            {product.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <AddToCartControls
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              slug: product.slug,
            }}
          />
          <p style={{ fontSize: 12, color: "#888" }}>
            ✓ Free shipping over ₹1000 &nbsp; ✓ Secure checkout &nbsp; ✓ Easy returns
          </p>
        </div>
      </div>

      <RelatedProducts products={related} />
    </>
  );
}
