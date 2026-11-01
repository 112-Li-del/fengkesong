"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useAui, useAuiState } from "@assistant-ui/react";
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
import {
  getTripContext,
  setTripContext,
  registerTripLocator,
} from "@/lib/trip-context";
import {
  recommendationRoute,
  presetRoute,
  selectTripGate,
  type TripGateId,
} from "@/lib/trip-route";
import { scenicRoutes } from "@/lib/scenic-display";
import {
  getMapPlaceKnowledge,
  mapSearchCatalog,
  searchMapPlaces,
  suggestMapPlaces,
  isPinyinQuery,
  normalizeLatinQuery,
  mapSearchCategories,
  type MapSearchFilter,
} from "@/lib/map-search";
import {
  AMAP_JS_KEY,
  AMAP_JS_SECURITY_CODE,
  FKS_STATIC,
} from "@/lib/zion-config";
import {
  createProximityState,
  resetProximityPending,
  updateProximity,
} from "@/lib/proximity";
import { loadAmap, watchAmapLocation } from "./load-amap";
import { flowingRoute, traceWalkingRoute } from "./flowing-route";
import { KnowledgeModal, PlaceKnowledge } from "./place-knowledge";
import { addAutumnLayer } from "./autumn-layer";
import { scenicNavigation } from "./scenic-navigation";
import { scenicCenter, scenicPlaces, facilityPlaces } from "@/lib/qixia-map";
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
  const nextPreset = useRef(0);
  const [scenicRoute, setScenicRoute] = useState("");
  const [entryGate, setEntryGate] = useState<TripGateId>();
  const [presetOrigin, setPresetOrigin] = useState<LngLat>();
  const [locatingPreset, setLocatingPreset] = useState(false);
  const agentResult = useAuiState((s) => {
    for (let i = s.thread.messages.length - 1; i >= 0; i--) {
      const message = s.thread.messages[i]!;
      for (let j = message.content.length - 1; j >= 0; j--) {
        const part = message.content[j]!;
        if (
          part.type === "tool-call" &&
          part.toolName === "recommend_qixia_trip" &&
          part.result !== undefined
        )
          return part;
      }
    }
    return null;
  });
  const [agentRoute, setAgentRoute] =
    useState<ReturnType<typeof recommendationRoute>>(null);
  const [appliedAgentResult, setAppliedAgentResult] =
    useState<typeof agentResult>(null);
  const activeScenicRoute = scenicRoutes.find(
    (route) => route.id === scenicRoute,
  );
  const activeRoute = useMemo(
    () => agentRoute ?? presetRoute(scenicRoute, presetOrigin, entryGate),
    [agentRoute, scenicRoute, presetOrigin, entryGate],
  );
  const positionOverlays = useRef<Overlay[]>([]);
  const walking = useRef<InstanceType<MapAPI["Walking"]> | null>(null);
  const watch = useRef<(() => void) | null>(null);
  const generation = useRef(0);
  const placePanel = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "missing" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    const numbers = new Map<string, number>();
    activeRoute?.stops.forEach((place, index) => {
      if (!numbers.has(place.id)) numbers.set(place.id, index + 1);
    });
    autumnLayer.current?.setRoute(numbers);
  }, [activeRoute, state]);
  useEffect(() => {
    const api = sdk.current,
      view = map.current;
    if (state !== "ready" || !api || !view || !activeRoute) {
      setScenicRouteNote("");
      return;
    }
    const layer = flowingRoute(view);
    setScenicRouteNote("正在载入从起点出发的步行道路…");
    const cancel = traceWalkingRoute(
      api,
      activeRoute.legs,
      (paths, progress) => {
        layer.setPaths(paths);
        setScenicRouteNote(
          progress.failed
            ? paths.length
              ? "前方路段暂未查到，已保留从起点连续可走的部分，请按现场路牌通行。"
              : "起点步行道路暂未查到，请重试或按现场路牌通行。"
            : progress.completed < progress.total
              ? `正在载入步行道路 ${progress.completed}/${progress.total}…`
              : "沿赭红流光路线游览，浅金亮段指示方向。",
        );
      },
    );
    return () => {
      cancel();
      layer.remove();
    };
  }, [activeRoute, state]);
  const [retry, setRetry] = useState(0);
  const [mcp, setMcp] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MapSearchFilter>("景点");
  /** 输入法组字状态：中文还没上屏时也要能出候选 */
  const [composing, setComposing] = useState(false);
  const [compositionText, setCompositionText] = useState("");
  /** Esc 收起候选，回到完整结果列表 */
  const [suggestDismissed, setSuggestDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const effectiveQuery = composing && compositionText ? compositionText : query;
  /** 只要搜索框里有一个字符（含拼音组字中），就切全局搜索并收起类别按钮 */
  const globalSearch = effectiveQuery.trim().length > 0;
  const suggestions = useMemo(
    () => suggestMapPlaces(effectiveQuery, category, 8),
    [effectiveQuery, category],
  );
  const showSuggest = suggestions.length > 0 && !suggestDismissed;
  const places = useMemo(
    () => searchMapPlaces(query, category),
    [query, category],
  );
  const mapPlaces = useMemo(() => searchMapPlaces("", category), [category]);
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
  const latestPosition = useRef<Position | null>(null);
  const locationRequest = useRef<{
    promise: Promise<Position | null>;
    resolve: (position: Position | null) => void;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const settleLocation = useCallback((fix: Position | null) => {
    const pending = locationRequest.current;
    if (!pending) return;
    clearTimeout(pending.timer);
    locationRequest.current = null;
    pending.resolve(fix);
  }, []);
  useEffect(() => {
    setTripContext({
      ...(activeScenicRoute ? { route: activeScenicRoute.id } : {}),
      ...(entryGate ? { entryGate } : {}),
      ...(tracking && position ? { position } : {}),
    });
    return () => setTripContext({});
  }, [activeScenicRoute, entryGate, tracking, position]);
  const [locationNote, setLocationNote] = useState("");
  const [locationFailure, setLocationFailure] = useState<number | null>(null);
  const [routeNote, setRouteNote] = useState("");
  const routeVersion = useRef(0);
  const proximity = useRef(createProximityState());
  const targets = useRef<Place[]>([]);
  const autoRef = useRef(true);
  const resumeAfter = useRef(0);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const autoCount = scenicPlaces.length;
  const [autoNote, setAutoNote] = useState("开启定位后自动检测附近景点");
  const [demoPlaceId, setDemoPlaceId] = useState("");
  const [nearby, setNearby] = useState<{
    place: Place;
    distance: number;
  } | null>(null);
  const routeOverlay = useRef<ReturnType<typeof flowingRoute> | null>(null);
  const [scenicRouteNote, setScenicRouteNote] = useState("");
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
    routeOverlay.current?.remove();
    routeOverlay.current = null;
  }, []);
  useEffect(() => {
    routeVersion.current++;
    clearWalk();
  }, [agentResult, clearWalk]);
  if (appliedAgentResult !== agentResult) {
    setAppliedAgentResult(agentResult);
    setRouteNote("");
    const next = recommendationRoute(agentResult?.result);
    if (next) setScenicRoute("");
    const result = agentResult?.result;
    if (
      result &&
      typeof result === "object" &&
      "entryGate" in result &&
      (result.entryGate === "QXF010" || result.entryGate === "QXF011")
    ) {
      setEntryGate(result.entryGate);
    }
    setAgentRoute(next);
  }
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
      autumnLayer.current?.setSelected(next?.id ?? null, reveal);
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
    const ids = new Set(mapPlaces.map((place) => place.id));
    // 全局搜索可能命中当前类别之外的点位，选中它的 marker 必须能显示
    if (selected) ids.add(selected.id);
    activeRoute?.stops.forEach((place) => ids.add(place.id));
    filterWanted.current = ids;
    autumnLayer.current?.setFilter(ids);
  }, [mapPlaces, selected, activeRoute]);
  const closePlacePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);
  useEffect(() => {
    targets.current = scenicPlaces;
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
        const config: {
          configured: boolean;
          key: string | null;
          mcpConfigured: boolean;
        } = FKS_STATIC
          ? {
              configured: Boolean(AMAP_JS_KEY),
              key: AMAP_JS_KEY || null,
              mcpConfigured: false,
            }
          : await (async () => {
              const response = await fetch("/api/amap/config", {
                cache: "no-store",
                signal: abort.signal,
              });
              if (!response.ok) throw new Error("Configuration unavailable");
              return (await response.json()) as {
                configured: boolean;
                key: string | null;
                mcpConfigured: boolean;
              };
            })();
        if (cancelled) return;
        setMcp(config.mcpConfigured);
        if (!config.configured || !config.key) {
          setState("missing");
          return;
        }
        const api = await loadAmap(
          config.key,
          FKS_STATIC ? AMAP_JS_SECURITY_CODE || undefined : undefined,
        );
        const origin = scenicCenter;
        if (cancelled || !container.current) return;
        sdk.current = api;
        map.current = new api.Map(container.current, {
          center: [origin.lng, origin.lat],
          zoom: 16,
          features: ["bg", "road", "building"],
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
      watch.current?.();
      watch.current = null;
      settleLocation(null);
      resize.disconnect();
      cancelAnimationFrame(selectionFrame.current);
      document.removeEventListener("visibilitychange", visibility);
      routeOverlay.current?.remove();
      autumnLayer.current?.remove();
      autumnLayer.current = null;
      navigation.current = null;
      map.current?.destroy();
      map.current = null;
    };
  }, [retry, select, invalidatePending, settleLocation]);
  function stopLocation() {
    settleLocation(null);
    latestPosition.current = null;
    setLocationFailure(null);
    generation.current++;
    watch.current?.();
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
  function drawFix(api: MapAPI, view: MapInstance, fix: Position) {
    positionOverlays.current.forEach((item) => item.setMap(null));
    positionOverlays.current = [
      new api.Circle({
        map: view,
        center: [fix.point.lng, fix.point.lat],
        radius: fix.accuracy,
        strokeColor: "#5279ac",
        fillColor: "#80a9d5",
        fillOpacity: 0.15,
        strokeWeight: 1,
      }),
      new api.Marker({
        map: view,
        position: [fix.point.lng, fix.point.lat],
        anchor: "center",
        content: '<span class="visitor-location-dot"></span>',
      }),
    ];
  }
  function applyFix(fix: Position) {
    const api = sdk.current;
    const view = map.current;
    if (!api || !view) return null;
    drawFix(api, view, fix);
    latestPosition.current = fix;
    const gate = getTripContext().entryGate ?? selectTripGate(fix.point).id;
    setEntryGate(gate);
    setTripContext({ ...getTripContext(), entryGate: gate, position: fix });
    setPosition(fix);
    setLocationFailure(null);
    return view;
  }
  function announceArrival(place: Place, distance: number) {
    setNearby({ place, distance });
    setAutoNote(`已到达${place.name}，可以听听讲解`);
    autumnLayer.current?.setSelected(place.id, true);
  }
  // 演示保底：手动选点后走与 GPS 到达同一条链路，不依赖现场定位。
  function simulateArrival(place: Place) {
    const point = { lng: place.location.lng, lat: place.location.lat };
    const view = applyFix({ point, accuracy: 5, timestamp: Date.now() });
    if (!view) return;
    const state = createProximityState();
    proximity.current = state;
    const now = Date.now();
    updateProximity(
      state,
      targets.current,
      { point, accuracy: 5, timestamp: now - 11000 },
      now - 11000,
    );
    updateProximity(
      state,
      targets.current,
      { point, accuracy: 5, timestamp: now },
      now,
    );
    autoRef.current = true;
    setAutoEnabled(true);
    announceArrival(place, 0);
    setLocationNote(`演示：已模拟到达「${place.name}」`);
    view.setZoomAndCenter(17, [point.lng, point.lat]);
  }
  function startLocation() {
    if (watch.current) return;
    if (!window.isSecureContext) {
      setLocationNote("定位需要 HTTPS，请通过安全链接访问。");
      settleLocation(null);
      return;
    }
    const api = sdk.current,
      view = map.current;
    if (!api || !view) {
      settleLocation(null);
      return;
    }
    setLocationFailure(null);
    const session = ++generation.current;
    resumeAfter.current = Date.now();
    resetProximityPending(proximity.current);
    let first = true;
    setTracking(true);
    setLocationNote("正在通过高德获取位置，请允许使用手机定位…");
    watch.current = watchAmapLocation(
      api,
      (fix) => {
        if (generation.current !== session) return;
        const { point, timestamp: captured, accuracy } = fix;
        const positionFix = {
          point: { lng: point.lng, lat: point.lat },
          accuracy: accuracy,
          timestamp: captured,
        };
        applyFix(positionFix);
        settleLocation(positionFix);
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
            announceArrival(match, result.distance);
          else
            setNearby((previous) =>
              previous &&
              proximity.current.inside.has(previous.place.id) &&
              result.reason !== "stale"
                ? previous
                : null,
            );
        }
        setLocationNote("");
        setLocationFailure(null);
        if (first) {
          view.setZoomAndCenter(16, [point.lng, point.lat]);
          first = false;
        }
      },
      (code) => {
        if (generation.current !== session) return;
        if (code === 1) {
          stopLocation();
          setLocationNote("未获得定位权限，请允许网站使用位置后重试。");
        } else {
          resetProximityPending(proximity.current);
          setNearby(null);
          setAutoNote("等待新的位置后恢复附近提示");
          setLocationNote(
            code === 3
              ? "高德定位暂未获取位置，正在重试；请确认手机已开启精确定位。"
              : "高德定位服务暂时不可用，正在重试；请检查定位权限与网络。",
          );
        }
        setLocationFailure(code);
        settleLocation(null);
      },
    );
  }

  function locateVisitor(): Promise<Position | null> {
    const recent = latestPosition.current;
    if (recent && Date.now() - recent.timestamp < 15000)
      return Promise.resolve(recent);
    if (locationRequest.current) return locationRequest.current.promise;
    let resolve!: (fix: Position | null) => void;
    const promise = new Promise<Position | null>((done) => {
      resolve = done;
    });
    const timer = setTimeout(() => {
      setLocationNote(
        "暂未获取到位置，请检查定位权限后重试，或在聊天中告诉我起点。",
      );
      settleLocation(null);
    }, 23000);
    locationRequest.current = { promise, resolve, timer };
    watch.current?.();
    watch.current = null;
    startLocation();
    return promise;
  }
  useEffect(() => registerTripLocator(locateVisitor));
  async function returnToVisitor() {
    const fix = await locateVisitor();
    if (fix) map.current?.setZoomAndCenter(17, [fix.point.lng, fix.point.lat]);
    else setDockOpen(true);
  }
  async function recommendPreset() {
    setLocatingPreset(true);
    try {
      const fix = await locateVisitor();
      const gate = selectTripGate(
        fix?.point,
        getTripContext().entryGate ?? entryGate,
      );
      const route = scenicRoutes[nextPreset.current % scenicRoutes.length]!;
      nextPreset.current++;
      routeVersion.current++;
      clearWalk();
      setRouteNote("");
      setPresetOrigin(fix?.point);
      if (fix || entryGate) setEntryGate(gate.id);
      setAgentRoute(null);
      setScenicRoute(route.id);
      setCategory("景点");
      navigation.current?.fitOverview();
    } finally {
      setLocatingPreset(false);
    }
  }

  function planWalk() {
    const api = sdk.current,
      view = map.current;
    if (!api || !view || !selected || !position) return;
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
          routeOverlay.current = flowingRoute(view);
          routeOverlay.current.setPaths([path]);
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
  function submit(event: FormEvent) {
    event.preventDefault();
    const keyword = query.trim();
    setQuery(keyword);
    if (!keyword) return;
    const exact = places.find(
      (place) => place.name === keyword || place.referenceName === keyword,
    );
    const match = exact ?? (places.length === 1 ? places[0] : undefined);
    if (match) select(match, true);
  }
  // 选中某个设施大类：移动地图到该类设施的中心。
  function focusFacilityCategory(cat: string) {
    const view = map.current;
    if (!view) return;
    const items = facilityPlaces.filter((f) => f.category === cat);
    if (!items.length) return;
    const lng =
      items.reduce((sum, f) => sum + f.location.lng, 0) / items.length;
    const lat =
      items.reduce((sum, f) => sum + f.location.lat, 0) / items.length;
    view.setZoomAndCenter(17, [lng, lat], false);
  }
  // 选中离当前位置最近的点位（景点 + 设施合并）。
  function focusNearest() {
    const view = map.current;
    if (!view || !tracking || !position) {
      setLocationNote("请先开启定位，再查找附近点位。");
      return;
    }
    const all: Place[] = [...scenicPlaces, ...facilityPlaces];
    let nearest: Place | null = null;
    let best = Infinity;
    const rad = Math.PI / 180;
    for (const place of all) {
      const term =
        Math.sin(((place.location.lat - position.point.lat) * rad) / 2) ** 2 +
        Math.cos(position.point.lat * rad) *
          Math.cos(place.location.lat * rad) *
          Math.sin(((place.location.lng - position.point.lng) * rad) / 2) ** 2;
      const d = 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(term)));
      if (d < best) {
        best = d;
        nearest = place;
      }
    }
    if (nearest) {
      setQuery("");
      setCategory("全部");
      resetSuggestion();
      select(nearest, true);
      view.setZoomAndCenter(
        17,
        [nearest.location.lng, nearest.location.lat],
        false,
      );
    }
  }
  /** 关键词或类别一变，候选回到第一条并重新展开 */
  function resetSuggestion() {
    setActiveIndex(0);
    setSuggestDismissed(false);
  }
  function chooseSuggestion(index: number) {
    const hit = suggestions[Math.min(index, suggestions.length - 1)];
    if (!hit) return;
    setQuery(hit.place.name);
    setSuggestDismissed(true);
    select(hit.place, true);
  }
  function onSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    // 组字阶段交给输入法：只拦 Enter，避免把拼音串提交成关键词
    if (composing || event.nativeEvent.isComposing) {
      if (event.key === "Enter") event.preventDefault();
      return;
    }
    if (!showSuggest) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      chooseSuggestion(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      // 先只收候选：别让 Esc 顺带把整个搜索面板关掉
      event.stopPropagation();
      setSuggestDismissed(true);
    }
  }
  return (
    <section className="scenic-map-stage is-autumn" aria-label="栖霞山地图导览">
      <div
        className="scenic-map-canvas"
        ref={container}
        aria-label="高德地图"
      />
      <div className="autumn-map-tools" aria-label="地图导览控制">
        <div className="autumn-route-actions">
          <button
            className="autumn-recommend-button"
            disabled={state !== "ready" || locatingPreset}
            onClick={() => void recommendPreset()}
            title="根据起始位置推荐游线，并返回同一入园门"
          >
            <Route size={16} />
            <span>{locatingPreset ? "正在定位…" : "推荐路线"}</span>
          </button>
          <button
            className="autumn-locate-button"
            disabled={state !== "ready"}
            onClick={() => void returnToVisitor()}
            aria-label="回到我的位置"
            title="回到我的位置"
          >
            <LocateFixed size={18} />
          </button>
        </div>
        {activeRoute && (
          <div className="autumn-route-summary" aria-live="polite">
            <strong>
              {agentRoute ? "助手推荐路线" : activeScenicRoute?.name}
            </strong>
            {!agentRoute && (
              <span>
                {activeRoute.stops[0]?.name.replace("售票处", "出发")}
                {!presetOrigin && "（无定位预览）"} →{" "}
                {activeRoute.stops.at(-1)?.name.replace("售票处", "返回")}
              </span>
            )}
            <p className="scenic-route-note">{scenicRouteNote}</p>
          </div>
        )}
      </div>
      <div className="autumn-map-caption">
        <span className="autumn-caption-dot" />
        <span>景点位置 · 高德原生路网</span>
        <small>放大查看细路 · 赭红流光：步行导航</small>
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
              <form className="map-search" onSubmit={submit} role="search">
                <Search size={16} />
                <input
                  aria-label="搜索景点与设施"
                  aria-autocomplete="list"
                  aria-expanded={showSuggest}
                  aria-controls="map-search-suggest"
                  placeholder="搜索景点、卫生间、停车场…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    resetSuggestion();
                  }}
                  onCompositionStart={() => setComposing(true)}
                  onCompositionUpdate={(event) => {
                    setCompositionText(event.data ?? "");
                    resetSuggestion();
                  }}
                  onCompositionEnd={() => {
                    setComposing(false);
                    setCompositionText("");
                  }}
                  onKeyDown={onSearchKeyDown}
                  maxLength={60}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="清空搜索"
                    onClick={() => {
                      setQuery("");
                      setCompositionText("");
                      resetSuggestion();
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
                <button type="submit">搜索</button>
              </form>
              {showSuggest && (
                <div
                  className="map-search-suggest"
                  id="map-search-suggest"
                  aria-label="搜索候选"
                >
                  <p className="map-suggest-hint">
                    <span>{composing ? "拼音组字中" : "全局搜索"}</span>
                    {isPinyinQuery(effectiveQuery) && (
                      <b>{normalizeLatinQuery(effectiveQuery)}</b>
                    )}
                    <em>{suggestions.length} 条 · ↑↓ 选择 · Enter 定位</em>
                  </p>
                  <ul>
                    {suggestions.map((hit, index) => (
                      <li key={hit.place.id}>
                        <button
                          type="button"
                          className={index === activeIndex ? "is-active" : ""}
                          aria-current={index === activeIndex}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => chooseSuggestion(index)}
                        >
                          <span data-category={hit.place.category}>
                            {hit.place.number}
                          </span>
                          <span>
                            <strong>{hit.place.name}</strong>
                            <small>
                              {hit.place.address || hit.place.category}
                            </small>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {places.length > suggestions.length && (
                    <button
                      type="button"
                      className="map-suggest-all"
                      onClick={() => setSuggestDismissed(true)}
                    >
                      展开全部 {places.length} 处结果
                    </button>
                  )}
                </div>
              )}
              {!globalSearch && (
                <div
                  className="map-category-list"
                  role="group"
                  aria-label="地点类别"
                >
                  {(["全部", ...mapSearchCategories] as const).map((item) => (
                    <button
                      key={item}
                      aria-pressed={category === item}
                      data-category={item}
                      onClick={() => {
                        setCategory(item);
                        if (item !== "景点" && item !== "全部")
                          focusFacilityCategory(item);
                        if (item === "景点") navigation.current?.fitOverview();
                        resetSuggestion();
                        setSelected(null);
                        setKnowledgeOpen(false);
                        autumnLayer.current?.setSelected(null);
                        clearWalk();
                      }}
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="map-category-nearest"
                    data-category="最近"
                    disabled={state !== "ready"}
                    onClick={focusNearest}
                  >
                    离我最近
                  </button>
                </div>
              )}
              {!showSuggest && (
                <p className="map-search-note" role="status">
                  {places.length
                    ? (globalSearch ? "全局搜索 · " : "") +
                      "找到 " +
                      places.length +
                      " 处地点" +
                      (globalSearch && places.length > 1 ? "，点击选择" : "")
                    : globalSearch
                      ? "没有匹配地点，换个关键词试试"
                      : "没有匹配地点，试试其他关键词或类别"}
                </p>
              )}
              {!showSuggest && (
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
              )}
            </div>
          </div>,
          placeDockNode,
        )}
      {selected && (
        <div key={selected.id} className="map-place-detail map-selection-card">
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
          {selected.coordinateSource && (
            <p>
              {selected.coordinateSource === "amap-verified"
                ? "高德POI已复核"
                : selected.coordinateSource === "guide-map-estimate"
                  ? "导览图估算位置，可能存在误差"
                  : "高德历史点位，尚待复核"}
            </p>
          )}
          <p>{typeof selected.address === "string" ? selected.address : ""}</p>
          <div className="map-detail-actions">
            <button onClick={ask}>询问助手</button>
            <button onClick={planWalk} disabled={!position}>
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
              (!position
                ? "开启定位后，可查询步行路线。"
                : "路线依据高德道路数据，山中小路可能未覆盖。")}
          </p>
          <PlaceKnowledge
            place={selected}
            onExpand={() => setKnowledgeOpen(true)}
          />
        </div>
      )}

      {nearby && autoEnabled && (
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
            霞宝 · 附近景点
          </div>
          <h2>{nearby.place.name}</h2>
          <p className="map-nearby-distance">
            {nearby.distance > 0
              ? `直线约 ${Math.round(nearby.distance)} 米`
              : "已到达 · 演示位置"}
          </p>
          <p>
            {typeof nearby.place.address === "string"
              ? nearby.place.address
              : "高德地点资料"}
          </p>
          <p className="map-nearby-note">
            {nearby.distance > 0
              ? "你可能在该景点附近，需要我介绍一下吗？距离不代表步行路程。"
              : "你已到达该景点，需要我介绍一下吗？"}
          </p>
          <button
            className="map-nearby-open"
            onClick={() => {
              select(nearby.place, true);
              setKnowledgeOpen(true);
              setNearby(null);
            }}
          >
            听听讲解
            <ArrowUpRight size={14} />
          </button>
          <small>来源：高德地点信息</small>
        </aside>
      )}
      {dockNode &&
        createPortal(
          <div
            className={`map-location-panel map-location-dock ${dockOpen ? "is-open" : ""}`}
            aria-label="栖霞山定位"
          >
            <div className="map-location-actions">
              <button
                onClick={() => (tracking ? stopLocation() : startLocation())}
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
                      ? "已定位，可查看附近景点和步行路线。"
                      : "点击开始后持续定位，靠近景点自动提示，可随时停止。")}
                </p>
                {position && (
                  <small className="map-location-source">
                    高德定位 · 定位时间{" "}
                    {new Date(position.timestamp).toLocaleTimeString("zh-CN", {
                      hour12: false,
                    })}
                  </small>
                )}
                {locationFailure !== null && (
                  <details className="map-location-help" open>
                    <summary>定位失败排查</summary>
                    <ol>
                      <li>
                        手机请开启系统定位，并允许当前浏览器或微信使用精确位置。
                      </li>
                      <li>允许本站访问位置，通过 HTTPS 地址打开后重试。</li>
                      <li>
                        电脑请检查系统定位服务与浏览器权限；内置预览可能无法获取位置。
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
                <details className="map-demo">
                  <summary>演示：模拟到达景点</summary>
                  <div className="map-demo-body">
                    <select
                      value={demoPlaceId}
                      onChange={(event) => setDemoPlaceId(event.target.value)}
                      aria-label="选择要模拟到达的景点"
                    >
                      <option value="">选择景点…</option>
                      {scenicPlaces.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={!demoPlaceId}
                      onClick={() => {
                        const place = scenicPlaces.find(
                          (item) => item.id === demoPlaceId,
                        );
                        if (place) simulateArrival(place);
                      }}
                    >
                      模拟到达
                    </button>
                  </div>
                  <small>
                    与真实定位走同一条到达提示链路，仅移动演示蓝点，不改点位坐标。
                  </small>
                </details>
                {autoEnabled && (
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
      {selected &&
        knowledgeOpen &&
        (() => {
          const knowledge = getMapPlaceKnowledge(selected);
          if (!knowledge) return null;
          return (
            <KnowledgeModal
              knowledge={knowledge}
              place={selected}
              onClose={() => setKnowledgeOpen(false)}
            />
          );
        })()}
    </section>
  );
}
