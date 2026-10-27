"use client";

import {
  useRef,
  type ReactNode,
  type PointerEvent,
  type CSSProperties,
} from "react";

type BentoItem = {
  id: string;
  content: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
};

export function MagicBento({ items }: { items: BentoItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    root.current
      ?.querySelectorAll<HTMLElement>(".weather-bento-card")
      .forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--light-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--light-y", `${event.clientY - rect.top}px`);
      });
  }
  return (
    <div ref={root} className="weather-bento" onPointerMove={move}>
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
