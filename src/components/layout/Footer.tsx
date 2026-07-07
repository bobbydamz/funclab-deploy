import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-transparent.png" alt="BioHAK Wellness" style={{ height: 52, width: "auto", display: "block" }} />
        </div>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/origin-story">About Us</Link></li>
              <li><Link href="/ingredients">Ingredients</Link></li>
              <li><Link href="/certified">Certified</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/news">News</Link></li>
              <li><Link href="/blogs">Blogs</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/all-products">All Products</Link></li>
              <li><Link href="/whey-protein">Whey Protein</Link></li>
              <li><Link href="/plant-protein">Plant Protein</Link></li>
              <li><Link href="/multivitamins">Multivitamins</Link></li>
              <li><Link href="/omega-3-algal">Algal Omega-3</Link></li>
              <li><Link href="/vitamin-d3-k2">Vitamin D3+K2</Link></li>
              <li><Link href="/b-complex">B-Complex</Link></li>
              <li><Link href="/biotin">Biotin</Link></li>
              <li><Link href="/iron-vitamin-c">Iron + Vitamin C</Link></li>
              <li><Link href="/moringa-mushroom">Moringa + Mushroom</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions">Terms &amp; Conditions</Link></li>
              <li><Link href="/shipping-policy">Shipping Policy</Link></li>
              <li><Link href="/refunds-cancellation">Refunds &amp; Cancellation</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <ul>
              <li><a href="https://www.instagram.com/biohakwellness/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/biohakwellness" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href="https://api.whatsapp.com/send?phone=918291959606" target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
            <p className="footer-service">
              Customer Service Hours<br />
              Monday to Friday: 10am – 6pm<br />
              <a href="mailto:hello@biohakwellness.com">hello@biohakwellness.com</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026, <Link href="/">BioHAK Wellness</Link>. All rights reserved.</p>
          <div className="payment-methods">
            <span className="pay-tag">Visa</span>
            <span className="pay-tag">Mastercard</span>
            <span className="pay-tag">UPI</span>
            <span className="pay-tag">Razorpay</span>
            <span className="pay-tag">Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
