export type LngLat = { lng: number; lat: number };
export type Place = {
  id: string;
  name: string;
  address?: string;
  location: LngLat;
};
export type Overlay = { setMap(map: MapInstance | null): void };
export type MapInstance = {
  destroy(): void;
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
  setZoomAndCenter(zoom: number, center: LngLat): void;
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
  GLCustomLayer: new (options: {
    zIndex: number;
    init(gl: WebGLRenderingContext | WebGL2RenderingContext): void;
    render(): void;
  }) => { show(): void; hide(): void };
  Polyline: new (options: Record<string, unknown>) => Overlay;
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => MapInstance;
  Marker: new (
    options: Record<string, unknown>,
  ) => Overlay & { on(name: string, callback: () => void): void };
  Circle: new (options: Record<string, unknown>) => Overlay;
  Geolocation: new (options: Record<string, unknown>) => GeoInstance;
  PlaceSearch: new (options: Record<string, unknown>) => {
    searchNearBy(
      keywords: string,
      center: LngLat,
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
      origin: LngLat,
      destination: LngLat,
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
