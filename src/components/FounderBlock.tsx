"use client";

import { useState } from "react";

export default function FounderBlock({
  name,
  photo,
  reverse,
  revealClass,
  preview,
  more,
}: {
  name: string;
  photo: string;
  reverse?: boolean;
  revealClass: string;
  preview: React.ReactNode;
  more: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`founder-block${reverse ? " reverse" : ""} ${revealClass}`}>
      <div className="founder-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={name} />
      </div>
      <div className="founder-text">
        <h2 className="founder-name">{name}</h2>
        <div className="founder-bio">
          <div className="founder-preview">{preview}</div>
          <div className={`founder-more${open ? " open" : ""}`}>{more}</div>
          <button className={`read-more-btn${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
            {open ? "Read less " : "Read more "}
            <span className="arrow">{open ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
