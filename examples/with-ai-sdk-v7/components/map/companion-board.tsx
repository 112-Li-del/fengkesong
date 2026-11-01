"use client";

import { BellRing, X } from "lucide-react";
import type { Suggestion } from "@/lib/companion";

const KIND_LABEL: Record<Suggestion["kind"], string> = {
  arrive: "到达",
  approach: "接近",
  care: "顺路",
  facility: "设施",
};

type Props = {
  suggestions: Suggestion[];
  onOpen: (suggestion: Suggestion) => void;
  onDismiss: (id: string) => void;
  onClear: () => void;
};

export function CompanionBoard({
  suggestions,
  onOpen,
  onDismiss,
  onClear,
}: Props) {
  return (
    <aside className="companion-board" aria-label="霞宝建议">
      <header className="companion-board-head">
        <span className="companion-board-title">
          <BellRing size={15} />
          霞宝
        </span>
        <small>
          {suggestions.length ? `${suggestions.length} 条建议` : "待命中"}
        </small>
        {suggestions.length > 0 && (
          <button
            type="button"
            className="companion-board-clear"
            onClick={onClear}
          >
            清空
          </button>
        )}
      </header>
      {suggestions.length === 0 ? (
        <p className="companion-board-empty">
          靠近景点时，这里会不断刷新新的建议。
        </p>
      ) : (
        <ul className="companion-board-list" aria-live="polite">
          {suggestions.map((item) => (
            <li key={item.id} className={`companion-card kind-${item.kind}`}>
              <div className="companion-card-top">
                <span className="companion-card-kind">
                  {KIND_LABEL[item.kind]}
                </span>
                <button
                  type="button"
                  className="companion-card-close"
                  aria-label={`关闭${item.placeName}的建议`}
                  onClick={() => onDismiss(item.id)}
                >
                  <X size={13} />
                </button>
              </div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <button
                type="button"
                className="companion-card-open"
                onClick={() => onOpen(item)}
              >
                {item.action === "locate" ? "在地图上看" : "听听讲解"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
