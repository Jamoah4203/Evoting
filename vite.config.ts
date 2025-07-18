// vite.config.ts
import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { createServer } from "./server"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    chunkSizeWarningLimit: 1000, // 👈 Explained below
    rollupOptions: {
      output: {
        manualChunks: {
          // Split out heavy vendor packages
          react: ['react', 'react-dom'],
          utility: ['zustand', 'axios'], // Add common utils you use
        },
      },
    },
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}))

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer()
      server.middlewares.use(app)
    },
  }
}
