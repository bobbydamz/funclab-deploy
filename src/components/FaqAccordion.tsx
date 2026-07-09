"use client";

import { useState } from "react";

type FaqEntry = { q: string; a: React.ReactNode };
type FaqSection = { heading: string; items: FaqEntry[] };

/**
 * Single-open-at-a-time accordion across the whole page, matching the original
 * inline script: clicking a question closes every other item first.
 */
export default function FaqAccordion({ sections }: { sections: FaqSection[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="faqs-wrap">
      {sections.map((section, si) => (
        <div className="faq-section" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.items.map((item, ii) => {
            const key = `${si}-${ii}`;
            const isOpen = openKey === key;
            return (
              <div className={`faq-item${isOpen ? " open" : ""}`} key={key}>
                <button
                  className="faq-question"
                  onClick={() => setOpenKey(isOpen ? null : key)}
                >
                  {item.q} <span className="faq-arrow">▾</span>
                </button>
                <div className="faq-answer">{item.a}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
