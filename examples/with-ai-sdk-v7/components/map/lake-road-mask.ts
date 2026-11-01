type Pixel = { x: number; y: number };

export const roadOutlineWidth = 7;

export function lakeRoadMask(
  width: number,
  height: number,
  center: Pixel,
  roads: Pixel[][],
  rotation: number,
  mirror: boolean,
) {
  const angle = (rotation * Math.PI) / 180;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const clearance = roadOutlineWidth + 2;
  const paths = roads
    .map((road) =>
      road.map((point) => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return {
          x: (cosine * dx + sine * dy) * (mirror ? -1 : 1) + width / 2,
          y: -sine * dx + cosine * dy + height / 2,
        };
      }),
    )
    .filter(
      (road) =>
        Math.max(...road.map((point) => point.x)) >= -clearance &&
        Math.min(...road.map((point) => point.x)) <= width + clearance &&
        Math.max(...road.map((point) => point.y)) >= -clearance &&
        Math.min(...road.map((point) => point.y)) <= height + clearance,
    )
    .map(
      (road) =>
        `<path d="${road.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(" ")}"/>`,
    )
    .join("");
  if (!paths) return "none";
  // DOM markers render above AMap's vector roads regardless of their zIndex.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><mask id="roads" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:luminance"><rect width="100%" height="100%" fill="white"/><g fill="none" stroke="black" stroke-width="${clearance}" stroke-linecap="round" stroke-linejoin="round">${paths}</g></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#roads)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
