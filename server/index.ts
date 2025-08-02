import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContact } from "./routes/contact";
import { handleClerkWebhook } from "./routes/clerk-webhook";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.VITE_FRONTEND_URL || "*",
    credentials: true
  }));

  // Raw body parser for webhooks
  app.use("/api/webhook", express.raw({ type: "application/json" }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check for Vercel
  app.get("/api/health", (_req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/contact", handleContact);
  app.post("/api/webhook/clerk", handleClerkWebhook);

  return app;
}
