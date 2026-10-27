type Vector = { set(...values: number[]): void };
type Projected = {
  x: number;
  y: number;
  z: number;
  project(camera: Camera): Projected;
};
export type Camera = {
  near: number;
  far: number;
  fov: number;
  aspect: number;
  position: Vector;
  up: Vector;
  lookAt(...values: number[]): void;
  updateProjectionMatrix(): void;
  updateMatrixWorld(): void;
};
export type Geometry = {
  setAttribute(name: string, value: unknown): void;
  setIndex(indices: number[]): void;
  computeVertexNormals(): void;
  dispose(): void;
};
export type Material = { dispose(): void };
export type SceneObject = { geometry: Geometry; material: Material };
export type Scene = {
  add(...objects: unknown[]): void;
  remove(object: unknown): void;
};
export type ThreeRuntime = {
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) => Camera;
  WebGLRenderer: new (options: {
    context: WebGLRenderingContext | WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
  }) => {
    autoClear: boolean;
    resetState(): void;
    render(scene: Scene, camera: Camera): void;
    dispose(): void;
  };
  Scene: new () => Scene;
  BufferGeometry: new () => Geometry;
  Float32BufferAttribute: new (array: number[], size: number) => unknown;
  MeshPhongMaterial: new (options: Record<string, unknown>) => Material;
  LineBasicMaterial: new (options: Record<string, unknown>) => Material;
  Mesh: new (geometry: Geometry, material: Material) => SceneObject;
  Line: new (geometry: Geometry, material: Material) => SceneObject;
  AmbientLight: new (color: number, intensity: number) => unknown;
  DirectionalLight: new (
    color: number,
    intensity: number,
  ) => { position: Vector };
  Vector3: new (x: number, y: number, z: number) => Projected;
  DoubleSide: number;
};
declare global {
  interface Window {
    THREE?: ThreeRuntime;
  }
}
let pending: Promise<ThreeRuntime> | undefined;
export function loadThree(): Promise<ThreeRuntime> {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => finish(), 15000);
    const finish = (ok = false) => {
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      if (ok && window.THREE) resolve(window.THREE);
      else {
        script.remove();
        pending = undefined;
        reject(new Error("三维引擎加载失败"));
      }
    };
    script.src = "/vendor/three-r142.min.js";
    script.onload = () => finish(true);
    script.onerror = () => finish();
    document.head.append(script);
  });
  return pending;
}
