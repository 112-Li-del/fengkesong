"use client";

import type { CSSProperties, ReactNode } from "react";

type BentoItem = {
  id: string;
  content: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
};

export function MagicBento({ items }: { items: BentoItem[] }) {
  return (
    <div className="weather-bento">
      {items.map((item) => (
        <article
          key={item.id}
          className={`weather-bento-card ${item.className || ""}`}
          style={
            {
              "--span": item.colSpan ?? 1,
              "--rows": item.rowSpan ?? 1,
            } as CSSProperties
          }
        >
          <div className="weather-bento-content">{item.content}</div>
        </article>
      ))}
    </div>
  );
}
