"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useAui } from "@assistant-ui/react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  LocateFixed,
  MapPin,
  Search,
  RefreshCw,
  X,
  Route,
  Mountain,
  BellRing,
  ChevronDown,
} from "lucide-react";
import { placeCategories, type PlaceFilter } from "@/lib/place-catalog";
import { referenceScenicPlaces } from "@/lib/scenic-places";
import { mapSearchCatalog, searchMapPlaces } from "@/lib/map-search";
import { locationQuality } from "@/lib/location-quality";
import {
  createProximityState,
  resetProximityPending,
  updateProximity,
} from "@/lib/proximity";
import { loadAmap } from "./load-amap";
import { KnowledgeModal, PlaceKnowledge } from "./place-knowledge";
import { getQixiaKnowledgeByCode } from "@/lib/qixia-knowledge";
import { addAutumnLayer } from "./autumn-layer";
import { scenicNavigation } from "./scenic-navigation";
import { scenicCenter, scenicPlaces, withinScenicView } from "@/lib/qixia-map";
import type { MapAPI, MapInstance, LngLat, Overlay, Place } from "./amap-types";
import "./map.css";
import "./autumn-map.css";
import "./scenic-labels.css";

type Position = { point: LngLat; accuracy: number; timestamp: number };
function subscribeDock() {
  return () => {};
}
const getDockNode = () => document.getElementById("qixia-location-dock");
const getPlaceDockNode = () => document.getElementById("qixia-place-dock");
const getServerDock = () => null;
export function MapWorkspace() {
  const runtime = useAui();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const sdk = useRef<MapAPI | null>(null);
  const navigation = useRef<ReturnType<typeof scenicNavigation> | null>(null);
  const selectionFrame = useRef(0);
  const autumnLayer = useRef<Awaited<ReturnType<typeof addAutumnLayer>> | null>(
    null,
  );
  const [illustrated, setIllustrated] = useState(true);
  const [dotsOnly, setDotsOnly] = useState(false);
  const positionOverlays = useRef<Overlay[]>([]);
  const walking = useRef<InstanceType<MapAPI["Walking"]> | null>(null);
  const watch = useRef<number | null>(null);
  const generation = useRef(0);
  const latestFix = useRef(0);
  const placePanel = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "missing" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    autumnLayer.current?.setPaperVisible(illustrated);
  }, [illustrated, state]);
  const [retry, setRetry] = useState(0);
  const [mcp, setMcp] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PlaceFilter>("全部");
  const places = useMemo(
    () => searchMapPlaces(query, category),
    [query, category],
  );
  const filterWanted = useRef<ReadonlySet<string>>(
    new Set(mapSearchCatalog.map((place) => place.id)),
  );
  const [selected, setSelectedState] = useState<Place | null>(null);
  const selectedRef = useRef<Place | null>(null);
  const setSelected = useCallback((place: Place | null) => {
    selectedRef.current = place;
    setSelectedState(place);
  }, []);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [locationNote, setLocationNote] = useState("");
  const [locationFailure, setLocationFailure] = useState<number | null>(null);
  const [clock, setClock] = useState(() => Date.now());
  const [routeNote, setRouteNote] = useState("");
  const routeVersion = useRef(0);
  const proximity = useRef(createProximityState());
  const targets = useRef<Place[]>([]);
  const autoRef = useRef(true);
  const resumeAfter = useRef(0);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const autoCount = referenceScenicPlaces.length;
  const [autoNote, setAutoNote] = useState("开启定位后自动检测附近景点");
  const [nearby, setNearby] = useState<{
    place: Place;
    distance: number;
  } | null>(null);
  const routeOverlay = useRef<Overlay | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const dockNode = useSyncExternalStore(
    subscribeDock,
    getDockNode,
    getServerDock,
  );
  const placeDockNode = useSyncExternalStore(
    subscribeDock,
    getPlaceDockNode,
    getServerDock,
  );
  const clearWalk = useCallback(() => {
    walking.current?.clear();
    routeOverlay.current?.setMap(null);
    routeOverlay.current = null;
  }, []);
  const select = useCallback(
    (place: Place, reveal = false) => {
      place = mapSearchCatalog.find((item) => item.id === place.id) ?? place;
      cancelAnimationFrame(selectionFrame.current);
      routeVersion.current++;
      clearWalk();
      setRouteNote("");
      const next =
        !reveal && selectedRef.current?.id === place.id ? null : place;
      setSelected(next);
      setKnowledgeOpen(false);
      autumnLayer.current?.setSelected(next?.id ?? null);
      if (!next) return;
      if (reveal) setPanelOpen(!window.matchMedia("(max-width:720px)").matches);
      if (reveal)
        selectionFrame.current = requestAnimationFrame(() =>
          navigation.current?.reveal(place.location),
        );
    },
    [clearWalk, setSelected],
  );
  useEffect(() => {
    const ids = new Set(places.map((place) => place.id));
    filterWanted.current = ids;
    autumnLayer.current?.setFilter(ids);
  }, [places]);
  const closePlacePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);
  useEffect(() => {
    targets.current = referenceScenicPlaces.map(
      (place) => scenicPlaces.find((item) => item.id === place.id) ?? place,
    );
  }, []);
  const invalidatePending = useCallback(() => {
    routeVersion.current++;
    generation.current++;
  }, []);
  useEffect(() => {
    if (!panelOpen) return;
    const dismiss = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          ".scenic-place-marker, .scenic-site-dot, .scenic-site-label",
        )
      )
        return;
      // 知识浮层打开时，点击由浮层自身处理，不要顺带收起地点面板
      if (knowledgeOpen) return;
      if (!placePanel.current?.contains(target as Node)) closePlacePanel();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // 知识浮层打开时，Esc 只关闭浮层，不收起地点面板
        if (knowledgeOpen) return;
        closePlacePanel();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [panelOpen, knowledgeOpen, closePlacePanel]);
  useEffect(() => {
    let cancelled = false;
    const abort = new AbortController();
    async function initialize() {
      try {
        const response = await fetch("/api/amap/config", {
          cache: "no-store",
          signal: abort.signal,
        });
        if (!response.ok) throw new Error("Configuration unavailable");
        const config: {
          configured: boolean;
          key: string | null;
          mcpConfigured: boolean;
        } = await response.json();
        if (cancelled) return;
        setMcp(config.mcpConfigured);
        if (!config.configured || !config.key) {
          setState("missing");
          return;
        }
        const api = await loadAmap(config.key);
        const origin = scenicCenter;
        if (cancelled || !container.current) return;
        sdk.current = api;
        map.current = new api.Map(container.current, {
          center: [origin.lng, origin.lat],
          zoom: 16,
          features: ["bg", "road"],
          viewMode: "2D",
          rotateEnable: false,
          pitchEnable: false,
          resizeEnable: true,
          doubleClickZoom: false,
        });
        const view = map.current;
        navigation.current = scenicNavigation(view, container.current);
        autumnLayer.current = await addAutumnLayer(
          api,
          map.current,
          select,
          abort.signal,
        );
        if (cancelled) {
          autumnLayer.current.remove();
          return;
        }
        autumnLayer.current.setFilter(filterWanted.current);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    }
    void initialize();
    const resize = new ResizeObserver(() => navigation.current?.resize());
    if (container.current) resize.observe(container.current);
    const tick = window.setInterval(() => setClock(Date.now()), 10000);
    const visibility = () => {
      resetProximityPending(proximity.current);
      setNearby(null);
      if (!document.hidden) {
        resumeAfter.current = Date.now();
        setAutoNote("等待新的位置后恢复附近提示");
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelled = true;
      abort.abort();
      invalidatePending();
      if (watch.current !== null)
        navigator.geolocation.clearWatch(watch.current);
      watch.current = null;
      resize.disconnect();
      clearInterval(tick);
      cancelAnimationFrame(selectionFrame.current);
      document.removeEventListener("visibilitychange", visibility);
      routeOverlay.current?.setMap(null);
      autumnLayer.current?.remove();
      autumnLayer.current = null;
      navigation.current = null;
      map.current?.destroy();
      map.current = null;
    };
  }, [retry, select, invalidatePending]);
  function stopLocation() {
    setLocationFailure(null);
    generation.current++;
    if (watch.current !== null) navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
    positionOverlays.current.forEach((item) => item.setMap(null));
    positionOverlays.current = [];
    clearWalk();
    routeVersion.current++;
    setRouteNote("");
    setTracking(false);
    setPosition(null);
    setLocationNote("已停止定位");
    resetProximityPending(proximity.current);
    setNearby(null);
    setAutoNote("自动提示已暂停");
  }
  function startLocation() {
    if (tracking) {
      stopLocation();
      return;
    }
    if (!window.isSecureContext) {
      setLocationNote("定位需要 HTTPS，请通过安全链接访问。");
      return;
    }
    if (!navigator.geolocation) {
      setLocationNote("当前浏览器不支持定位，可点击地图地点浏览。");
      return;
    }
    const api = sdk.current,
      view = map.current;
    if (!api || !view) return;
    setLocationFailure(null);
    const session = ++generation.current;
    resumeAfter.current = Date.now();
    resetProximityPending(proximity.current);
    let first = true;
    let centeredUsable = false;
    setTracking(true);
    setLocationNote("正在获取位置，请允许浏览器定位…");
    watch.current = navigator.geolocation.watchPosition(
      (fix) => {
        if (generation.current !== session) return;
        const captured = fix.timestamp;
        latestFix.current = captured;
        api.convertFrom(
          [fix.coords.longitude, fix.coords.latitude],
          "gps",
          (status, result) => {
            if (
              generation.current !== session ||
              captured !== latestFix.current
            )
              return;
            const point = result.locations?.[0];
            if (status !== "complete" || !point) {
              setLocationNote("位置坐标转换失败，请稍后重试。");
              return;
            }
            const fixQuality = locationQuality(fix.coords.accuracy, captured);
            const approximate = fixQuality !== "usable";
            positionOverlays.current.forEach((item) => item.setMap(null));
            positionOverlays.current = [
              new api.Circle({
                map: view,
                center: point,
                radius: fix.coords.accuracy,
                strokeColor: approximate ? "#b0873d" : "#5279ac",
                fillColor: approximate ? "#e2bc72" : "#80a9d5",
                fillOpacity: 0.15,
                strokeWeight: 1,
              }),
              new api.Marker({
                map: view,
                position: point,
                anchor: "center",
                content: approximate
                  ? '<span class="visitor-location-dot is-approximate"><span class="visitor-location-label">位置估计中心</span></span>'
                  : '<span class="visitor-location-dot"></span>',
              }),
            ];
            const positionFix = {
              point,
              accuracy: fix.coords.accuracy,
              timestamp: captured,
            };
            setPosition(positionFix);
            if (
              autoRef.current &&
              !document.hidden &&
              captured >= resumeAfter.current
            ) {
              const result = updateProximity(
                proximity.current,
                targets.current,
                positionFix,
              );
              const notes: Record<string, string> = {
                accuracy: "定位误差较大，暂不自动判断景点",
                stale: "位置已过时，等待新位置",
                ambiguous: "附近景点距离接近，请点选确认",
                waiting: "正在确认附近景点，请稍候…",
                inside: "已提示该景点，停留期间不重复弹出",
                cooldown: "该景点近期已提示，不重复打扰",
                none: "持续检测附近景点中",
                entered: "发现附近景点",
              };
              setAutoNote(
                targets.current.length
                  ? (notes[result.reason] ?? "持续检测附近景点中")
                  : "景点数据尚未载入，请切换到景点分类重试",
              );
              const match = targets.current.find(
                (place) => place.id === result.placeId,
              );
              if (match && result.distance !== undefined)
                setNearby({ place: match, distance: result.distance });
              else
                setNearby((previous) =>
                  previous &&
                  proximity.current.inside.has(previous.place.id) &&
                  !["accuracy", "stale"].includes(result.reason)
                    ? previous
                    : null,
                );
            }
            setClock(Date.now());
            setLocationNote("");
            setLocationFailure(null);
            if (!withinScenicView(point))
              setLocationNote(
                "你的位置在栖霞山浏览范围外，地图仍保持景区视角。",
              );
            if (
              withinScenicView(point) &&
              (first || (!centeredUsable && fixQuality === "usable"))
            ) {
              const span = Math.max(
                120,
                Math.min(
                  container.current?.clientWidth ?? 320,
                  container.current?.clientHeight ?? 320,
                ) - 80,
              );
              const scale =
                156543.03392 * Math.cos((point.lat * Math.PI) / 180);
              const zoom = Math.max(
                15,
                Math.min(
                  16,
                  Math.floor(
                    Math.log2((scale * span) / (2 * fix.coords.accuracy)),
                  ),
                ),
              );
              view.setZoomAndCenter(zoom, point);
              first = false;
              if (fixQuality === "usable") centeredUsable = true;
            }
          },
        );
      },
      (error) => {
        if (generation.current !== session) return;
        if (error.code === 1 || first) {
          stopLocation();
          setLocationNote(
            error.code === 1
              ? "浏览器未获得定位权限，已停止本次定位。"
              : error.code === 3
                ? "浏览器定位超时：15秒内未获得位置，已停止本次定位。"
                : "浏览器定位服务暂时不可用，已停止本次定位。",
          );
        } else {
          resetProximityPending(proximity.current);
          setNearby(null);
          setAutoNote("位置更新暂时中断，自动提示已暂停");
          setLocationNote(
            "位置更新暂时中断，正在重试；下次收到位置后自动恢复。",
          );
        }
        setLocationFailure(error.code);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }
  const quality = position
    ? locationQuality(position.accuracy, position.timestamp, clock)
    : null;
  function planWalk() {
    const api = sdk.current,
      view = map.current;
    if (
      !api ||
      !view ||
      !selected ||
      !position ||
      locationQuality(position.accuracy, position.timestamp) !== "usable"
    )
      return;
    clearWalk();
    const version = ++routeVersion.current;
    const planner = new api.Walking({ hideMarkers: true });
    walking.current = planner;
    setRouteNote("正在查询步行路线…");
    planner.search(
      [position.point.lng, position.point.lat],
      [selected.location.lng, selected.location.lat],
      (status, result) => {
        if (version !== routeVersion.current) return;
        const route = result.routes?.[0];
        if (status === "complete" && route) {
          const path = route.steps?.flatMap((step) => step.path) ?? [];
          routeOverlay.current = new api.Polyline({
            map: view,
            path,
            strokeColor: "#075dcc",
            strokeWeight: 7,
            strokeOpacity: 1,
            isOutline: true,
            outlineColor: "#ffffff",
            borderWeight: 3,
            showDir: true,
            zIndex: 80,
            lineJoin: "round",
            lineCap: "round",
          });
        }
        setRouteNote(
          status === "complete" && route
            ? "约" +
                Math.round(route.distance) +
                "米 · 高德估计" +
                Math.ceil(route.time / 60) +
                "分钟。山路实际通行请以景区指引为准。"
            : "未查到可用步行路线，请参考景区路牌，勿按直线穿行。",
        );
      },
    );
  }
  function ask() {
    if (!selected) return;
    // 气泡里只说人话；坐标、POI 与「不代表当前位置」放在 metadata 里，
    // 由 app/api/chat/route.ts 注入给模型，不显示在对话里。
    runtime.thread().append({
      role: "user",
      content: [{ type: "text", text: `介绍一下${selected.name}` }],
      metadata: {
        custom: {
          qixiaPlace: {
            name: selected.name,
            referenceCode: selected.referenceCode,
            referenceName: selected.referenceName,
            address:
              typeof selected.address === "string"
                ? selected.address
                : undefined,
            lng: selected.location.lng,
            lat: selected.location.lat,
          },
        },
      },
    });
  }
  function updateSearch(
    nextQuery: string,
    nextCategory: PlaceFilter = category,
  ) {
    setQuery(nextQuery);
    setCategory(nextCategory);
    if (
      selected &&
      !searchMapPlaces(nextQuery, nextCategory).some(
        (place) => place.id === selected.id,
      )
    ) {
      setSelected(null);
      setKnowledgeOpen(false);
      autumnLayer.current?.setSelected(null);
      clearWalk();
      routeVersion.current++;
      setRouteNote("");
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    setQuery(query.trim());
  }
  return (
    <section
      className={`scenic-map-stage ${illustrated ? "is-autumn" : "is-standard"}${dotsOnly ? " is-dots-only" : ""}`}
      aria-label="栖霞山地图导览"
    >
      <div
        className="scenic-map-canvas"
        ref={container}
        aria-label="高德地图"
      />
      <div className="autumn-map-tools" aria-label="地图视图控制">
        <div className="autumn-view-switch" role="group" aria-label="地图风格">
          {[true, false].map((value) => (
            <button
              key={String(value)}
              disabled={state !== "ready"}
              aria-pressed={illustrated === value}
              onClick={() => {
                setIllustrated(value);
              }}
            >
              {value ? "赏秋手绘" : "高德底图"}
            </button>
          ))}
        </div>
        <div className="autumn-display-tools">
          <button
            disabled={state !== "ready"}
            aria-pressed={dotsOnly}
            aria-label="隐藏景点插画与名称，只保留节点"
            title="隐藏景点插画与名称，只保留节点"
            onClick={() => setDotsOnly((value) => !value)}
          >
            仅节点
          </button>
        </div>
        <div className="autumn-zoom-tools">
          <button
            disabled={state !== "ready"}
            aria-label="放大地图"
            onClick={() => {
              navigation.current?.zoomBy(1);
            }}
          >
            ＋
          </button>
          <button
            disabled={state !== "ready"}
            aria-label="缩小地图"
            onClick={() => {
              navigation.current?.zoomBy(-1);
            }}
          >
            −
          </button>
          <button
            disabled={state !== "ready"}
            onClick={() => navigation.current?.fitOverview()}
          >
            全景
          </button>
        </div>
      </div>
      <div className="autumn-map-caption">
        <span className="autumn-caption-dot" />
        <span>景点实位 · 插画意象</span>
        <small>白色：园内道路 · 蓝色：步行导航</small>
      </div>
      {state !== "ready" && (
        <div className="map-connection-state" role="status">
          <Mountain size={32} strokeWidth={1.3} />
          <h1>栖霞山地图</h1>
          <p>
            {state === "loading"
              ? "正在连接高德地图…"
              : state === "missing"
                ? "地图配置尚未完成。请在本地配置中填写高德 JS API Key 和对应安全密钥。"
                : "地图连接失败，请检查网络、Key 类型、域名限制及安全密钥。"}
          </p>
          {state !== "loading" && (
            <button
              onClick={() => {
                setState("loading");
                setRetry((value) => value + 1);
              }}
            >
              <RefreshCw size={14} />
              重新连接
            </button>
          )}
          <a href="https://console.amap.com/" target="_blank" rel="noreferrer">
            高德开放平台
            <ArrowUpRight size={13} />
          </a>
        </div>
      )}
      {placeDockNode &&
        createPortal(
          <div
            ref={placePanel}
            className={`map-place-panel map-place-dock map-search-panel ${panelOpen ? "" : "is-collapsed"}`}
          >
            <button
              type="button"
              className="map-panel-title"
              aria-expanded={panelOpen}
              aria-controls="map-panel-body"
              onClick={() =>
                panelOpen ? closePlacePanel() : setPanelOpen(true)
              }
            >
              <MapPin size={15} />
              <strong>景点搜索</strong>

              <ChevronDown size={15} className="map-panel-chevron" />
            </button>
            <div className="map-panel-body" id="map-panel-body">
              <form className="map-search" onSubmit={submit}>
                <Search size={16} />
                <input
                  aria-label="搜索景点与设施"
                  placeholder="搜索景点、厕所、餐饮…"
                  value={query}
                  onChange={(event) => updateSearch(event.target.value)}
                  maxLength={60}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="清空搜索"
                    onClick={() => updateSearch("")}
                  >
                    <X size={14} />
                  </button>
                )}
                <button type="submit">搜索</button>
              </form>
              <div
                className="map-category-list"
                role="group"
                aria-label="地点类别"
              >
                {(["全部", ...placeCategories] as const).map((item) => (
                  <button
                    key={item}
                    aria-pressed={category === item}
                    data-category={item}
                    onClick={() => {
                      setCategory(item);
                      setSelected(null);
                      setKnowledgeOpen(false);
                      autumnLayer.current?.setSelected(null);
                      clearWalk();
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="map-search-note" role="status">
                {places.length
                  ? "找到 " + places.length + " 处地点"
                  : "没有匹配地点，试试其他关键词或类别"}
              </p>
              <div
                className="map-results map-search-results"
                aria-label="搜索结果"
              >
                {places.map((place) => (
                  <button
                    className={selected?.id === place.id ? "is-selected" : ""}
                    key={place.id}
                    onClick={() => select(place, true)}
                  >
                    <span data-category={place.category}>{place.number}</span>
                    <span>
                      <strong>{place.name}</strong>
                      <small>{place.address || place.category}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          placeDockNode,
        )}
      {selected && (
        <div className="map-place-detail map-selection-card">
          <button
            className="map-detail-close"
            aria-label="关闭地点详情"
            onClick={() => {
              setSelected(null);
              setKnowledgeOpen(false);
              autumnLayer.current?.setSelected(null);
              clearWalk();
              routeVersion.current++;
              setRouteNote("");
            }}
          >
            <X size={14} />
          </button>
          <span className="map-detail-label">已选择地点</span>
          <h2>{selected.name}</h2>
          <p>{typeof selected.address === "string" ? selected.address : ""}</p>
          <div className="map-detail-actions">
            <button onClick={ask}>询问助手</button>
            <button onClick={planWalk} disabled={quality !== "usable"}>
              <Route size={13} />
              步行路线
            </button>
            <a
              href={
                "https://uri.amap.com/marker?position=" +
                selected.location.lng +
                "," +
                selected.location.lat +
                "&name=" +
                encodeURIComponent(selected.name) +
                "&coordinate=gaode&callnative=0"
              }
              target="_blank"
              rel="noreferrer"
              aria-label="在高德中查看地点"
            >
              <ArrowUpRight size={16} />
            </a>
          </div>
          <p className="map-route-note" role="status">
            {routeNote ||
              (quality !== "usable"
                ? "获取较准确的新位置后，可查询步行路线。"
                : "路线依据高德道路数据，山中小路可能未覆盖。")}
          </p>
          <PlaceKnowledge
            place={selected}
            onExpand={() => setKnowledgeOpen(true)}
          />
        </div>
      )}

      {nearby && tracking && autoEnabled && quality === "usable" && (
        <aside
          className="map-nearby-card"
          aria-label="附近景点提示"
          role="status"
          aria-live="polite"
        >
          <button
            className="map-nearby-close"
            aria-label="关闭附近景点提示"
            onClick={() => setNearby(null)}
          >
            <X size={16} />
          </button>
          <div className="map-nearby-label">
            <BellRing size={15} />
            附近景点
          </div>
          <h2>{nearby.place.name}</h2>
          <p className="map-nearby-distance">
            直线约 {Math.round(nearby.distance)} 米 · 位置预估误差{" "}
            {position ? Math.ceil(position.accuracy) : ""} 米
          </p>
          <p>
            {typeof nearby.place.address === "string"
              ? nearby.place.address
              : "高德地点资料"}
          </p>
          <p className="map-nearby-note">
            你可能在该景点附近，请结合路牌确认。距离不代表步行路程。
          </p>
          <button
            className="map-nearby-open"
            onClick={() => {
              select(nearby.place, true);
              setNearby(null);
            }}
          >
            查看这个地点
            <ArrowUpRight size={14} />
          </button>
          <small>来源：高德地点信息</small>
        </aside>
      )}
      {dockNode &&
        createPortal(
          <div
            className={`map-location-panel map-location-dock ${dockOpen ? "is-open" : ""} ${quality === "approximate" ? "is-approximate" : ""}`}
            aria-label="栖霞山定位"
          >
            <div className="map-location-actions">
              <button
                onClick={startLocation}
                disabled={state !== "ready"}
                className={tracking ? "is-tracking" : ""}
                aria-label={
                  tracking
                    ? "停止定位"
                    : locationFailure
                      ? "重新定位"
                      : "开始定位"
                }
              >
                <LocateFixed size={15} />
                <span className="map-location-button-label">
                  {tracking
                    ? "停止定位"
                    : locationFailure
                      ? "重新定位"
                      : "开始定位"}
                </span>
              </button>
              <button
                className="map-location-chevron"
                aria-expanded={dockOpen}
                aria-label={dockOpen ? "收起定位详情" : "展开定位详情"}
                onClick={() => setDockOpen((value) => !value)}
              >
                <ChevronDown size={15} />
              </button>
            </div>
            <div className="map-location-body">
              <div className="map-location-body-inner">
                <div className="map-location-actions">
                  <button
                    disabled={state !== "ready"}
                    onClick={() => {
                      navigation.current?.fitOverview();
                    }}
                  >
                    回到栖霞山
                  </button>
                </div>
                <p className="map-location-note" role="status">
                  {locationNote ||
                    (position
                      ? quality === "stale"
                        ? "位置已过时，请等待定位更新"
                        : (quality === "approximate"
                            ? "粗略定位：误差半径 "
                            : "预估误差半径 ") +
                          Math.ceil(position.accuracy) +
                          " 米"
                      : "点击开始后持续定位，靠近景点自动提示，可随时停止。")}
                </p>
                {position && (
                  <small className="map-location-source">
                    浏览器位置估计 · 定位时间{" "}
                    {new Date(position.timestamp).toLocaleTimeString("zh-CN", {
                      hour12: false,
                    })}
                  </small>
                )}
                {quality === "approximate" && (
                  <p className="map-coarse-help">
                    精度不足，暂停景点自动提示与步行路线。建议在手机开启精确定位后测试。
                  </p>
                )}
                {locationFailure !== null && (
                  <details className="map-location-help" open>
                    <summary>定位失败排查</summary>
                    <ol>
                      <li>
                        Windows 设置 → 隐私和安全性 →
                        位置，检查定位服务与桌面应用访问权限。
                      </li>
                      <li>
                        在独立的 Edge
                        浏览器打开本站，并允许网站使用位置，再点击重新定位。
                      </li>
                      <li>
                        手机测试请开启系统定位，通过 HTTPS
                        地址访问。电脑内置预览不能保证返回位置。
                      </li>
                    </ol>
                    <a
                      href="https://support.microsoft.com/zh-cn/windows/privacy/windows-location-service-and-privacy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      查看 Windows 定位说明
                      <ArrowUpRight size={11} />
                    </a>
                  </details>
                )}
                <label className="map-auto-toggle">
                  <input
                    type="checkbox"
                    checked={autoEnabled}
                    onChange={(event) => {
                      const enabled = event.target.checked;
                      autoRef.current = enabled;
                      setAutoEnabled(enabled);
                      resetProximityPending(proximity.current);
                      setNearby(null);
                      setAutoNote(
                        enabled
                          ? "等待新的位置后检测附近景点"
                          : "自动提示已关闭",
                      );
                    }}
                  />
                  <span>附近景点自动提示</span>
                  <small>已载入{autoCount}处</small>
                </label>
                {tracking && autoEnabled && (
                  <p className="map-auto-status" role="status">
                    {autoNote}
                  </p>
                )}
                <small>
                  {mcp ? "助手已配置高德查询" : "助手高德查询尚未配置"}
                </small>
              </div>
            </div>
          </div>,
          dockNode,
        )}
      {selected && knowledgeOpen && (
        <KnowledgeModal
          knowledge={getQixiaKnowledgeByCode(selected.referenceCode)!}
          place={selected}
          onClose={() => setKnowledgeOpen(false)}
        />
      )}
    </section>
  );
}
