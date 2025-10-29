import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// runtimeErrorOverlay is an optional Replit plugin. We dynamically import it
// so missing optional dev-only packages don't break local development.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@shared": path.resolve("./shared"),
      "@assets": path.resolve("./attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
