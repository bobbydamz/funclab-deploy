import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import "./origin-story.css";

export const metadata: Metadata = {
  title: "The Origin Story – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function OriginStoryPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-hero-blk">
        <span className="hero-label">About Us</span>
        <h1>The Origin Story</h1>
        <p>Clean, science-backed supplements — formulated for real results.</p>
      </div>

      <section className="os-intro">
        <div className="os-intro-inner">
          <div className="os-intro-text reveal">
            <h2>
              If you&apos;ve ever Googled &apos;which protein is right for me?&apos; at 1 A.M. —
              you&apos;re not alone.
            </h2>
            <p>
              BioHAK Wellness wasn&apos;t born in a boardroom — it was built in gyms, kitchens,
              and conversations with real people trying to do better for their bodies. At the
              heart of the brand are{" "}
              <a href="/meet-the-founders">three founders</a> who live and breathe wellness in
              different ways.
            </p>
            <p>
              <strong>Sohrab Khushrushahi</strong>, founder of SOHFIT and longtime coach to elite
              athletes and everyday movers, spent years helping people get stronger from the
              inside out. <strong>Sahil Kukreja</strong>, an ex-IPL cricketer turned health
              entrepreneur, has always believed in discipline and doing the basics right.{" "}
              <strong>Daneesh Davar</strong>, a brand-builder and mother, saw firsthand how
              misinformation, especially around protein and women, kept people from getting the
              support they deserved.
            </p>
            <p>
              <strong>
                Each of them had witnessed the same frustration unfold — no matter how committed
                people were to their health, the supplement industry kept confusing them.
              </strong>
            </p>
            <p>
              The problem wasn&apos;t effort, it was information. People didn&apos;t know which
              protein to pick, what hydration mix was right, or whether supplements were even
              necessary. Labels were crowded with complicated ingredients, artificial additives,
              and unpronounceable chemicals.
            </p>
          </div>

          <div className="os-intro-imgs reveal d2">
            <div className="os-overlap-back">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85&fit=crop"
                alt=""
              />
            </div>
            <div className="os-overlap-front">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=85&fit=crop"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <div className="os-full-img reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=85&fit=crop"
          alt="BioHAK Wellness Origin Story"
        />
      </div>

      <section className="os-second reveal">
        <div className="os-second-inner">
          <h2>BioHAK Wellness was created to cut through the noise.</h2>
          <p>
            It&apos;s not about trends, gimmicks, or what&apos;s &quot;hot&quot; right now;
            it&apos;s about creating products that are <strong>functional</strong>,{" "}
            <strong>clean</strong>, and <strong>honest.</strong> Every formula is stripped back to
            exactly what your body needs — nothing more, nothing less. No artificial sweeteners,
            no unnecessary fillers — just effective, thoughtfully designed supplements that help
            you feel your best.
          </p>
          <p>
            <strong>
              But BioHAK Wellness isn&apos;t just about products, it&apos;s about education and
              empowerment. For Sohrab, years of working with clients at SOHFIT showed him one
              thing: People needed better answers, not more options. For Daneesh, it was about
              ensuring women (especially mothers) had access to safe, trustworthy nutrition
              solutions. For Sahil, a former cricketer, it was about providing athletes with
              supplements they could finally trust.
            </strong>
          </p>
          <p>
            Together, they created BioHAK Wellness to simplify wellness and help people take
            control of their nutrition — with confidence, clarity, and results.
          </p>
        </div>
      </section>

      <div className="os-strapline reveal">
        <h2>Simple Products. Transparent Ingredients. Real Results.</h2>
        <p>
          BioHAK Wellness is your answer to functional, straightforward nutrition, designed to fit
          into your life, not complicate it.
        </p>
      </div>

      <div className="os-bottom-banner reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=85&fit=crop"
          alt="BioHAK Wellness"
        />
      </div>
    </>
  );
}
