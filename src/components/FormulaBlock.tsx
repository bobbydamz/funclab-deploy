"use client";

import { useState } from "react";

export default function FormulaBlock({
  title,
  image,
  alt,
  reverse,
  revealClass,
  preview,
  more,
  tagline,
}: {
  title: string;
  image: string;
  alt: string;
  reverse?: boolean;
  revealClass: string;
  preview: React.ReactNode;
  more: React.ReactNode;
  tagline: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`formula-block${reverse ? " reverse" : ""} ${revealClass}`}>
      <div className="formula-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} />
      </div>
      <div className="formula-text">
        <h3>{title}</h3>
        <div className="formula-preview">{preview}</div>
        <div className={`formula-more${open ? " open" : ""}`}>{more}</div>
        <div className="formula-tagline">{tagline}</div>
        <button className={`read-more-btn${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
          {open ? "Read less " : "Read more "}
          <span className="arrow">{open ? "↑" : "↓"}</span>
        </button>
      </div>
    </div>
  );
}
