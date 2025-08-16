/// <reference types="vite/client" />

// Augment Vite env types for our variables
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_MAP_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
