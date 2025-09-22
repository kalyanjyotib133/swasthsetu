import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMigrantProfileSchema,
  insertHealthRecordSchema,
  insertVaccinationSchema,
  insertAlertSchema,
  insertSymptomSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerRoutes(app: Express): Promise<Server> {
  const JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key";

  // Middleware to verify JWT token
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };

  // Initialize sample data
  const initializeSampleData = async () => {
    try {
      // Create sample global alerts
      await storage.createAlert({
        title: "Dengue Outbreak Alert",
        message: "High dengue cases reported near Perumbavoor. Take preventive measures.",
        type: "urgent",
        isGlobal: true,
        region: "Ernakulam",
        isRead: false
      });

      await storage.createAlert({
        title: "Health Screening Reminder",
        message: "Annual health screening programs are available at nearby centers.",
        type: "info",
        isGlobal: true,
        region: "Kerala",
        isRead: false
      });

      // Create sample vaccinations for demo users
      const sampleVaccinations = [
        {
          migrantId: "demo-migrant-1",
          vaccineName: "Tetanus",
          status: "completed" as const,
          completedDate: new Date("2024-01-12"),
          facilityName: "Primary Health Center"
        },
        {
          migrantId: "demo-migrant-1", 
          vaccineName: "Hepatitis B",
          status: "completed" as const,
          completedDate: new Date("2024-03-15"),
          facilityName: "Community Health Center"
        },
        {
          migrantId: "demo-migrant-1",
          vaccineName: "COVID-19 Booster",
          status: "completed" as const,
          completedDate: new Date("2024-06-20"),
          facilityName: "District Hospital"
        },
        {
          migrantId: "demo-migrant-1",
          vaccineName: "Flu Shot",
          status: "scheduled" as const,
          scheduledDate: new Date("2024-09-28"),
          facilityName: "Primary Health Center"
        }
      ];

      for (const vaccination of sampleVaccinations) {
        await storage.createVaccination(vaccination);
      }

      // Create sample health records
      const sampleRecords = [
        {
          migrantId: "demo-migrant-1",
          recordType: "visit",
          title: "General Checkup",
          description: "Routine health examination",
          doctorName: "Dr. Priya Nair",
          facilityName: "Primary Health Center",
          date: new Date("2024-09-15")
        },
        {
          migrantId: "demo-migrant-1",
          recordType: "lab",
          title: "Blood Test Report",
          description: "Complete blood count and basic metabolic panel",
          facilityName: "District Laboratory",
          date: new Date("2024-09-10")
        },
        {
          migrantId: "demo-migrant-1",
          recordType: "immunization",
          title: "COVID-19 Booster",
          description: "COVID-19 booster vaccination administered",
          facilityName: "District Hospital",
          date: new Date("2024-06-20")
        }
      ];

      for (const record of sampleRecords) {
        await storage.createHealthRecord(record);
      }

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.log("Sample data already exists or initialization failed:", error);
    }
  };

  // Initialize sample data on startup
  await initializeSampleData();

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  // Migrant profile routes
  app.post("/api/migrant/profile", authenticateToken, async (req, res) => {
    try {
      const profileData = insertMigrantProfileSchema.parse(req.body);
      const profile = await storage.createMigrantProfile({
        ...profileData,
        userId: req.user.userId
      });
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  app.get("/api/migrant/profile", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile", error });
    }
  });

  app.put("/api/migrant/profile", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const updatedProfile = await storage.updateMigrantProfile(profile.id, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile", error });
    }
  });

  // Health records routes
  app.get("/api/health/records", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const records = await storage.getHealthRecords(profile.id);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records", error });
    }
  });

  app.get("/api/health/records/:type", authenticateToken, async (req, res) => {
    try {
      const { type } = req.params;
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const records = await storage.getHealthRecordsByType(profile.id, type);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records", error });
    }
  });

  app.post("/api/health/records", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const recordData = insertHealthRecordSchema.parse({
        ...req.body,
        migrantId: profile.id
      });
      
      const record = await storage.createHealthRecord(recordData);
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid record data", error });
    }
  });

  // Vaccination routes
  app.get("/api/vaccinations", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const vaccinations = await storage.getVaccinations(profile.id);
      res.json(vaccinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccinations", error });
    }
  });

  app.post("/api/vaccinations", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const vaccinationData = insertVaccinationSchema.parse({
        ...req.body,
        migrantId: profile.id
      });
      
      const vaccination = await storage.createVaccination(vaccinationData);
      res.json(vaccination);
    } catch (error) {
      res.status(400).json({ message: "Invalid vaccination data", error });
    }
  });

  app.put("/api/vaccinations/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedVaccination = await storage.updateVaccination(id, req.body);
      
      if (!updatedVaccination) {
        return res.status(404).json({ message: "Vaccination not found" });
      }
      
      res.json(updatedVaccination);
    } catch (error) {
      res.status(400).json({ message: "Failed to update vaccination", error });
    }
  });

  // Alerts routes
  app.get("/api/alerts", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const alerts = await storage.getAlerts(profile.id);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts", error });
    }
  });

  app.post("/api/alerts", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const alertData = insertAlertSchema.parse({
        ...req.body,
        migrantId: profile.id
      });
      
      const alert = await storage.createAlert(alertData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data", error });
    }
  });

  app.put("/api/alerts/:id/read", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markAlertAsRead(id);
      res.json({ message: "Alert marked as read" });
    } catch (error) {
      res.status(400).json({ message: "Failed to mark alert as read", error });
    }
  });

  // Symptom check routes
  app.post("/api/symptoms/check", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const symptomData = insertSymptomSchema.parse({
        ...req.body,
        migrantId: profile.id
      });

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

      const symptom = await storage.createSymptomCheck({
        ...symptomData,
        riskLevel,
        recommendation
      });
      
      res.json(symptom);
    } catch (error) {
      res.status(400).json({ message: "Invalid symptom data", error });
    }
  });

  app.get("/api/symptoms/latest", authenticateToken, async (req, res) => {
    try {
      const profile = await storage.getMigrantProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const latestCheck = await storage.getLatestSymptomCheck(profile.id);
      res.json(latestCheck);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest symptom check", error });
    }
  });

  // Clinics routes
  app.get("/api/clinics", async (req, res) => {
    try {
      const { location } = req.query;
      const clinics = await storage.getClinics(location as string);
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinics", error });
    }
  });

  app.get("/api/clinics/nearby", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      const clinics = await storage.getNearbyClinicsBylocation(lat as string, lng as string);
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby clinics", error });
    }
  });

  // AI Chatbot route (using OpenAI)
  app.post("/api/chat", authenticateToken, async (req, res) => {
    try {
      const { message } = req.body;
      
      // This would integrate with OpenAI API
      // For now, return a simple response based on message content
      let reply = "I'm here to help with your health questions. You can ask me about symptoms, vaccinations, or finding nearby clinics.";
      
      if (message.toLowerCase().includes("symptom")) {
        reply = "To check your symptoms, please use the symptom checker on your dashboard. If you're experiencing severe symptoms, please contact emergency services immediately.";
      } else if (message.toLowerCase().includes("vaccination")) {
        reply = "You can view your vaccination status and schedule appointments through the vaccination tracker on your dashboard.";
      } else if (message.toLowerCase().includes("clinic") || message.toLowerCase().includes("hospital")) {
        reply = "You can find nearby clinics and hospitals using the map feature on your dashboard. All facilities are within your local area.";
      } else if (message.toLowerCase().includes("emergency")) {
        reply = "For emergencies, use the red emergency button on your dashboard or call: Ambulance (108), Police (100), Fire (101), Health Helpline (104).";
      }
      
      const response = {
        reply,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Chat service unavailable", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
