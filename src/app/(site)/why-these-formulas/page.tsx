import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import FormulaBlock from "@/components/FormulaBlock";
import "./why-these-formulas.css";

export const metadata: Metadata = {
  title: "Why These Formulas – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function WhyTheseFormulasPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-hero-blk">
        <span className="hero-label">About Us</span>
        <h1>Why These Formulas</h1>
        <p>Science-backed. Clean. Purposeful.</p>
      </div>

      <div className="purpose-banner reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=1200&q=80&fit=crop"
          alt="Every product has a purpose"
        />
      </div>

      <section className="intro-section">
        <div className="reveal">
          <h2>Every product has a purpose.</h2>
          <p>
            When we started BioHAK Wellness our goal was very simple, produce quality functional
            products.
          </p>
          <p>
            A protein powder needs to deliver PROTEIN, nothing else. No unnecessary fillers,
            emulsifiers or bulking agents. We wanted to provide the market with straightforward
            honest ingredients without any blends of concentrate and isolate, which in our humble
            opinion, only dilute the product. A single-source protein powder either 100% whey
            concentrate, 100% whey isolate or 100% plant-based (98% pea and 2% rice for a complete
            amino profile) is what, we believe, people need. Additionally, we want our protein to
            be easily digestible, so there are no gut issues in the future.
          </p>
          <p>
            On the other hand an electrolyte needs to deliver HYDRATION. Hydration in the right
            balance of sodium, potassium, magnesium, and chloride, not just sugar and a little bit
            of salt.
          </p>
          <p>
            We understand that taste matters, but at BioHAK Wellness, we&apos;re in the business
            of clean, functional food. That means every product we make will focus on performance
            first, the rest will sort itself out.
          </p>
          <p>
            <strong>Function is non-negotiable for us.</strong>
          </p>
        </div>
      </section>

      <FormulaBlock
        title="Protein: Fueling Your Body the Right Way"
        image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&fit=crop"
        alt="Protein – Fueling Your Body the Right Way"
        reverse
        revealClass="reveal"
        tagline="100% single-source protein, no blends, no fillers — just clean nutrition that works."
        preview={
          <>
            <p>
              For years, Sohrab Khushrushahi — founder of SOHFIT — worked with clients from every
              background: athletes, celebrities, busy professionals, and parents. One question
              kept coming up: <strong>&quot;Which protein should I take?&quot;</strong>
            </p>
            <p>
              He saw the confusion firsthand — overwhelming choices, complicated labels, and
              brands masking poor-quality protein behind fancy marketing. Many of his clients had
              been unknowingly consuming supplements filled with artificial additives, gums, and
              fillers that upset their gut, triggered skin issues, or delivered disappointing
              results.
            </p>
            <p>
              For Sahil Kukreja, being a former cricketer, he knew the importance of protein in
              recovery and performance. But trusting local brands felt risky — so he, like many
              others, turned to expensive international options.
            </p>
          </>
        }
        more={
          <>
            <p>
              For Daneesh Davar, the need was different. As a mother and someone navigating
              health and fitness in her 40s, she knew women often shy away from protein, fearing
              weight gain or bloating. The reality? Protein is essential, especially for women as
              they age.
            </p>
            <p>
              <strong>BioHAK Wellness&apos;s Protein</strong> was created to answer these
              concerns. Whether you&apos;re an athlete, a busy parent, or someone trying to
              improve your health, The BioHAK Wellness offers clean, gut-friendly protein options
              designed to nourish your body without compromise.
            </p>
          </>
        }
      />

      <FormulaBlock
        title="Omega-3 (Algal): Hydration for Every Body"
        image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80&fit=crop"
        alt="Omega-3 (Algal) – Hydration for Every Body"
        revealClass="reveal d1"
        tagline="No sugar. No fillers. Just hydration that works."
        preview={
          <>
            <p>
              Hydration isn&apos;t just about drinking water, it&apos;s about ensuring your body
              absorbs it effectively. After years of hearing clients complain about fatigue,
              cramps, and sluggish recovery, Sohrab knew that proper hydration was often the
              missing link.
            </p>
            <p>
              Daneesh, as a mom, recognized another crucial gap:{" "}
              <strong>hydration products for kids.</strong> Most options on the market were
              loaded with sugar, artificial colors, and chemicals, not something she felt
              comfortable giving her child.
            </p>
          </>
        }
        more={
          <p>
            BioHAK Wellness&apos;s Electrolyte Mix was designed to support hydration across ages —
            from active adults to kids as young as three. With 1000mg of sodium, 200mg of
            potassium, and 60mg of magnesium, it&apos;s a clean, effective way to replenish
            essential minerals without the added junk.
          </p>
        }
      />

      <section className="closing-section reveal">
        <h2>Every Product Has a Purpose</h2>
        <p>
          From protein to omega-3-algal, creatine to glutamine, every product at BioHAK Wellness
          was chosen to meet a real need. Whether you&apos;re training hard, balancing family
          life, or simply looking to improve your health, our products are designed to make
          nutrition simpler, cleaner, and more effective.
        </p>
        <p>
          <strong>Because the best results come from doing the basics — and doing them right.</strong>
        </p>
      </section>

      <div className="bottom-banner reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1550345332-09e3ac987658?w=1600&q=80&fit=crop"
          alt=""
        />
      </div>
    </>
  );
}
