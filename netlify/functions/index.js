// server/index.ts
import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import express2 from "express";

// server/routes-supabase.ts
import { createServer } from "http";

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL || "https://dubqlbhbthqwaqojcbwe.supabase.co";
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MTUzMywiZXhwIjoyMDc0MTM3NTMzfQ.gqD-4ZURaF6lqQWroD1gtyzbbI_D7lVdzLpj41AB3OE";
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjE1MzMsImV4cCI6MjA3NDEzNzUzM30.DluC7TMLtOEj7L-oJSa0PzaT-t0uCn1GMxoSOzHgZhM";
if (!supabaseServiceRoleKey && !supabaseAnonKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required for server-side operations");
}
var keyToUse = supabaseServiceRoleKey || supabaseAnonKey || "";
var supabaseServer = createClient(supabaseUrl, keyToUse, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// server/routes-supabase.ts
async function registerSupabaseRoutes(app2) {
  const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }
    try {
      const { data: { user }, error } = await supabaseServer.auth.getUser(token);
      if (error || !user) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = { userId: user.id, role: user.user_metadata?.role || "migrant" };
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
  app2.post("/api/migrant/profile", authenticateToken, async (req, res) => {
    try {
      const profileData = req.body;
      const { data, error } = await supabaseServer.from("migrant_profiles").insert({
        ...profileData,
        user_id: req.user.userId
      }).select().single();
      if (error) {
        return res.status(400).json({ message: "Invalid profile data", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });
  app2.get("/api/migrant/profile", authenticateToken, async (req, res) => {
    try {
      const { data, error } = await supabaseServer.from("migrant_profiles").select("*").eq("user_id", req.user.userId).single();
      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile", error });
    }
  });
  app2.put("/api/migrant/profile", authenticateToken, async (req, res) => {
    try {
      const { data, error } = await supabaseServer.from("migrant_profiles").update(req.body).eq("user_id", req.user.userId).select().single();
      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(400).json({ message: "Failed to update profile", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile", error });
    }
  });
  app2.get("/api/health/records", authenticateToken, async (req, res) => {
    try {
      const { data, error } = await supabaseServer.from("health_records").select("*").eq("migrant_id", req.user.userId);
      if (error) {
        return res.status(500).json({ message: "Failed to fetch records", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records", error });
    }
  });
  app2.post("/api/health/records", authenticateToken, async (req, res) => {
    try {
      const recordData = req.body;
      const { data, error } = await supabaseServer.from("health_records").insert({
        ...recordData,
        migrant_id: req.user.userId
      }).select().single();
      if (error) {
        return res.status(400).json({ message: "Invalid record data", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid record data", error });
    }
  });
  app2.get("/api/vaccinations", authenticateToken, async (req, res) => {
    try {
      const { data, error } = await supabaseServer.from("vaccinations").select("*").eq("migrant_id", req.user.userId);
      if (error) {
        return res.status(500).json({ message: "Failed to fetch vaccinations", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccinations", error });
    }
  });
  app2.post("/api/vaccinations", authenticateToken, async (req, res) => {
    try {
      const vaccinationData = req.body;
      const { data, error } = await supabaseServer.from("vaccinations").insert({
        ...vaccinationData,
        migrant_id: req.user.userId
      }).select().single();
      if (error) {
        return res.status(400).json({ message: "Invalid vaccination data", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid vaccination data", error });
    }
  });
  app2.get("/api/alerts", authenticateToken, async (req, res) => {
    try {
      const { data, error } = await supabaseServer.from("alerts").select("*").or(`migrant_id.is.null,migrant_id.eq.${req.user.userId}`);
      if (error) {
        return res.status(500).json({ message: "Failed to fetch alerts", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts", error });
    }
  });
  app2.post("/api/symptoms/check", authenticateToken, async (req, res) => {
    try {
      const symptomData = req.body;
      let riskLevel = "low";
      let recommendation = "No immediate medical attention required. Continue regular health monitoring.";
      const symptomCount = [symptomData.fever, symptomData.cough, symptomData.fatigue].filter(Boolean).length;
      if (symptomCount >= 2) {
        riskLevel = "high";
        recommendation = "Please visit the nearest health center for evaluation.";
      } else if (symptomCount === 1) {
        riskLevel = "medium";
        recommendation = "Monitor symptoms and consider visiting a health center if they persist.";
      }
      const { data, error } = await supabaseServer.from("symptoms").insert({
        ...symptomData,
        migrant_id: req.user.userId,
        risk_level: riskLevel,
        recommendation
      }).select().single();
      if (error) {
        return res.status(400).json({ message: "Invalid symptom data", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid symptom data", error });
    }
  });
  app2.get("/api/clinics", async (req, res) => {
    try {
      const { location } = req.query;
      let query = supabaseServer.from("clinics").select("*");
      if (location) {
        query = query.ilike("address", `%${location}%`);
      }
      const { data, error } = await query;
      if (error) {
        return res.status(500).json({ message: "Failed to fetch clinics", error: error.message });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinics", error });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env") });
console.log("Environment variables loaded:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "Set" : "Not set");
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "Set" : "Not set");
console.log("Environment variables loaded:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "Set" : "Not set");
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "Set" : "Not set");
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerSupabaseRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "localhost",
    reusePort: false
  }, () => {
    log(`serving on port ${port}`);
  });
})();
