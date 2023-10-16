import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import type { ManifestOptions, VitePWAOptions } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/rxfx/vision/",
  includeAssets: ["vision-icon-192.png"],
  registerType: "autoUpdate",
  manifest: {
    name: "Chess Vision Trainer",
    short_name: "Chess Vision Trainer",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "/rxfx/vision/",
  plugins: [react(), VitePWA(pwaOptions)],
  server: {
    port: 8470,
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./src"),
    },
  },
});
