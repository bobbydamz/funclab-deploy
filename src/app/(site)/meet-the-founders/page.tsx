import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import FounderBlock from "@/components/FounderBlock";
import "./meet-the-founders.css";

export const metadata: Metadata = {
  title: "Meet The Founders – BioHAK Wellness",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

export default function MeetTheFoundersPage() {
  return (
    <>
      <ScrollReveal />

      <div className="page-hero-blk">
        <span className="hero-label">About Us</span>
        <h1>Meet The Founders</h1>
        <p>The people behind BioHAK Wellness.</p>
      </div>

      <section className="founders-section">
        <FounderBlock
          name="Sohrab Khushrushahi"
          photo="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&fit=crop"
          revealClass="reveal"
          preview={
            <>
              <p>
                Sohrab Khushrushahi never set out to be a disruptor in fitness, he simply wanted
                to help people move better, feel better, and train with intention. A corporate
                lawyer turned coach, he walked away from a decade-long legal career, not in search
                of a trend, but in pursuit of something he had believed in all his life: the power
                of simplicity.
              </p>
              <p>
                From playing cricket at a youth level to training some of the finest athletes and
                actors in the country, his approach has remained the same—
                <strong>show up, do the work, and keep things simple</strong>. It was this belief
                that laid the foundation for SOHFIT, a community-driven training program that has
                transformed the way thousands approach fitness. Through <strong>SOHFIT</strong>,
                Sohrab worked with professional sports teams like the{" "}
                <strong>Mumbai Indians</strong> and the <strong>Pro Kabaddi League</strong>,
                trained some of Bollywood&apos;s most well-known faces, and shaped a movement
                centered around <strong>honest, no-nonsense fitness</strong>.
              </p>
            </>
          }
          more={
            <>
              <p>
                But in every conversation, every Q&amp;A, every coaching session, one question
                kept resurfacing: <strong>&quot;What protein should I take?&quot;</strong>
              </p>
              <p>
                It wasn&apos;t just a passing query, it was a gap in the industry that people were
                struggling with. Nutrition, much like fitness, should be{" "}
                <strong>simple, clear, and functional</strong>, but what Sohrab saw instead was{" "}
                <strong>overcomplication, misinformation, and marketing gimmicks</strong>.
              </p>
              <p>
                So when Sahil and Daneesh, both from different worlds but equally passionate about{" "}
                <strong>cutting through the noise</strong>, came together with him, BioHAK
                Wellness was born. Not as a product. Not as a business. But as an extension of
                everything they had spent years standing for.
              </p>
              <p>
                No misleading claims. No unnecessary ingredients. Just{" "}
                <strong>functional, honest, and effective</strong>. Because fitness isn&apos;t
                about magic formulas, and nutrition isn&apos;t about hype, it&apos;s about showing
                up, doing the right things, and letting consistency do the rest.
              </p>
            </>
          }
        />

        <FounderBlock
          name="Sahil Kukreja"
          photo="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&fit=crop"
          reverse
          revealClass="reveal d1"
          preview={
            <>
              <p>
                For Sahil Kukreja, performance has always been about the{" "}
                <strong>little things done right, over and over again</strong>. A former
                professional cricketer, he spent years mastering the fine balance between
                training, recovery, and nutrition—knowing that what he fueled his body with was
                just as critical as the hours he spent on the field.
              </p>
              <p>
                But when it came to supplementation, he saw a gap. Finding a{" "}
                <strong>protein that aligned with his philosophy of discipline and precision</strong>{" "}
                wasn&apos;t as straightforward as it should have been.
              </p>
              <p>
                As an athlete, he wanted something <strong>simple and effective</strong>—not
                loaded with unnecessary extras, just <strong>clean, functional nutrition</strong>{" "}
                that did its job. As a businessman, he recognized the need for{" "}
                <strong>transparency and trust</strong>, ensuring that what people consumed was
                exactly what was promised.
              </p>
            </>
          }
          more={
            <>
              <p>BioHAK Wellness became the bridge between both worlds.</p>
              <p>
                For Sahil, this isn&apos;t just about launching a product—it&apos;s about{" "}
                <strong>
                  creating something he wishes he had access to during his years as an athlete
                </strong>
                . It&apos;s about ensuring that anyone—whether they&apos;re training
                professionally or just looking to take better care of their body—has access to{" "}
                <strong>nutrition they can count on.</strong>
              </p>
              <p>
                Because when it comes to fueling your performance, it&apos;s not about trends,
                gimmicks, or shortcuts. It&apos;s about{" "}
                <strong>getting the essentials right—day in and day out.</strong>
              </p>
            </>
          }
        />

        <FounderBlock
          name="Daneesh Davar"
          photo="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&fit=crop"
          revealClass="reveal d2"
          preview={
            <>
              <p>Some people build brands. Others build movements. Daneesh Davar has done both.</p>
              <p>
                With a career that spans luxury branding and marketing, having held leadership
                roles at <strong>Vogue India, GQ India, and Audi Singapore</strong>, she
                understands what makes a brand more than just a name. She knows how to{" "}
                <strong>shape identities that last</strong>, how to craft stories that resonate,
                and how to make an impact that goes beyond just selling a product.
              </p>
              <p>
                But beyond the boardrooms and branding meetings, she has always been deeply
                invested in <strong>fitness, wellness, and community-driven change</strong>.
              </p>
              <p>
                As the co-founder of SOHFIT, she worked with people from across the world, guiding
                them through their fitness journeys. And in every space—whether in business, in
                fitness, or in personal conversations—she saw the same problem.
              </p>
            </>
          }
          more={
            <>
              <p>Daneesh wanted to rewrite that narrative.</p>
              <p>
                Women hesitated to take protein, believing the long-standing myths that it would
                make them bulky. Parents struggled to find clean options for their children.
                People were distrustful of labels, unsure of what they were actually consuming.
              </p>
              <p>
                BioHAK Wellness, for her, was never just about creating a great protein powder. It
                was about education, empowerment, and trust. It was about giving people clarity in
                an industry designed to confuse them.
              </p>
              <p>
                And for her, this is just the beginning. She envisions a world where functional,
                transparent nutrition isn&apos;t a privilege, it&apos;s the standard. A future
                where better health isn&apos;t complicated, and where even the youngest members of
                a family can have access to clean, effective supplementation.
              </p>
              <p>
                Because great health isn&apos;t just about what you do in the gym; it&apos;s about
                what you put into your body every single day.
              </p>
              <p>And that should be simple.</p>
            </>
          }
        />
      </section>
    </>
  );
}
