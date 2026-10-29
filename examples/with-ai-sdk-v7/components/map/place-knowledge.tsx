"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  ListChecks,
  Volume2,
  X,
} from "lucide-react";
import { getQixiaKnowledgeByCode } from "@/lib/qixia-knowledge";
import type { QixiaPlaceKnowledge } from "@/lib/qixia-knowledge";
import type { Place } from "./amap-types";

const CRED_LABEL: Record<string, string> = {
  A: "官方/学术",
  B: "可靠来源",
  C: "单一来源/存异",
};

function CredibilityBadge({ credibility }: { credibility?: string }) {
  if (!credibility) return null;
  return (
    <span
      className={`knowledge-cred is-${credibility.toLowerCase()}`}
      title={`可信度 ${credibility}`}
    >
      {credibility} · {CRED_LABEL[credibility] ?? credibility}
    </span>
  );
}

function SourceLink({ url }: { url: string }) {
  if (!url) return null;
  return (
    <a
      className="knowledge-source-link"
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="查看出处原文"
      title="查看出处原文"
    >
      <Link2 size={11} />
    </a>
  );
}

/** 内联枫叶图标（红枫主题） */
function MapleLeaf({
  size = 18,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={style}
    >
      <path d="M12 1.8C11 4.4 8.6 5.1 6.1 4.6c.4 2.1-.8 3.2-2.8 3.9 1.8.8 2.2 2.5 1 4.3 2.1-.5 3.7.4 4.4 2.2.9-1.2 2.2-.9 3.3.9 1.1-1.8 2.4-2.1 3.3-.9.7-1.8 2.3-2.7 4.4-2.2-1.2-1.8-.8-3.5 1-4.3-2-.7-3.2-1.8-2.8-3.9-2.5.5-4.9-.2-6.1-2.8z" />
      <path
        d="M12 13.6V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** 四角装饰的大枫叶（半探出画面，营造秋意） */
const MAPLE_CORNERS = [
  {
    top: "-4%",
    left: "-3%",
    size: 200,
    rotate: -16,
    opacity: 0.34,
    color: "#f2b88a",
  },
  {
    top: "-5%",
    right: "-4%",
    size: 250,
    rotate: 18,
    opacity: 0.3,
    color: "#f6d3a8",
  },
  {
    bottom: "-6%",
    left: "-3%",
    size: 230,
    rotate: 12,
    opacity: 0.28,
    color: "#e8a05c",
  },
  {
    bottom: "-5%",
    right: "-3%",
    size: 190,
    rotate: -20,
    opacity: 0.3,
    color: "#f2b88a",
  },
];

/** 背景中轻盈漂浮的枫叶（红底上的金色/暖橙叶片） */
const MAPLE_FALL = [
  {
    top: "12%",
    left: "8%",
    size: 46,
    rotate: -24,
    opacity: 0.5,
    color: "#f6d3a8",
    delay: "0s",
    dur: "8s",
  },
  {
    top: "22%",
    left: "22%",
    size: 30,
    rotate: 16,
    opacity: 0.4,
    color: "#f2b88a",
    delay: "1.2s",
    dur: "9s",
  },
  {
    top: "9%",
    right: "16%",
    size: 38,
    rotate: 28,
    opacity: 0.45,
    color: "#e8a05c",
    delay: "0.6s",
    dur: "7.5s",
  },
  {
    top: "30%",
    right: "7%",
    size: 52,
    rotate: -12,
    opacity: 0.4,
    color: "#f6d3a8",
    delay: "2s",
    dur: "9.5s",
  },
  {
    bottom: "26%",
    left: "6%",
    size: 56,
    rotate: 18,
    opacity: 0.42,
    color: "#e8a05c",
    delay: "0.9s",
    dur: "8.5s",
  },
  {
    bottom: "18%",
    left: "24%",
    size: 34,
    rotate: -22,
    opacity: 0.38,
    color: "#f6d3a8",
    delay: "1.6s",
    dur: "7s",
  },
  {
    bottom: "34%",
    right: "10%",
    size: 44,
    rotate: 24,
    opacity: 0.44,
    color: "#f2b88a",
    delay: "0.3s",
    dur: "9s",
  },
  {
    bottom: "12%",
    right: "24%",
    size: 30,
    rotate: -30,
    opacity: 0.4,
    color: "#e8a05c",
    delay: "2.4s",
    dur: "8s",
  },
  {
    top: "46%",
    left: "4%",
    size: 26,
    rotate: 12,
    opacity: 0.35,
    color: "#f6d3a8",
    delay: "1.1s",
    dur: "7.5s",
  },
  {
    top: "52%",
    right: "5%",
    size: 30,
    rotate: -14,
    opacity: 0.36,
    color: "#f2b88a",
    delay: "0.5s",
    dur: "9.5s",
  },
];

function KnowledgeModal({
  knowledge,
  place,
  onClose,
}: {
  knowledge: QixiaPlaceKnowledge;
  place: Place;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const timeline = knowledge.timeline ?? [];
  const audio = knowledge.audio ?? [];
  const images = knowledge.images ?? [];
  const facts = knowledge.keyFacts ?? [];
  const aliases = knowledge.aliases ?? [];
  const historySources = knowledge.historySources ?? [];

  return createPortal(
    <div
      className="knowledge-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${place.name} 景点知识卡片`}
      onClick={onClose}
    >
      {MAPLE_CORNERS.map((leaf, index) => (
        <span
          key={`corner-${index}`}
          className="knowledge-maple-corner"
          style={{
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            bottom: leaf.bottom,
            opacity: leaf.opacity,
            color: leaf.color,
          }}
        >
          <MapleLeaf
            size={leaf.size}
            style={{ transform: `rotate(${leaf.rotate}deg)` }}
          />
        </span>
      ))}
      {MAPLE_FALL.map((leaf, index) => (
        <span
          key={index}
          className="knowledge-maple-fall"
          style={{
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            bottom: leaf.bottom,
            opacity: leaf.opacity,
            color: leaf.color,
            animationDelay: leaf.delay,
            animationDuration: leaf.dur,
          }}
        >
          <MapleLeaf
            size={leaf.size}
            style={{ transform: `rotate(${leaf.rotate}deg)` }}
          />
        </span>
      ))}

      <div className="knowledge-modal" onClick={(e) => e.stopPropagation()}>
        <header className="knowledge-modal-head">
          <div className="knowledge-modal-heading">
            <div className="knowledge-modal-eyebrow">
              <MapleLeaf size={15} />
              <span>景点知识 · 栖霞知识库</span>
            </div>
            <h2>{knowledge.kbTitle ?? knowledge.name}</h2>
            <p className="knowledge-modal-sub">
              {place.referenceCode ? `参考图 ${place.referenceCode} · ` : ""}
              {knowledge.referenceName}
              {aliases.length ? ` · 又名：${aliases.join("、")}` : ""}
            </p>
          </div>
          <button
            type="button"
            className="knowledge-modal-close"
            aria-label="关闭"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className="knowledge-modal-body">
          {knowledge.credibility && (
            <div className="knowledge-modal-meta">
              <CredibilityBadge credibility={knowledge.credibility} />
              <span>该景点资料总体可信度</span>
            </div>
          )}

          {knowledge.summary && (
            <section className="knowledge-section">
              <h3>
                <MapleLeaf size={13} /> 简介
              </h3>
              <p className="knowledge-summary-text">{knowledge.summary}</p>
            </section>
          )}

          {knowledge.history && (
            <section className="knowledge-section">
              <h3>
                <MapleLeaf size={13} /> 来历
              </h3>
              <p className="knowledge-history-text">{knowledge.history}</p>
              {historySources.length > 0 && (
                <div className="knowledge-sources">
                  <span>出处：</span>
                  {historySources.map((source, index) => (
                    <a
                      key={index}
                      href={source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      原文 {index + 1}
                      <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}

          {facts.length > 0 && (
            <section className="knowledge-section">
              <h3>
                <ListChecks size={14} /> 关键史实 · {facts.length} 项
              </h3>
              <div className="knowledge-facts">
                {facts.map((fact, index) => (
                  <div className="knowledge-fact" key={index}>
                    <div className="knowledge-fact-key">{fact.key}</div>
                    <ul>
                      {fact.values.map((value, valueIndex) => (
                        <li key={valueIndex}>
                          <span className="knowledge-fact-value">
                            {value.value}
                            {value.unit ? <em>（{value.unit}）</em> : null}
                          </span>
                          <span className="knowledge-fact-meta">
                            {value.credibility && (
                              <CredibilityBadge
                                credibility={value.credibility}
                              />
                            )}
                            <SourceLink url={value.source} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {timeline.length > 0 && (
            <section className="knowledge-section">
              <h3>
                <CalendarDays size={14} /> 大事记 · {timeline.length} 条
              </h3>
              <ol className="knowledge-timeline">
                {timeline.map((item, index) => (
                  <li key={index}>
                    <span className="knowledge-timeline-date">{item.date}</span>
                    <span className="knowledge-timeline-what">{item.what}</span>
                    <span className="knowledge-fact-meta">
                      {item.credibility && (
                        <CredibilityBadge credibility={item.credibility} />
                      )}
                      <SourceLink url={item.source} />
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {audio.length > 0 && (
            <section className="knowledge-section">
              <h3>
                <Volume2 size={14} /> 讲解音频 · {audio.length} 条
              </h3>
              <ul className="knowledge-audio-list">
                {audio.map((item, index) => (
                  <li key={index}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                      <ExternalLink size={12} />
                    </a>
                    <small>
                      {item.platform}
                      {item.author ? ` · ${item.author}` : ""}
                      {typeof item.minutes === "number"
                        ? ` · ${item.minutes} 分钟`
                        : ""}
                      {typeof item.plays === "number"
                        ? ` · ${item.plays} 播放`
                        : ""}
                    </small>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {images.length > 0 && (
            <section className="knowledge-section">
              <h3>
                <ImageIcon size={14} /> 图库 · {images.length} 张
              </h3>
              <div className="knowledge-gallery">
                {images.map((image, index) => (
                  <figure key={index}>
                    <a
                      href={image.source}
                      target="_blank"
                      rel="noreferrer"
                      title={`${image.title} · ${image.author} · ${image.license}`}
                    >
                      <img src={image.url} alt={image.title} loading="lazy" />
                    </a>
                    <figcaption>
                      <span className="knowledge-gallery-title">
                        {image.title}
                      </span>
                      <span className="knowledge-gallery-meta">
                        {image.author} · {image.license}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <footer className="knowledge-modal-foot">
            <p>
              <MapleLeaf size={11} style={{ verticalAlign: "-1px" }} /> 数据来自
              <a
                href="https://qixia.winnielyu.com/"
                target="_blank"
                rel="noreferrer"
              >
                栖霞知识库
              </a>
              ，为机器整理草稿；同一字段多种说法已并列，C
              级内容以出处原文为准。图片来自维基共享资源开放许可，转用须按各自
              license 署名。
            </p>
          </footer>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function PlaceKnowledge({
  place,
  onExpand,
}: {
  place: Place;
  onExpand: () => void;
}) {
  const knowledge = getQixiaKnowledgeByCode(place.referenceCode);
  if (!knowledge) return null;

  const facts = knowledge.keyFacts ?? [];
  const timeline = knowledge.timeline ?? [];
  const images = knowledge.images ?? [];
  const audio = knowledge.audio ?? [];

  return (
    <div className="place-knowledge">
      <div className="place-knowledge-title">
        <MapleLeaf size={13} />
        <span>景点知识 · 栖霞知识库</span>
      </div>

      {knowledge.kbCardId ? (
        <>
          {knowledge.summary && (
            <p className="place-knowledge-summary">{knowledge.summary}</p>
          )}

          <button
            type="button"
            className="place-knowledge-open"
            onClick={onExpand}
          >
            <span className="place-knowledge-open-main">
              <MapleLeaf size={15} />
              查看完整知识卡片
            </span>
            <span className="place-knowledge-open-sub">
              {facts.length ? `${facts.length} 项史实` : ""}
              {timeline.length ? ` · ${timeline.length} 条大事记` : ""}
              {audio.length ? ` · ${audio.length} 条音频` : ""}
              {images.length ? ` · ${images.length} 张图` : ""}
            </span>
          </button>
        </>
      ) : (
        <p className="place-knowledge-missing">
          {knowledge.note ?? "栖霞知识库暂无该景点的独立资料。"}
        </p>
      )}
    </div>
  );
}

export { KnowledgeModal };
