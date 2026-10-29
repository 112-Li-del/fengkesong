"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Bus,
  CalendarDays,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  ListChecks,
  MapPin,
  Route,
  Sparkles,
  Utensils,
  Volume2,
  X,
} from "lucide-react";
import { getQixiaKnowledgeByCode } from "@/lib/qixia-knowledge";
import type {
  QixiaFact,
  QixiaPlaceKnowledge,
  VisitorGroup,
} from "@/lib/qixia-knowledge";
import type { Place } from "./amap-types";

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

/** 游玩信息维度（顺序即展示顺序） */
const VISITOR_GROUPS: {
  group: VisitorGroup;
  title: string;
  icon: React.ReactNode;
}[] = [
  { group: "time", title: "开放时间", icon: <Clock size={13} /> },
  { group: "location", title: "位置", icon: <MapPin size={13} /> },
  { group: "transport", title: "交通到达", icon: <Bus size={13} /> },
  { group: "route", title: "游览路线", icon: <Route size={13} /> },
  { group: "view", title: "最佳观赏", icon: <Eye size={13} /> },
  { group: "service", title: "服务设施", icon: <Utensils size={13} /> },
];

/** 速览区亮点徽章：从这些「重量级」字段提取短语 */
const HIGHLIGHT_KEYS = [
  "地位",
  "历史地位",
  "文化地位",
  "景区地位",
  "称号",
  "并称",
  "文物保护级别",
  "始建年代",
  "著名景点",
  "评价",
  "景观特色",
  "特色",
  "看点",
];

/** 提取速览区亮点徽章短语（去重，最多 4 个） */
function extractHighlights(facts: QixiaFact[]) {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const fact of facts) {
    if (!HIGHLIGHT_KEYS.includes(fact.key)) continue;
    for (const v of fact.values) {
      const t = (v.value + (v.unit ? ` ${v.unit}` : "")).trim();
      if (t && !seen.has(t)) {
        seen.add(t);
        result.push(t);
      }
    }
    if (result.length >= 4) break;
  }
  return result.slice(0, 4);
}

/** 按维度分组史实：有 group 归游玩类（同 key 合并 values），无 group 归历史。 */
function groupVisitorFacts(facts: QixiaFact[]) {
  const visitor = new Map<VisitorGroup, Map<string, QixiaFact>>();
  const history: QixiaFact[] = [];
  for (const fact of facts) {
    if (!fact.group) {
      history.push(fact);
      continue;
    }
    if (!visitor.has(fact.group)) visitor.set(fact.group, new Map());
    const byKey = visitor.get(fact.group)!;
    const existing = byKey.get(fact.key);
    if (existing) {
      existing.values.push(...fact.values);
    } else {
      byKey.set(fact.key, {
        key: fact.key,
        group: fact.group,
        values: [...fact.values],
      });
    }
  }
  return { visitor, history };
}

/** 一句话定位：取简介第一句。 */
function getLead(knowledge: QixiaPlaceKnowledge) {
  const s = knowledge.summary ?? "";
  if (!s) return "";
  const m = s.match(/^[^。！？!?\n]+/);
  return (m ? m[0] : s.slice(0, 40)).trim();
}

/** 速览区实用信息条：时间 / 交通 / 位置各取第一条。 */
function buildPractical(visitor: Map<VisitorGroup, Map<string, QixiaFact>>) {
  const find = (group: VisitorGroup) => {
    for (const fact of visitor.get(group)?.values() ?? []) {
      if (fact.values.length) return fact.values[0]?.value ?? "";
    }
    return "";
  };
  return {
    time: find("time"),
    transport: find("transport"),
    location: find("location"),
  };
}

