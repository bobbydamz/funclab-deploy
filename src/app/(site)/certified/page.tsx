import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import "./certified.css";

export const metadata: Metadata = {
  title: "Certified – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

const DOC_ICON = (
  <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const LAB_REPORTS = [
  { name: "Plant Protein Chocolate", id: "TC155462500002792F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003591-01.pdf?v=1752822081" },
  { name: "Plant Protein Vanilla", id: "TC155462500002793F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003589-01.pdf?v=1752822081" },
  { name: "Plant Protein Coffee", id: "TC155462500002795F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/Plant_protein_coffee.pdf?v=1752404350" },
  { name: "Plant Protein Unflavored", id: "TC155462500002799F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003590-01.pdf?v=1752822081" },
  { name: "Whey Protein Chocolate", id: "TC155462500002805F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003593-01.pdf?v=1752822081" },
  { name: "Whey Protein Vanilla", id: "TC155462500002800F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003592-01.pdf?v=1752822081" },
  { name: "Whey Protein Coffee", id: "TC155462500002805F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003588-01.pdf?v=1752822081" },
  { name: "Whey Protein Unflavored", id: "TC155462500002805F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003594-01.pdf?v=1752822081" },
  { name: "Whey Protein Chocolate", id: "TC155462500002803F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003597-01.pdf?v=1752822081" },
  { name: "Whey Protein Vanilla", id: "TC155462500002805F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003596-01.pdf?v=1752822081" },
  { name: "Whey Protein Coffee", id: "TC155462500002805F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003587-01.pdf?v=1752822081" },
  { name: "Whey Protein Unflavored", id: "TC155462500002805F", date: "July 15, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003595-01.pdf?v=1752822081" },
  { name: "Omega-3 (Algal) Orange (Hydration Mix)", id: "TC155462500002727F", date: "July 4, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003124-01.pdf?v=1752822081" },
  { name: "Omega-3 (Algal) Citrus (Hydration Mix)", id: "TC155462500002725F", date: "July 4, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003125-01.pdf?v=1752822081" },
  { name: "Omega-3 (Algal) Berry Blast (Hydration Mix)", id: "TC155462500002726F", date: "July 4, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003126-01.pdf?v=1752822081" },
  { name: "Omega-3 (Algal) Raspberry (Hydration Mix)", id: "TC155462500002728F", date: "July 4, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003127-01.pdf?v=1752822081" },
  { name: "Omega-3 (Algal) Pineapple (Hydration Mix)", id: "TC155462500002729F", date: "July 4, 2025", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/AR-644-2025-00003128-01.pdf?v=1752822081" },
];

const CERTIFICATIONS = [
  {
    name: "FSSAI",
    desc: "Ensuring our products meet India's highest food safety standards.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4l16 6v12c0 10-7 18-16 22C17 40 8 32 8 22V10z" />
        <path d="M17 24l5 5 9-10" />
      </svg>
    ),
  },
  {
    name: "GMP (Good Manufacturing Practice)",
    desc: "Guaranteeing consistent quality and safe production practices.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="14" width="32" height="26" rx="2" />
        <path d="M16 14V9a4 4 0 014-4h8a4 4 0 014 4v5" />
        <path d="M18 24h12M18 30h12" />
      </svg>
    ),
  },
  {
    name: "BRC (British Retail Consortium)",
    desc: "Recognized globally for upholding stringent food safety guidelines.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="20" r="12" />
        <path d="M17 30l-3 12 10-6 10 6-3-12" />
      </svg>
    ),
  },
  {
    name: "ISO Certification",
    desc: "Ensuring our products align with India's trusted standards for holistic wellness.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="10" />
        <path d="M24 6v8M24 34v8M6 24h8M34 24h8" />
      </svg>
    ),
  },
];

const DOCUMENTS = [
  { label: "FSSAI License", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/fssai-func.jpg?v=1752243211", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&fit=crop", alt: "FSSAI License" },
  { label: "FSSAI License", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/Renewed_FSSAI_license_-1.pdf?v=1751191898", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&fit=crop", alt: "FSSAI License Renewed" },
  { label: "Factory License", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/Factory_Licence_-_2.pdf?v=1751191897", img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&q=80&fit=crop", alt: "Factory License" },
  { label: "ISO Certificate", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/ISO_CERTIFICATE_-_3.pdf?v=1751191897", img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&q=80&fit=crop", alt: "ISO Certificate" },
  { label: "GMP Certificate", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/GMP_Certificate_-_4.pdf?v=1751191897", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=85&fit=crop", alt: "GMP Certificate" },
  { label: "Halal Certificate", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/Halal_Certificate_-_5.pdf?v=1751191897", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=85&fit=crop", alt: "Halal Certificate" },
  { label: "BRCGS Certificate", href: "https://cdn.shopify.com/s/files/1/0924/0313/8860/files/BRCGS_CERTIFICATE_-_6.pdf?v=1751191897", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=85&fit=crop", alt: "BRCGS Certificate" },
];

const PROCESS_STEPS = [
  {
    name: "Informed Sports / NFS Certification",
    desc: "Globally recognized programs that are trusted by professional athletes worldwide.",
    badge: "In Progress",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4l16 6v12c0 10-7 18-16 22C17 40 8 32 8 22V10z" />
        <path d="M17 24l5 5 9-10" />
      </svg>
    ),
  },
  {
    name: "Heavy Metals Testing",
    desc: "We test for lead, arsenic, mercury, and other contaminants to guarantee clean, safe supplements.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6v8M24 6l-6 8h12l-6-8z" />
        <path d="M10 14h28M14 14l-4 22a4 4 0 004 4h20a4 4 0 004-4l-4-22" />
        <path d="M18 24h12" />
      </svg>
    ),
  },
  {
    name: "Protein Content Verification",
    desc: "Ensuring that each scoop delivers the precise protein content you're paying for.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16S8 32.8 8 24z" />
        <path d="M24 14v10l6 4" />
      </svg>
    ),
  },
  {
    name: "Amino Acid Profile Analysis",
    desc: "To verify the right balance of essential and non-essential amino acids for optimal recovery and muscle support.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="6" />
        <circle cx="32" cy="16" r="6" />
        <circle cx="24" cy="32" r="6" />
        <path d="M20 19l-7 8M28 19l4 8M19 16h10" />
      </svg>
    ),
  },
  {
    name: "Microbiology Testing",
    desc: "Screening for harmful bacteria and ensuring the highest hygiene standards.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6c-9 0-14 7-14 14s5 14 14 22c9-8 14-15 14-22S33 6 24 6z" />
        <circle cx="20" cy="20" r="2" fill="#4bb4b4" />
        <circle cx="28" cy="18" r="2" fill="#4bb4b4" />
        <circle cx="24" cy="26" r="2" fill="#4bb4b4" />
      </svg>
    ),
  },
  {
    name: "Adulteration & Purity Testing",
    desc: "Guaranteeing our products are free from contaminants and harmful additives.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" />
        <path d="M16 24l6 6 10-12" />
      </svg>
    ),
  },
  {
    name: "Stability & Shelf Life Testing",
    desc: "Ensuring our products remain fresh, potent, and effective for their intended shelf life.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#4bb4b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="26" r="14" />
        <path d="M24 18v8l6 4" />
        <path d="M19 4h10M24 4v6" />
      </svg>
    ),
  },
];

