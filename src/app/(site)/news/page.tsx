import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import Newsletter from "@/components/Newsletter";
import "./news.css";

export const metadata: Metadata = {
  title: "News – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

const ARROW = (
  <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ARTICLES = [
  {
    href: "https://thefunclab.com/blogs/news-1/t2-online-i-think-the-one-thing-ive-learned-when-it-comes-to-training-or-fitness-is-its-an-honest-reflection-of-the-amount-of-work-you-put-in-sohrab-khushrushahi",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&fit=crop",
    alt: "T2 Online",
    source: "T2 Online",
    title:
      "[T2 Online] \"I think the one thing I've learned when it comes to training or fitness is, it's an honest reflection of the amount of work you put in\" — Sohrab Khushrushahi",
    meta: "September 02, 2025  ·  Chiranjiv Kant",
    excerpt:
      "He believes fitness is a lifestyle choice and swears by consistency and hard work. Lawyer-turned-celebrity fitness coach, Sohrab Khushrushahi. The founder of SOHFIT, who has trained the likes of Alia...",
  },
  {
    href: "https://thefunclab.com/blogs/news-1/lifestyle-asia-omega-3-algal-why-everyone-on-instagram-is-sipping-on-them-right-now",
    img: "https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=800&q=80&fit=crop",
    alt: "Lifestyle Asia",
    source: "Lifestyle Asia",
    title: "[Lifestyle Asia] Omega-3 (Algal): Why everyone on Instagram is sipping on them right now?",
    meta: "August 20, 2025  ·  Chiranjiv Kant",
    excerpt:
      "Move over green juice, omega-3-algal are having a serious moment. From gym girlies to marathon bros, everyone is suddenly talking about omega-3-algal. Not just during a workout but all day...",
  },
  {
    href: "https://thefunclab.com/blogs/news-1/indian-express-indulge-celebrity-trainer-sohrab-khushrushahi-on-india-s-evolving-wellness-culture",
    img: "https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=800&q=80&fit=crop",
    alt: "Indian Express Indulge",
    source: "Indian Express Indulge",
    title: "[Indian Express Indulge] Celebrity trainer Sohrab Khushrushahi on India's evolving wellness culture",
    meta: "August 20, 2025  ·  Chiranjiv Kant",
    excerpt:
      "When Sohrab Khushrushahi left behind a career in law to enter the fitness world, it wasn't about chasing aesthetics or chasing trends. \"It's been an evolution more than a pivot...\"",
  },
  {
    href: "https://thefunclab.com/blogs/news-1/the-indian-express-fitness-coach-sohrab-khushrushahi-on-protein-powders-gut-health-and-working-with-alia-bhatt-her-workout-routine-changed-during-pregnancy",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&fit=crop",
    alt: "The Indian Express",
    source: "The Indian Express",
    title:
      "[The Indian Express] Fitness coach Sohrab Khushrushahi on protein powders, gut health, and working with Alia Bhatt: 'Her workout routine changed during pregnancy'",
    meta: "August 07, 2025  ·  Chiranjiv Kant",
    excerpt:
      "From Kiara Advani to Karan Johar and Alia Bhatt, he has trained them all. But for Sohrab Khushrushahi, a lawyer-turned-fitness coach, stardom doesn't change the fundamentals...",
  },
  {
    href: "https://thefunclab.com/blogs/news-1/the-style-list-the-func-lab-is-indias-newest-clean-nutrition-brand",
    img: "https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=800&q=80&fit=crop",
    alt: "The Style List",
    source: "The Style List",
    title: "[The Style List] BioHAK Wellness is India's Newest Clean Nutrition Brand",
    meta: "July 22, 2025  ·  Chiranjiv Kant",
    excerpt:
      "These days, performance nutrition is everywhere. From protein powders to hydration boosters, the world of wellness supplements is booming, both in India and globally. But with it comes a lot of noise...",
  },
];

export default function NewsPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-wrap">
        <h1 className="page-title">News</h1>

        <a
          className="featured-article reveal"
          href="https://thefunclab.com/blogs/news-1/free-press-journal-protein-is-not-only-for-muscle-builders-you-need-it-too-heres-why"
          target="_blank"
          rel="noreferrer"
        >
          <div className="fa-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1100&q=80&fit=crop"
              alt="Free Press Journal"
            />
          </div>
          <div className="fa-body">
            <div className="fa-source">Free Press Journal</div>
            <h2 className="fa-title">
              [Free Press Journal] Protein Is Not Only For Muscle Builders, You Need It Too;
              Here&apos;s Why
            </h2>
            <div className="fa-meta">September 02, 2025 &nbsp;&middot;&nbsp; Chiranjiv Kant</div>
            <p className="fa-excerpt">
              Scroll through Instagram or stand in any supplement aisle and you&apos;ll probably
              hear the word protein thrown around like it&apos;s the latest health fad. But
              here&apos;s the truth: protein isn&apos;t a trend — it&apos;s a fundamental
              nutrient every single person needs, regardless of whether you lift weights or not.
            </p>
            <span className="fa-readmore">Read more {ARROW}</span>
          </div>
        </a>

        <div className="articles-grid">
          {ARTICLES.map((a) => (
            <a className="article-card reveal" key={a.href} href={a.href} target="_blank" rel="noreferrer">
              <div className="ac-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.img} alt={a.alt} loading="lazy" />
              </div>
              <div className="ac-source">{a.source}</div>
              <div className="ac-title">{a.title}</div>
              <div className="ac-meta">{a.meta}</div>
              <p className="ac-excerpt">{a.excerpt}</p>
              <span className="ac-readmore">
                Read more{" "}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <div className="pagination reveal">
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn ellipsis">…</button>
          <button className="page-btn">5</button>
          <button className="page-btn next-btn">Next ›</button>
        </div>
      </div>

      <Newsletter />
    </>
  );
}