/** 单个史实卡片的 value 列表。 */
function FactValues({ fact }: { fact: QixiaFact }) {
  return (
    <ul>
      {fact.values.map((value, valueIndex) => (
        <li key={valueIndex}>
          <span className="knowledge-fact-value">
            {formatFactValue(value.value, value.unit)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** 关键史实（历史典故）区块：两列卡片。 */
function HistoryFactsSection({ facts }: { facts: QixiaFact[] }) {
  if (facts.length === 0) return null;
  return (
    <section className="knowledge-section">
      <h3>
        <ListChecks size={14} /> 关键史实 · {facts.length} 项
      </h3>
      <div className="knowledge-facts">
        {facts.map((fact, index) => (
          <div className="knowledge-fact" key={index}>
            <div className="knowledge-fact-key">{fact.key}</div>
            <FactValues fact={fact} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** 红枫渐变徽章：给游玩信息的图标统一套上精致容器 */
function IconBadge({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <span
      className={`knowledge-icon-badge${small ? " knowledge-icon-badge--sm" : ""}`}
    >
      {children}
    </span>
  );
}

/** 游玩信息区块：五维度分组，字段多处用紧凑表格对齐。 */
function VisitorSection({
  visitor,
}: {
  visitor: Map<VisitorGroup, Map<string, QixiaFact>>;
}) {
  const groups = VISITOR_GROUPS.map((g) => ({
    ...g,
    facts: [...(visitor.get(g.group)?.values() ?? [])],
  })).filter((g) => g.facts.length > 0);
  if (groups.length === 0) return null;
  return (
    <section className="knowledge-section knowledge-visitor">
      <h3>
        <IconBadge>
          <Compass size={15} />
        </IconBadge>
        游玩信息
      </h3>
      <div className="knowledge-visitor-groups">
        {groups.map((g) => {
          const hideLabel = g.facts.length === 1 && g.facts[0]?.key === g.title;
          return (
            <div className="knowledge-visitor-group" key={g.group}>
              <div className="knowledge-visitor-group-head">
                <IconBadge small>{g.icon}</IconBadge>
                <span>{g.title}</span>
              </div>
              <div className="knowledge-visitor-table">
                {g.facts.map((fact, i) => (
                  <div className="knowledge-visitor-row" key={i}>
                    {!hideLabel && (
                      <span className="knowledge-visitor-label">
                        {fact.key}
                      </span>
                    )}
                    <div className="knowledge-visitor-values">
                      {fact.values.map((v, vi) => (
                        <div className="knowledge-visitor-value" key={vi}>
                          <span>{formatFactValue(v.value, v.unit)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 速览区：一句话定位 + 亮点徽章 + 关键实用信息。 */
function OverviewSection({
  knowledge,
  highlights,
  practical,
}: {
  knowledge: QixiaPlaceKnowledge;
  highlights: string[];
  practical: { time: string; transport: string; location: string };
}) {
  const lead = getLead(knowledge);
  const hasPractical = !!(
    practical.time ||
    practical.transport ||
    practical.location
  );
  if (!lead && highlights.length === 0 && !hasPractical) return null;
  return (
    <section className="knowledge-section knowledge-overview">
      {lead && <p className="knowledge-overview-lead">{lead}</p>}
      {highlights.length > 0 && (
        <div className="knowledge-highlights">
          {highlights.map((h, i) => (
            <span className="knowledge-highlight" key={i}>
              <Sparkles size={12} />
              {h}
            </span>
          ))}
        </div>
      )}
      {hasPractical && (
        <div className="knowledge-practical">
          {practical.time && (
            <span className="knowledge-practical-item">
              <Clock size={13} />
              {practical.time}
            </span>
          )}
          {practical.transport && (
            <span className="knowledge-practical-item">
              <Bus size={13} />
              {practical.transport}
            </span>
          )}
          {practical.location && (
            <span className="knowledge-practical-item">
              <MapPin size={13} />
              {practical.location}
            </span>
          )}
        </div>
      )}
    </section>
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
  const gushu = knowledge.gushu ?? null;
  const { visitor, history } = groupVisitorFacts(facts);
  const highlights = extractHighlights(history);
  const practical = buildPractical(visitor);

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
          <OverviewSection
            knowledge={knowledge}
            highlights={highlights}
            practical={practical}
          />

          <VisitorSection visitor={visitor} />

          {knowledge.summary && (
            <section className="knowledge-section">
              <h3>
                <MapleLeaf size={13} /> 简介
              </h3>
              <p className="knowledge-summary-text">
                {stripCitations(knowledge.summary)}
              </p>
            </section>
          )}

          {knowledge.history && (
            <section className="knowledge-section">
              <h3>
                <MapleLeaf size={13} /> 来历
              </h3>
              <p className="knowledge-history-text">
                {stripCitations(knowledge.history)}
              </p>
            </section>
          )}

          {gushu && gushu.records.length > 0 && (
            <section className="knowledge-section">
              <h3>
                <BookOpen size={14} /> 古籍记载
              </h3>
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
            </section>
          )}

          <HistoryFactsSection facts={history} />

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
              ，同一信息如有多种说法，均以并列展示、供参考。图片来自维基共享资源开放许可，转用须按各自
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

      {knowledge.kbCardId || knowledge.summary ? (
        <>
          {knowledge.summary && (
            <p className="place-knowledge-summary">
              {stripCitations(knowledge.summary)}
            </p>
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
