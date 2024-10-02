export interface Viewport {
  latitude: number;
  longitude: number;
  width: string;
  height: string;
  zoom: number;
}

export interface ViewportContextType {
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
}
