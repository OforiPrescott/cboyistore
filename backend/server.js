import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import paystackRouter from "./routes/paystack.js";
import tradeinRouter from "./routes/tradein.js";
import uploadRouter from "./routes/upload.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// Uploaded product media (images + short videos) lives here and is served
// under /api/uploads so it works in dev (proxied by Vite) and in prod.
const uploadDir = path.resolve(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// Custom CSP: helmet's defaults block the storefront's external assets
// (Unsplash/GitHub-hosted images, Google Maps iframe) and the Paystack
// checkout script/iframe. Allow the specific origins we actually use.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https://images.unsplash.com"],
        "script-src": ["'self'", "https://js.paystack.co"],
        "connect-src": [
          "'self'",
          "https://api.paystack.co",
          "https://checkout.paystack.com",
        ],
        "frame-src": [
          "'self'",
          "https://www.google.com",
          "https://checkout.paystack.com",
          "https://paystack.com",
        ],
        "media-src": ["'self'"],
      },
    },
  })
);
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
// Paystack sends raw JSON to the webhook — keep body parsing after that route
// registers its own raw parser if you add signature verification later.
app.use(express.json());

// Serve uploaded product media (populated by POST /api/upload).
app.use("/api/uploads", express.static(uploadDir, { maxAge: "7d" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    shop: "Cboyistore",
    location: "Tafo American Building, Mampong Rd, Kumasi",
    delivery: "nationwide",
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/paystack", paystackRouter);
app.use("/api/tradein", tradeinRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/admin", adminRouter);

// Serve the built storefront + staff admin (only when the frontend has been
// built into ../frontend/dist). The admin is a separate app, kept off the
// public storefront and reachable only at ADMIN_ROUTE behind ADMIN_KEY, so
// customers never see a login screen on the shop.
const distDir = path.resolve(__dirname, "..", "frontend", "dist");
if (existsSync(distDir)) {
  const adminRoute = process.env.ADMIN_ROUTE || "/admin";
  app.use(express.static(distDir));
  app.get([adminRoute, "/admin.html"], (req, res) => {
    res.sendFile(path.join(distDir, "admin.html"));
  });
  // SPA fallback for the public storefront.
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Cboyistore API running on http://localhost:${PORT}`);
});
