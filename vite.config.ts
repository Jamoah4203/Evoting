// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: "client", // app entry lives in client/
  base: "./", // use relative paths for Vercel static hosting
  publicDir: "../public", // public folder is one level up from client
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "../dist/spa", // built output goes here (served by Vercel)
    emptyOutDir: true,
    assetsDir: "assets", // keep static assets clean
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@components": path.resolve(__dirname, "./client/components"),
      "@context": path.resolve(__dirname, "./client/context"),
      "@pages": path.resolve(__dirname, "./client/pages"),
      "@lib": path.resolve(__dirname, "./client/lib"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
