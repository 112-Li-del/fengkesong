import type { LngLat, MapAPI } from "./amap-types";
let pending: Promise<MapAPI> | undefined;
export function loadAmap(key: string): Promise<MapAPI> {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (pending) return pending;
  window._AMapSecurityConfig = {
    serviceHost: window.location.origin + "/_AMapService",
  };
  pending = new Promise<MapAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => finish(false), 15000);
    function finish(ok: boolean) {
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      if (ok && window.AMap) resolve(window.AMap);
      else {
        script.remove();
        pending = undefined;
        reject(new Error("地图脚本加载失败，请检查网络与地图配置。"));
      }
    }
    script.onload = () => finish(true);
    script.onerror = () => finish(false);
    const url = new URL("https://webapi.amap.com/maps");
    url.search = new URLSearchParams({
      v: "2.0",
      key,
      plugin: "AMap.PlaceSearch,AMap.Walking,AMap.Geolocation",
    }).toString();
    script.src = url.toString();
    script.async = true;
    document.head.append(script);
  });
  return pending;
}

export type LocationFix = {
  point: LngLat;
  accuracy: number;
  timestamp: number;
};
export function watchAmapLocation(
  api: MapAPI,
  onPosition: (fix: LocationFix) => void,
  onError: (code: number) => void,
) {
  const geo = new api.Geolocation({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
    convert: true,
    GeoLocationFirst: true,
    needAddress: false,
    showButton: false,
    showMarker: false,
    showCircle: false,
    panToLocation: false,
    zoomToAccuracy: false,
  });
  let active = true;
  let version = 0;
  geo.watchPosition((status, result) => {
    if (!active) return;
    const current = ++version;
    if (status !== "complete" || !result.position) {
      const message = `${result.info ?? ""} ${result.message ?? ""}`;
      onError(
        /denied|permission/i.test(message)
          ? 1
          : /timeout/i.test(message)
            ? 3
            : 2,
      );
      return;
    }
    const timestamp = Date.now();
    const accuracy =
      result.location_type === "ip" ||
      !Number.isFinite(result.accuracy) ||
      result.accuracy! <= 0
        ? 10000
        : result.accuracy!;
    const accept = (point: LngLat) => {
      if (
        active &&
        current === version &&
        Number.isFinite(point.lng) &&
        Number.isFinite(point.lat)
      )
        onPosition({
          point: { lng: point.lng, lat: point.lat },
          accuracy,
          timestamp,
        });
    };
    // 高德 HTML5 回调在转换成功后仍可能保留 isConverted: false。
    const converted = /convert success/i.test(result.message ?? "");
    if (result.isConverted === false && !converted) {
      api.convertFrom(
        [result.position.lng, result.position.lat],
        "gps",
        (status, converted) => {
          if (!active || current !== version) return;
          const point = converted.locations?.[0];
          if (status === "complete" && point) accept(point);
          else onError(2);
        },
      );
    } else accept(result.position);
  });
  geo.getCurrentPosition();
  return () => {
    active = false;
    version++;
    geo.clearWatch();
  };
}
