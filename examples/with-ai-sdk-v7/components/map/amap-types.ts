export type LngLat = { lng: number; lat: number };
export type Place = {
  providerId?: string;
  coordinateSource?: string;
  coordinateCheckedAt?: string;
  coordinateCalibratedAt?: string;
  id: string;
  name: string;
  address?: string;
  referenceName?: string;
  referenceCode?: string;
  location: LngLat;
};
export type Overlay = { setMap(map: MapInstance | null): void };
export type LineOverlay = Overlay & {
  setPath(path: [number, number][]): void;
  setOptions(options: Record<string, unknown>): void;
  getPath(): [number, number][];
};
export type MapInstance = {
  destroy(): void;
  setFeatures(features: string[]): void;
  setPitch(pitch: number): void;
  setRotation(rotation: number): void;
  getRotation(): number;
  add(layer: unknown): void;
  remove(layer: unknown): void;
  render(): void;
  customCoords: {
    setCenter(point: [number, number]): void;
    lngLatsToCoords(points: [number, number][]): number[][];
    getCameraParams(): {
      near: number;
      far: number;
      fov: number;
      position: number[];
      up: number[];
      lookAt: number[];
    };
  };
  setZoomAndCenter(
    zoom: number,
    center: LngLat | number[],
    immediately?: boolean,
  ): void;
  setLimitBounds(bounds: unknown): void;
  clearLimitBounds(): void;
  setZooms(zooms: number[]): void;
  setStatus(status: { dragEnable: boolean }): void;
  setCenter(center: number[], immediately?: boolean): void;
  lngLatToContainer(point: number[]): { x: number; y: number };
  containerToLngLat(point: number[]): LngLat;
  getContainer(): HTMLElement;
  getZoom(digits?: number): number;
  getCenter(): LngLat;
  on(name: string, callback: () => void): void;
  off(name: string, callback: () => void): void;
  setZoom(zoom: number): void;
  addControl(control: unknown): void;
  resize(): void;
};
export type GeoResult = {
  position?: LngLat;
  accuracy?: number;
  location_type?: string;
  isConverted?: boolean;
  info?: string;
};
export type GeoInstance = {
  watchPosition(): number;
  clearWatch(id: number): void;
  on(name: string, callback: (result: GeoResult) => void): void;
  off(name: string, callback: (result: GeoResult) => void): void;
};
export type MapAPI = {
  Pixel: new (x: number, y: number) => unknown;
  Bounds: new (southwest: number[], northeast: number[]) => unknown;
  ImageLayer: new (options: Record<string, unknown>) => Overlay & {
    show(): void;
    hide(): void;
  };
  GLCustomLayer: new (options: {
    zIndex: number;
    init(gl: WebGLRenderingContext | WebGL2RenderingContext): void;
    render(): void;
  }) => { show(): void; hide(): void };
  Polyline: new (options: Record<string, unknown>) => LineOverlay;
  Polygon: new (options: Record<string, unknown>) => Overlay;
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => MapInstance;
  Marker: new (options: Record<string, unknown>) => Overlay & {
    on(name: string, callback: () => void): void;
    setzIndex(zIndex: number): void;
  };
  Circle: new (options: Record<string, unknown>) => Overlay;
  Geolocation: new (options: Record<string, unknown>) => GeoInstance;
  PlaceSearch: new (options: Record<string, unknown>) => {
    searchNearBy(
      keywords: string,
      center: LngLat | number[],
      radius: number,
      callback: (
        status: string,
        result: { poiList?: { pois?: Place[] } },
      ) => void,
    ): void;
  };
  Walking: new (options: Record<string, unknown>) => {
    clear(): void;
    search(
      origin: LngLat | number[],
      destination: LngLat | number[],
      callback: (
        status: string,
        result: {
          routes?: {
            distance: number;
            time: number;
            steps?: { path: LngLat[] }[];
          }[];
        },
      ) => void,
    ): void;
  };
  convertFrom(
    coordinates: number[],
    type: string,
    callback: (status: string, result: { locations?: LngLat[] }) => void,
  ): void;
};
declare global {
  interface Window {
    AMap?: MapAPI;
    _AMapSecurityConfig?: { serviceHost: string };
  }
}
