import type { MapAPI } from "./amap-types";
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
      plugin: "AMap.PlaceSearch,AMap.Walking",
    }).toString();
    script.src = url.toString();
    script.async = true;
    document.head.append(script);
  });
  return pending;
}
