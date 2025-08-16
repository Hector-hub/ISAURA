import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto as nodeWebcrypto } from "node:crypto";

// Ensure Web Crypto is available on globalThis.crypto for Node runtime
try {
  const g = globalThis as unknown as Record<string, unknown>;
  const cryptoObj = g.crypto as { getRandomValues?: unknown } | undefined;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== "function") {
    Object.defineProperty(g, "crypto", {
      value: nodeWebcrypto,
      configurable: true,
    });
  }
} catch {
  // ignore
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: true,
  },
});
