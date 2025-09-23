import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { supabaseServer } from "./supabase";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export async function registerSupabaseRoutes(app: Express): Promise<Server> {
  // Middleware to verify Supabase JWT token
  const authenticateToken = async (req: AuthenticatedRequest, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const { data: { user }, error } = await supabaseServer.auth.getUser(token);

      if (error || !user) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = { userId: user.id, role: user.user_metadata?.role || 'migrant' };
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };

  // Migrant profile routes
  app.post("/api/migrant/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const profileData = req.body;
      const { data, error } = await supabaseServer
        .from('migrant_profiles')
        .insert({
          ...profileData,
          user_id: req.user!.userId
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: "Invalid profile data", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  app.get("/api/migrant/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('migrant_profiles')
        .select('*')
        .eq('user_id', req.user!.userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile", error });
    }
  });

  app.put("/api/migrant/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('migrant_profiles')
        .update(req.body)
        .eq('user_id', req.user!.userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(400).json({ message: "Failed to update profile", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile", error });
    }
  });

  // Health records routes
  app.get("/api/health/records", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('health_records')
        .select('*')
        .eq('migrant_id', req.user!.userId);

      if (error) {
        return res.status(500).json({ message: "Failed to fetch records", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records", error });
    }
  });

  app.post("/api/health/records", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const recordData = req.body;
      const { data, error } = await supabaseServer
        .from('health_records')
        .insert({
          ...recordData,
          migrant_id: req.user!.userId
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: "Invalid record data", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid record data", error });
    }
  });

  // Vaccination routes
  app.get("/api/vaccinations", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('vaccinations')
        .select('*')
        .eq('migrant_id', req.user!.userId);

      if (error) {
        return res.status(500).json({ message: "Failed to fetch vaccinations", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccinations", error });
    }
  });

  app.post("/api/vaccinations", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const vaccinationData = req.body;
      const { data, error } = await supabaseServer
        .from('vaccinations')
        .insert({
          ...vaccinationData,
          migrant_id: req.user!.userId
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: "Invalid vaccination data", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid vaccination data", error });
    }
  });

  // Alerts routes
  app.get("/api/alerts", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('alerts')
        .select('*')
        .or(`migrant_id.is.null,migrant_id.eq.${req.user!.userId}`);

      if (error) {
        return res.status(500).json({ message: "Failed to fetch alerts", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts", error });
    }
  });

  // Symptom check routes
  app.post("/api/symptoms/check", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const symptomData = req.body;

      // Simple risk calculation logic
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

      const { data, error } = await supabaseServer
        .from('symptoms')
        .insert({
          ...symptomData,
          migrant_id: req.user!.userId,
          risk_level: riskLevel,
          recommendation
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: "Invalid symptom data", error: error.message });
      }

      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid symptom data", error });
    }
  });

  // Clinics routes (public)
  app.get("/api/clinics", async (req, res) => {
    try {
      const { location } = req.query;
      let query = supabaseServer.from('clinics').select('*');

      if (location) {
        query = query.ilike('address', `%${location}%`);
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

  const httpServer = createServer(app);
  return httpServer;
}