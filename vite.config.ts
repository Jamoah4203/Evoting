// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: "client", // Vite root is client/
  base: "./",     // ✅ tells Vite to use relative paths in index.html
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "../dist/spa", // matches vercel.json
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@components": path.resolve(__dirname, "./client/components"),
      "@context": path.resolve(__dirname, "./client/context"),
      "@pages": path.resolve(__dirname, "./client/pages"),
      "@lib": path.resolve(__dirname, "./lib"),
    },
  },
});
