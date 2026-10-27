import {
  surfaceHeight,
  terrainToGcj,
  terrainToWgs,
  type TerrainData,
  type Coordinate,
} from "@/lib/terrain";
import type { MapAPI, MapInstance, Place, LngLat } from "./amap-types";
import type { ThreeRuntime, Camera, Scene, SceneObject } from "./three-runtime";

export function createTerrainLayer(
  api: MapAPI,
  map: MapInstance,
  host: HTMLElement,
  three: ThreeRuntime,
  data: TerrainData,
  onSelect: (place: Place) => void,
) {
  const [w, s, e, n] = data.bounds;
  const origin = terrainToGcj((w + e) / 2, (s + n) / 2);
  const coords = map.customCoords;
  const points: Coordinate[] = [];
  for (let y = 0; y < data.size; y++)
    for (let x = 0; x < data.size; x++)
      points.push(
        terrainToGcj(
          w + ((e - w) * x) / (data.size - 1),
          n - ((n - s) * y) / (data.size - 1),
        ),
      );
  coords.setCenter(origin);
  const xy = coords.lngLatsToCoords(points);
  let camera: Camera,
    scene: Scene,
    renderer: InstanceType<ThreeRuntime["WebGLRenderer"]>;
  let mesh: SceneObject, route: SceneObject | undefined;
  let active = true,
    dead = false,
    exaggeration = 1.3;
  let routePath: LngLat[] = [];
  let resolveReady: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });
  let labels: { place: Place; element: HTMLButtonElement }[] = [];
  const labelsHost = document.createElement("div");
  labelsHost.className = "terrain-labels";
  host.append(labelsHost);
  const indices: number[] = [];
  for (let y = 0; y < data.size - 1; y++)
    for (let x = 0; x < data.size - 1; x++) {
      const a = y * data.size + x,
        b = a + 1,
        c = a + data.size,
        d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  function buildMesh() {
    if (!scene) return;
    const vertices: number[] = [],
      colors: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const x = i % data.size,
        y = Math.floor(i / data.size);
      const lon = w + ((e - w) * x) / (data.size - 1),
        lat = n - ((n - s) * y) / (data.size - 1);
      vertices.push(
        xy[i]![0]!,
        xy[i]![1]!,
        surfaceHeight(data, lon, lat, exaggeration),
      );
      const h = Math.min(1, Math.max(0, data.heights[i]! / 350));
      const edge =
        Math.min(x, y, data.size - 1 - x, data.size - 1 - y) / (data.size - 1);
      const opacity =
        Math.min(1, Math.max(0, (data.heights[i]! - 16) / 24)) *
        Math.min(1, edge / 0.08);
      colors.push(0.43 + h * 0.12, 0.52 + h * 0.12, 0.34 + h * 0.14, opacity);
    }
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    const geometry = new three.BufferGeometry();
    geometry.setAttribute(
      "position",
      new three.Float32BufferAttribute(vertices, 3),
    );
    geometry.setAttribute("color", new three.Float32BufferAttribute(colors, 4));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    mesh = new three.Mesh(
      geometry,
      new three.MeshPhongMaterial({
        vertexColors: true,
        transparent: true,
        alphaTest: 0.02,
        side: three.DoubleSide,
        shininess: 8,
      }),
    );
    scene.add(mesh);
  }
  function height(point: LngLat) {
    const [lon, lat] = terrainToWgs(point.lng, point.lat);
    return surfaceHeight(data, lon, lat, exaggeration);
  }
  function buildRoute() {
    if (!scene) return;
    if (route) {
      scene.remove(route);
      route.geometry.dispose();
      route.material.dispose();
      route = undefined;
    }
    if (routePath.length < 2) return;
    const dense: LngLat[] = [];
    for (let i = 1; i < routePath.length; i++) {
      const a = routePath[i - 1]!,
        b = routePath[i]!;
      const count = Math.max(
        1,
        Math.ceil(
          Math.hypot((b.lng - a.lng) * 94000, (b.lat - a.lat) * 111000) / 15,
        ),
      );
      for (let j = 0; j < count; j++)
        dense.push({
          lng: a.lng + ((b.lng - a.lng) * j) / count,
          lat: a.lat + ((b.lat - a.lat) * j) / count,
        });
    }
    dense.push(routePath[routePath.length - 1]!);
    const projected = coords.lngLatsToCoords(dense.map((p) => [p.lng, p.lat]));
    const vertices = projected.flatMap((p, i) => [
      p[0]!,
      p[1]!,
      height(dense[i]!) + 5,
    ]);
    const geometry = new three.BufferGeometry();
    geometry.setAttribute(
      "position",
      new three.Float32BufferAttribute(vertices, 3),
    );
    route = new three.Line(
      geometry,
      new three.LineBasicMaterial({ color: 0x277db1, depthTest: true }),
    );
    scene.add(route);
  }
  const layer = new api.GLCustomLayer({
    zIndex: 12,
    init(gl) {
      if (dead) return;
      camera = new three.PerspectiveCamera(60, 1, 1, 1 << 30);
      renderer = new three.WebGLRenderer({
        context: gl,
        canvas: gl.canvas as HTMLCanvasElement,
      });
      renderer.autoClear = false;
      scene = new three.Scene();
      const light = new three.DirectionalLight(0xfff4dd, 0.85);
      light.position.set(-1200, -800, 2200);
      scene.add(new three.AmbientLight(0xffffff, 0.65), light);
      buildMesh();
      buildRoute();
      resolveReady();
    },
    render() {
      if (!active || dead || !renderer) return;
      renderer.resetState();
      try {
        coords.setCenter(origin);
        const params = coords.getCameraParams();
        camera.near = params.near;
        camera.far = params.far;
        camera.fov = params.fov;
        camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
        camera.position.set(...params.position);
        camera.up.set(...params.up);
        camera.lookAt(...params.lookAt);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        renderer.render(scene, camera);
        const occupied: { x: number; y: number; width: number }[] = [];
        for (const label of labels) {
          const p = label.place.location;
          const projected = coords.lngLatsToCoords([[p.lng, p.lat]])[0]!;
          const vector = new three.Vector3(
            projected[0]!,
            projected[1]!,
            height(p) + 12,
          ).project(camera);
          const visible =
            vector.z >= -1 &&
            vector.z <= 1 &&
            Math.abs(vector.x) < 1.1 &&
            Math.abs(vector.y) < 1.1;
          const x = ((vector.x + 1) / 2) * host.clientWidth,
            y = ((1 - vector.y) / 2) * host.clientHeight;
          const width = Math.min(
            140,
            18 + (label.element.textContent?.length ?? 0) * 11,
          );
          const overlap = occupied.some(
            (p) =>
              Math.abs(p.x - x) < (p.width + width) / 2 + 6 &&
              Math.abs(p.y - y) < 34,
          );
          label.element.hidden = !visible || overlap;
          if (visible && !overlap) occupied.push({ x, y, width });
          label.element.style.left = x + "px";
          label.element.style.top = y + "px";
        }
      } finally {
        renderer.resetState();
      }
    },
  });
  try {
    map.add(layer);
  } catch (error) {
    labelsHost.remove();
    throw error;
  }
  return {
    ready,
    setActive(value: boolean) {
      active = value;
      labelsHost.hidden = !value;
      if (value) layer.show();
      else layer.hide();
      map.render();
    },
    setExaggeration(value: number) {
      exaggeration = value;
      coords.setCenter(origin);
      buildMesh();
      buildRoute();
      map.render();
    },
    setPlaces(places: Place[], selectedId?: string) {
      labelsHost.replaceChildren();
      labels = [...places]
        .sort(
          (a, b) => Number(b.id === selectedId) - Number(a.id === selectedId),
        )
        .map((place) => {
          const element = document.createElement("button");
          element.type = "button";
          element.className = "terrain-place-label";
          element.setAttribute("aria-label", "查看" + place.name);
          element.setAttribute("aria-pressed", String(place.id === selectedId));
          element.textContent =
            place.name.replace(
              /^栖霞山(?:名胜风景区|风景名胜区|风景区)?[-—]?/,
              "",
            ) || place.name;
          element.addEventListener("click", () => onSelect(place));
          labelsHost.append(element);
          return { place, element };
        });
      map.render();
    },
    setRoute(path: LngLat[]) {
      routePath = path;
      coords.setCenter(origin);
      buildRoute();
      map.render();
    },
    height,
    dispose() {
      if (dead) return;
      dead = true;
      active = false;
      map.remove(layer);
      labelsHost.remove();
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      if (route) {
        route.geometry.dispose();
        route.material.dispose();
      }
      renderer?.dispose();
    },
  };
}
export type TerrainLayer = ReturnType<typeof createTerrainLayer>;