export default function CertifiedPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-hero-blk">
        <span className="hero-label">Quality Assurance</span>
        <h1>Tested for Purity &amp; Safety</h1>
        <p>Third-party lab tested for quality, purity, and nutritional accuracy.</p>
      </div>

      <div className="page-content">
        <div className="testing-intro reveal">
          <p>
            At BioHAK Wellness, we prioritize product safety and transparency. All our protein
            powders and omega-3-algal are third-party lab tested to meet the highest standards of
            quality, purity, and nutritional accuracy.
          </p>

          <p>
            <strong>Protein Powders are tested for:</strong>
          </p>
          <ul>
            <li>
              <strong>Nutritional Values:</strong> Total fat, carbohydrates, protein (dry basis),
              total sugar, added sugar, sodium
            </li>
            <li>
              <strong>Heavy Metals:</strong> Arsenic, lead, mercury, cadmium, methyl mercury
            </li>
            <li>
              <strong>Contaminants:</strong> 200+ pesticide residues, melamine, aflatoxins
            </li>
          </ul>

          <p style={{ marginTop: 16 }}>
            <strong>Omega-3 (Algal) are tested for:</strong>
          </p>
          <ul>
            <li>
              <strong>Nutritional Values:</strong> Total sugar, energy, sodium, magnesium,
              potassium
            </li>
            <li>
              <strong>Heavy Metals:</strong> Arsenic, lead, mercury, cadmium
            </li>
            <li>
              <strong>Contaminants:</strong> Pesticide residues
            </li>
          </ul>

          <p className="highlight-line" style={{ marginTop: 20 }}>
            Every batch is screened for protein, carbs, fats, sugars, heavy metals, and (soon)
            banned substances — so you get <strong>clean</strong>, <strong>safe</strong>, and
            genuinely <strong>functional</strong> products you can <strong>trust</strong>.
          </p>
        </div>

        <div className="table-wrap reveal">
          <table className="lab-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Unique Lab Report #</th>
                <th>Report Date</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {LAB_REPORTS.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.id}</td>
                  <td>{r.date}</td>
                  <td>
                    <a className="view-link" href={r.href} target="_blank" rel="noreferrer">
                      {DOC_ICON} View File
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-heading reveal">
          <h2>We proudly hold the following certifications</h2>
        </div>

        <div className="cert-grid reveal">
          {CERTIFICATIONS.map((c) => (
            <div className="cert-card" key={c.name}>
              {c.icon}
              <div className="cert-name">{c.name}</div>
              <div className="cert-desc">{c.desc}</div>
            </div>
          ))}
        </div>

        <h2 className="reveal">&nbsp;</h2>
        <div className="docs-grid reveal">
          {DOCUMENTS.map((d, i) => (
            <a className="doc-card" key={i} href={d.href} target="_blank" rel="noreferrer">
              <div className="doc-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.alt} loading="lazy" />
                <div className="doc-thumb-overlay">{DOC_ICON}</div>
              </div>
              <div className="doc-label">{d.label}</div>
            </a>
          ))}
        </div>

        <div className="section-heading reveal">
          <h2>Our Testing Process: No Guesswork, Just Results</h2>
        </div>

        <div className="process-grid reveal">
          {PROCESS_STEPS.map((p) => (
            <div className="process-card" key={p.name}>
              {p.icon}
              {p.badge && <div className="process-badge">{p.badge}</div>}
              <div className="process-name">{p.name}</div>
              <div className="process-desc">{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="promise-close reveal">
          <h2>Simple Products. Transparent Ingredients. Real Results.</h2>
          <p style={{ fontSize: 15, color: "#555", marginTop: 12, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            BioHAK Wellness is your answer to functional, straightforward nutrition, designed to
            fit into your life, not complicate it.
          </p>
        </div>
      </div>

      <div className="bottom-banner reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=85&fit=crop"
          alt="Certified Bottom Banner"
        />
      </div>
    </>
  );
}
