"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  CalendarDays,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  ListChecks,
  MapPin,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import {
  buildAnswerView,
  displayAliases,
  sourceLabel,
} from "@/lib/qixia-knowledge";
import type {
  QixiaAnswerFact,
  QixiaAnswerView,
  QixiaPlaceKnowledge,
} from "@/lib/qixia-knowledge";
import { getMapPlaceKnowledge } from "@/lib/map-search";
import type { Place } from "./amap-types";
import "./knowledge-archive.css";

/** 清理正文中的引用数字记号（如 [1]、[7][8]），并归并多余空格。 */
function stripCitations(text: string) {
  return text
    .replace(/[[【]\s*\d+(?:\s*[、,，\-–]\s*\d+)*\s*[\]】]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * 渲染史实值：单位紧跟数字（去掉括号），若有「米（高）」这类带特征的单位，
 * 把特征提到前面，输出「高：11.4米」的形式。
 */
function formatFactValue(value: string, unit?: string) {
  let feature = "";
  let u = unit ?? "";
  const m = u.match(/^([^（）()]*)[（(]([^（）()]+)[）)]$/);
  if (m) {
    u = (m[1] ?? "").trim();
    feature = (m[2] ?? "").trim();
  }
  const num = value + u;
  return feature ? `${feature}：${num}` : num;
}

/** 速览区亮点徽章取自这些审核后的项目。 */
const HIGHLIGHT_LABELS = ["地位", "称号", "文物保护级别"];

/** 速览区已经展示过、不在「关键信息」里重复的项目。 */
const OVERVIEW_LABELS = new Set(["位置", ...HIGHLIGHT_LABELS]);

/** 一句话定位：取审核后简介的第一句。 */
function leadOf(view: QixiaAnswerView) {
  const m = view.overview.match(/^[^。！？!?\n]+/);
  return (m ? m[0] : view.overview).trim();
}

/** 速览区：一句话定位 + 亮点徽章 + 位置与开放时间提示。 */
function OverviewSection({
  view,
  timeNote,
}: {
  view: QixiaAnswerView;
  timeNote: boolean;
}) {
  const lead = leadOf(view);
  const highlights = view.facts
    .filter((fact) => HIGHLIGHT_LABELS.includes(fact.label))
    .map((fact) => fact.value)
    .slice(0, 4);
  const location = view.facts.find((fact) => fact.label === "位置")?.value;
  if (!lead && highlights.length === 0 && !location && !timeNote) return null;
  return (
    <section className="knowledge-section knowledge-overview">
      {lead && <p className="knowledge-overview-lead">{lead}</p>}
      {highlights.length > 0 && (
        <div className="knowledge-highlights">
          {highlights.map((h) => (
            <span className="knowledge-highlight" key={h}>
              <Sparkles size={12} />
              {h}
            </span>
          ))}
        </div>
      )}
      {(location || timeNote) && (
        <div className="knowledge-practical">
          {location && (
            <span className="knowledge-practical-item">
              <MapPin size={13} />
              {location}
            </span>
          )}
          {timeNote && (
            <span className="knowledge-practical-item">
              <Clock size={13} />
              开放时间以景区当日公告为准
            </span>
          )}
        </div>
      )}
    </section>
  );
}

/** 审核后的要点：两列卡片，每项只有一个说法。 */
function PublishedFactsSection({ facts }: { facts: QixiaAnswerFact[] }) {
  if (facts.length === 0) return null;
  return (
    <section className="knowledge-section">
      <h3>
        <ListChecks size={14} /> 关键信息 · {facts.length} 项
      </h3>
      <div className="knowledge-facts">
        {facts.map((fact) => (
          <div className="knowledge-fact" key={fact.label}>
            <div className="knowledge-fact-key">{fact.label}</div>
            <ul>
              <li>
                <span className="knowledge-fact-value">{fact.value}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function SourceTag({ source }: { source: string }) {
  const label = sourceLabel(source);
  return /^https?:\/\//.test(source) ? (
    <a
      className="knowledge-archive-source"
      href={source}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  ) : (
    <span className="knowledge-archive-source">{label}</span>
  );
}

/** 资料原文：各来源的原始说法与出处，可能互相矛盾，默认收起。 */
function SourceArchive({ knowledge }: { knowledge: QixiaPlaceKnowledge }) {
  const facts = knowledge.keyFacts ?? [];
  const timeline = knowledge.timeline ?? [];
  const history = knowledge.history ? stripCitations(knowledge.history) : "";
  if (!facts.length && !timeline.length && !history && !knowledge.note)
    return null;
  return (
    <details className="knowledge-section knowledge-archive">
      <summary>
        <FileText size={14} />
        <span>资料原文</span>
        <small>各来源的原始记载，未经审核，可能互相矛盾</small>
      </summary>
      {knowledge.note && (
        <p className="knowledge-archive-note">{knowledge.note}</p>
      )}
      {history && <p className="knowledge-archive-text">{history}</p>}
      {facts.length > 0 && (
        <dl className="knowledge-archive-facts">
          {facts.map((fact, index) => (
            <div key={index}>
              <dt>{fact.key}</dt>
              {fact.values.map((value, valueIndex) => (
                <dd key={valueIndex}>
                  {formatFactValue(value.value, value.unit)}
                  <SourceTag source={value.source} />
                </dd>
              ))}
            </div>
          ))}
        </dl>
      )}
      {timeline.length > 0 && (
        <ol className="knowledge-archive-timeline">
          {timeline.map((item, index) => (
            <li key={index}>
              <span className="knowledge-archive-date">{item.date}</span>
              {item.what}
              <SourceTag source={item.source} />
            </li>
          ))}
        </ol>
      )}
    </details>
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

  const view = buildAnswerView(knowledge);
  const audio = knowledge.audio ?? [];
  const images = knowledge.images ?? [];
  const aliases = displayAliases(knowledge);
  const gushu = knowledge.gushu ?? null;
  const timeNote =
    !view.visitorInfo &&
    (knowledge.keyFacts ?? []).some((fact) => fact.group === "time");

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
            {aliases.length > 0 && (
              <p className="knowledge-modal-sub">又名：{aliases.join("、")}</p>
            )}
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
          <OverviewSection view={view} timeNote={timeNote} />

          {(!view.overview ||
            view.overview.replace(/[。！？!?]$/, "") !== leadOf(view)) && (
            <section className="knowledge-section">
              <h3>
                <MapleLeaf size={13} /> 简介
              </h3>
              <p className="knowledge-summary-text">
                {view.overview || "这处景点的介绍还在整理中。"}
              </p>
            </section>
          )}

          <PublishedFactsSection
            facts={view.facts.filter(
              (fact) => !OVERVIEW_LABELS.has(fact.label),
            )}
          />

          {view.visitorInfo && (
            <section className="knowledge-section">
              <h3>
                <Clock size={14} /> 游览与票务 · 2026年参考
              </h3>
              <p className="knowledge-archive-note">
                {view.visitorInfo.note}（确认：{view.visitorInfo.confirmedOn}
                ；参考截止：{view.visitorInfo.validThrough}）
              </p>
              <PublishedFactsSection facts={view.visitorInfo.items} />
            </section>
          )}
          {view.timeline.length > 0 && (
            <section className="knowledge-section">
              <h3>
                <CalendarDays size={14} /> 大事记 · {view.timeline.length} 条
              </h3>
              <ol className="knowledge-timeline">
                {view.timeline.map((item, index) => (
                  <li key={index}>
                    <span className="knowledge-timeline-date">{item.date}</span>
                    <span className="knowledge-timeline-what">{item.what}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {gushu && gushu.records.length > 0 && (
            <details className="knowledge-section knowledge-archive">
              <summary>
                <BookOpen size={14} /> 古籍记载
                <small>历史文献记载，不等同于现状</small>
              </summary>
              <p className="knowledge-gushu-book">{gushu.book}</p>
              {gushu.note && (
                <p className="knowledge-gushu-note">{gushu.note}</p>
              )}
              <div className="knowledge-gushu-records">
                {gushu.records.map((record, index) => (
                  <blockquote key={index} className="knowledge-gushu-record">
                    <p className="knowledge-gushu-text">{record.text}</p>
                    <cite className="knowledge-gushu-chapter">
                      —— {record.chapter}
                    </cite>
                  </blockquote>
                ))}
              </div>
            </details>
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

          <SourceArchive knowledge={knowledge} />

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
              。正文采用已确认口径，未补充审核的条目暂沿用现有简介；古籍及各来源原始记载默认收起，历史记载不等同于现状。图片来自维基共享资源开放许可，转用须按各自
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
  const knowledge = getMapPlaceKnowledge(place);
  if (!knowledge) return null;

  const view = buildAnswerView(knowledge);
  const images = knowledge.images ?? [];
  const audio = knowledge.audio ?? [];
  const hasMore =
    view.facts.length > 0 ||
    view.timeline.length > 0 ||
    audio.length > 0 ||
    images.length > 0 ||
    (knowledge.gushu?.records.length ?? 0) > 0 ||
    (knowledge.keyFacts?.length ?? 0) > 0 ||
    (knowledge.timeline?.length ?? 0) > 0 ||
    Boolean(knowledge.history);
  const meta = [
    view.facts.length ? `${view.facts.length} 项要点` : "",
    view.timeline.length ? `${view.timeline.length} 条大事记` : "",
    audio.length ? `${audio.length} 条音频` : "",
    images.length ? `${images.length} 张图` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="place-knowledge">
      <div className="place-knowledge-title">
        <MapleLeaf size={13} />
        <span>景点知识 · 栖霞知识库</span>
      </div>

      {view.overview ? (
        <p className="place-knowledge-summary">{view.overview}</p>
      ) : (
        <p className="place-knowledge-missing">这处景点的介绍还在整理中。</p>
      )}

      {hasMore && (
        <button
          type="button"
          className="place-knowledge-open"
          onClick={onExpand}
        >
          <span className="place-knowledge-open-main">
            <MapleLeaf size={15} />
            查看完整知识卡片
          </span>
          {meta && <span className="place-knowledge-open-sub">{meta}</span>}
        </button>
      )}
    </div>
  );
}

export { KnowledgeModal };
