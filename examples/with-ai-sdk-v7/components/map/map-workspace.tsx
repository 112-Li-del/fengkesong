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
import { collectScenicPlaces } from "@/lib/scenic-places";
import {
  buildPlaceCatalog,
  filterPlaceCatalog,
  placeCategories,
  type PlaceFilter,
  type PlaceGroups,
} from "@/lib/place-catalog";
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
import {
  scenicCenter,
  scenicPlaces,
  unverifiedPlaces,
  scenicSearchResults,
  withinScenicView,
} from "@/lib/qixia-map";
import type { MapAPI, MapInstance, LngLat, Overlay, Place } from "./amap-types";
import "./map.css";
import "./autumn-map.css";
import "./scenic-labels.css";

type Position = { point: LngLat; accuracy: number; timestamp: number };
const compactQuery = "(max-width:720px), (max-height:500px)";
function subscribeCompact(callback: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getCompact = () => window.matchMedia(compactQuery).matches;
const getServerCompact = () => false;
function initialPlaceGroups(): PlaceGroups {
  return { 景点: collectScenicPlaces([]), 厕所: [], 餐饮: [], 休息: [] };
}
function findNearby(
  api: MapAPI,
  origin: LngLat,
  keywords: string,
): Promise<{ status: string; places: Place[] }> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(
      () => resolve({ status: "timeout", places: [] }),
      10000,
    );
    new api.PlaceSearch({
      city: "南京",
      citylimit: true,
      pageSize: 50,
      extensions: "base",
    }).searchNearBy(keywords, origin, 3500, (status, result) => {
      clearTimeout(timer);
      resolve({
        status,
        places:
          status === "complete"
            ? (result.poiList?.pois ?? []).filter(
                (place) =>
                  place.location &&
                  Number.isFinite(place.location.lng) &&
                  Number.isFinite(place.location.lat),
              )
            : [],
      });
    });
  });
}
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
  const center = useRef<LngLat | null>(null);
  const navigation = useRef<ReturnType<typeof scenicNavigation> | null>(null);
  const selectionFrame = useRef(0);
  const markers = useRef<Overlay[]>([]);
  const autumnLayer = useRef<Awaited<ReturnType<typeof addAutumnLayer>> | null>(
    null,
  );
  const [illustrated, setIllustrated] = useState(true);
  const positionOverlays = useRef<Overlay[]>([]);
  const walking = useRef<InstanceType<MapAPI["Walking"]> | null>(null);
  const watch = useRef<number | null>(null);
  const generation = useRef(0);
  const searchVersion = useRef(0);
  const latestFix = useRef(0);
  const placePanel = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "missing" | "ready" | "error">(
    "loading",
  );
  const [retry, setRetry] = useState(0);
  const [mcp, setMcp] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PlaceFilter>("全部");
  const [groups, setGroups] = useState<PlaceGroups>(initialPlaceGroups);
  const [extraPlaces, setExtraPlaces] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<Place[] | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogErrors, setCatalogErrors] = useState<string[]>([]);
  const catalog = useMemo(
    () => buildPlaceCatalog(groups, extraPlaces),
    [groups, extraPlaces],
  );
  const places = useMemo(
    () => filterPlaceCatalog(catalog, category, searchResults),
    [catalog, category, searchResults],
  );
  const [selected, setSelected] = useState<Place | null>(null);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchNote, setSearchNote] = useState("");
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
  const autoCount = groups.景点.length;
  const [autoNote, setAutoNote] = useState("开启定位后自动检测附近景点");
  const [nearby, setNearby] = useState<{
    place: Place;
    distance: number;
  } | null>(null);
  const routeOverlay = useRef<Overlay | null>(null);
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompact,
    getServerCompact,
  );
  const [browseOpen, setBrowseOpen] = useState<boolean | null>(null);
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
      searchVersion.current++;
      setSearching(false);
      cancelAnimationFrame(selectionFrame.current);
      routeVersion.current++;
      clearWalk();
      setRouteNote("");
      setSelected(place);
      autumnLayer.current?.setSelected(place.id);
      setPanelOpen(true);
      setBrowseOpen(true);
      if (reveal)
        selectionFrame.current = requestAnimationFrame(() =>
          navigation.current?.reveal(place.location),
        );
    },
    [clearWalk],
  );
  const search = useCallback(async (keywords: string) => {
    const api = sdk.current,
      view = map.current,
      origin = center.current;
    if (!api || !view || !origin) return;
    const version = ++searchVersion.current;
    setSearching(true);
    setSearchNote("");
    const result = await findNearby(api, origin, keywords);
    if (version !== searchVersion.current || map.current !== view) return;
    const found = scenicSearchResults(result.places);
    setSearching(false);
    setSearchResults(found);
    setExtraPlaces((previous) => [
      ...new Map(
        [...previous, ...found].map((place) => [place.id, place]),
      ).values(),
    ]);
    setSearchNote(
      found.length
        ? "找到" + found.length + "处地点"
        : result.status === "no_data" || result.status === "complete"
          ? "附近没有匹配地点，试试其他关键词。"
          : "查询暂不可用，请稍后重试。",
    );
  }, []);
  const resetFilter = useCallback(() => {
    searchVersion.current++;
    setCategory("全部");
    setQuery("");
    setSearchResults(null);
    setSearchNote("");
    setSearching(false);
  }, []);
  const closePlacePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);
  useEffect(() => {
    targets.current = [...groups.景点];
  }, [groups]);
  const invalidatePending = useCallback(() => {
    searchVersion.current++;
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
        center.current = origin;
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
        setState("ready");
        setLoadingCatalog(true);
        setCatalogErrors([]);
        setGroups(initialPlaceGroups());
        for (const item of placeCategories) {
          if (cancelled) return;
          const result = await findNearby(api, origin, item);
          if (cancelled) return;
          setGroups((previous) => ({
            ...previous,
            [item]:
              item === "景点"
                ? collectScenicPlaces(scenicSearchResults(result.places))
                : scenicSearchResults(result.places),
          }));
          if (result.status !== "complete" && result.status !== "no_data")
            setCatalogErrors((previous) => [...previous, item]);
          if (item !== "休息")
            await new Promise((resolve) => window.setTimeout(resolve, 650));
        }
        if (!cancelled) setLoadingCatalog(false);
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
  useEffect(() => {
    const api = sdk.current,
      view = map.current;
    if (state !== "ready" || !api || !view) return;
    const overlays = places
      .filter((place) => !scenicPlaces.some((scenic) => scenic.id === place.id))
      .map((place) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "scenic-place-marker";
        button.dataset.category = place.category;
        button.textContent = String(place.number);
        button.title =
          (place.referenceName ?? place.name) + " · " + place.category;
        button.setAttribute(
          "aria-label",
          "查看" + (place.referenceName ?? place.name),
        );
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          select(place);
        });
        return new api.Marker({
          map: view,
          position: [place.location.lng, place.location.lat],
          content: button,
          anchor: "bottom-center",
        });
      });
    markers.current = overlays;
    return () => {
      overlays.forEach((marker) => marker.setMap(null));
      if (markers.current === overlays) markers.current = [];
    };
  }, [state, retry, places, select]);
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
    runtime.thread().append({
      role: "user",
      content: [
        {
          type: "text",
          text:
            "请介绍栖霞山附近的「" +
            selected.name +
            "」。我手动选中的地点为高德GCJ-02坐标：" +
            selected.location.lng +
            "," +
            selected.location.lat +
            "。这不代表我的当前位置。需要查询事实时请使用高德工具，不要编造开放时间、演出或山路。",
        },
      ],
    });
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) {
      setCategory("全部");
      void search(query.trim());
    }
  }
  return (
    <section
      className={`scenic-map-stage ${illustrated ? "is-autumn" : "is-standard"}`}
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
            className={`map-place-panel map-place-dock ${panelOpen ? "" : "is-collapsed"}`}
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
              <strong>南京 · 栖霞山</strong>
              <span>{state === "ready" ? "赏秋导览" : "等待连接"}</span>
              <ChevronDown size={15} className="map-panel-chevron" />
            </button>
            <div className="map-panel-body" id="map-panel-body">
              <details
                className="map-browse"
                open={browseOpen ?? !compact}
                onToggle={(event) => setBrowseOpen(event.currentTarget.open)}
              >
                <summary>发现山中景点 · {scenicPlaces.length} 处</summary>
                <button
                  className="autumn-all-places"
                  disabled={state !== "ready"}
                  onClick={() => {
                    resetFilter();
                    setCategory("景点");
                    navigation.current?.fitOverview();
                  }}
                >
                  全部景点 · {scenicPlaces.length} 处
                </button>
                <div className="autumn-catalog-intro">
                  <span>QIXIA MOUNTAIN</span>
                  <h2>循着秋色，走进山间</h2>
                  <p>点击插画或景点名称，查看这座山的故事。</p>
                </div>
                <form className="map-search" onSubmit={submit}>
                  <Search size={16} />
                  <input
                    aria-label="搜索栖霞山附近地点"
                    placeholder="搜索景点、厕所、餐饮…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    maxLength={60}
                  />
                  <button
                    disabled={state !== "ready" || searching}
                    type="submit"
                  >
                    搜索
                  </button>
                </form>
                <div className="map-category-list">
                  {(["全部", ...placeCategories] as const).map((item) => (
                    <button
                      key={item}
                      aria-pressed={category === item}
                      data-category={item}
                      disabled={state !== "ready"}
                      onClick={() => {
                        resetFilter();
                        setCategory(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p className="map-search-note" role="status">
                  {searching
                    ? "正在查询地点…"
                    : searchResults !== null
                      ? searchNote
                      : (loadingCatalog
                          ? "正在加载附近地点 · 已显示"
                          : "已显示") +
                        places.length +
                        "处" +
                        (catalogErrors.length
                          ? " · " + catalogErrors.join("、") + "暂无法更新"
                          : " · 点击标记查看")}
                </p>
                {!!places.length && (
                  <details className="map-results" open={!selected}>
                    <summary>附近地点 · {places.length}处</summary>
                    <div>
                      {places.map((place) => (
                        <button
                          className={
                            selected?.id === place.id ? "is-selected" : ""
                          }
                          key={place.id}
                          onClick={() => select(place, true)}
                        >
                          <span data-category={place.category}>
                            {place.number}
                          </span>
                          <span>
                            <strong>{place.referenceName ?? place.name}</strong>
                            <small>
                              {(typeof place.address === "string" &&
                                place.address) ||
                                "高德地点信息"}
                            </small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </details>
                )}
                <details className="autumn-unverified">
                  <summary>还有 {unverifiedPlaces.length} 处待核实</summary>
                  <p>
                    {unverifiedPlaces.join("、")}
                    。暂未匹配到可靠的高德点位，核实后再加入地图。
                  </p>
                </details>
                {selected && (
                  <div className="map-place-detail">
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
                    {selected.referenceCode && (
                      <p>
                        参考图 {selected.referenceCode} ·{" "}
                        {selected.referenceName}
                      </p>
                    )}
                    <p>
                      {typeof selected.address === "string"
                        ? selected.address
                        : ""}
                    </p>
                    <div className="map-detail-actions">
                      <button onClick={ask}>询问助手</button>
                      <button
                        onClick={planWalk}
                        disabled={quality !== "usable"}
                      >
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
              </details>
            </div>
          </div>,
          placeDockNode,
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
