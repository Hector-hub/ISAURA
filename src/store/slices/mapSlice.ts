import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Evitar updates redundantes por diferencias mínimas de punto flotante
const nearlyEqual = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

interface MapState {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds: google.maps.LatLngBounds | null;
  heatmapData: Array<{
    lat: number;
    lng: number;
    intensity: number;
  }>;
  showHeatmap: boolean;
  activeLayer: "alerts" | "heatmap" | "both";
}

const initialState: MapState = {
  center: {
    lat: 18.4861, // Santo Domingo
    lng: -69.9312,
  },
  zoom: 11,
  bounds: null,
  heatmapData: [],
  showHeatmap: true,
  activeLayer: "both",
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      const { lat, lng } = action.payload;
      if (
        nearlyEqual(state.center.lat, lat) &&
        nearlyEqual(state.center.lng, lng)
      ) {
        return; // no-op si no cambia
      }
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      if (state.zoom === action.payload) {
        return; // no-op si no cambia
      }
      state.zoom = action.payload;
    },
    setBounds: (state, action: PayloadAction<google.maps.LatLngBounds>) => {
      state.bounds = action.payload;
    },
    setHeatmapData: (state, action: PayloadAction<MapState["heatmapData"]>) => {
      state.heatmapData = action.payload;
    },
    toggleHeatmap: (state) => {
      state.showHeatmap = !state.showHeatmap;
    },
    setActiveLayer: (state, action: PayloadAction<MapState["activeLayer"]>) => {
      state.activeLayer = action.payload;
    },
    focusOnLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number; zoom?: number }>
    ) => {
      state.center = { lat: action.payload.lat, lng: action.payload.lng };
      state.zoom = action.payload.zoom || 15;
    },
  },
});

export const {
  setCenter,
  setZoom,
  setBounds,
  setHeatmapData,
  toggleHeatmap,
  setActiveLayer,
  focusOnLocation,
} = mapSlice.actions;

export default mapSlice.reducer;
