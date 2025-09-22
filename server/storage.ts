import { 
  type User, 
  type InsertUser, 
  type MigrantProfile,
  type InsertMigrantProfile,
  type HealthRecord,
  type InsertHealthRecord,
  type Vaccination,
  type InsertVaccination,
  type Alert,
  type InsertAlert,
  type Symptom,
  type InsertSymptom,
  type Clinic
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Migrant profile management
  getMigrantProfile(userId: string): Promise<MigrantProfile | undefined>;
  getMigrantProfileById(id: string): Promise<MigrantProfile | undefined>;
  createMigrantProfile(profile: InsertMigrantProfile & { userId: string }): Promise<MigrantProfile>;
  updateMigrantProfile(id: string, updates: Partial<MigrantProfile>): Promise<MigrantProfile | undefined>;

  // Health records
  getHealthRecords(migrantId: string): Promise<HealthRecord[]>;
  getHealthRecordsByType(migrantId: string, type: string): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;

  // Vaccinations
  getVaccinations(migrantId: string): Promise<Vaccination[]>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;
  updateVaccination(id: string, updates: Partial<Vaccination>): Promise<Vaccination | undefined>;

  // Alerts
  getAlerts(migrantId: string): Promise<Alert[]>;
  getGlobalAlerts(region?: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<void>;

  // Symptoms
  createSymptomCheck(symptom: InsertSymptom): Promise<Symptom>;
  getLatestSymptomCheck(migrantId: string): Promise<Symptom | undefined>;

  // Clinics
  getClinics(location?: string): Promise<Clinic[]>;
  getNearbyClinicsBylocation(latitude: string, longitude: string): Promise<Clinic[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private migrantProfiles: Map<string, MigrantProfile>;
  private healthRecords: Map<string, HealthRecord>;
  private vaccinations: Map<string, Vaccination>;
  private alerts: Map<string, Alert>;
  private symptoms: Map<string, Symptom>;
  private clinics: Map<string, Clinic>;

  constructor() {
    this.users = new Map();
    this.migrantProfiles = new Map();
    this.healthRecords = new Map();
    this.vaccinations = new Map();
    this.alerts = new Map();
    this.symptoms = new Map();
    this.clinics = new Map();
    
    // Initialize with some sample clinics
    this.initializeClinics();
  }

  private initializeClinics() {
    const sampleClinics: Clinic[] = [
      {
        id: randomUUID(),
        name: "Primary Health Center",
        address: "Kochi, Ernakulam",
        latitude: "9.9312",
        longitude: "76.2673",
        phone: "0484-2345678",
        hours: "8 AM - 8 PM",
        services: ["General Medicine", "Vaccination", "Emergency"],
        distance: "0.8 km"
      },
      {
        id: randomUUID(),
        name: "Community Health Center",
        address: "Fort Kochi, Ernakulam",
        latitude: "9.9658",
        longitude: "76.2430",
        phone: "0484-2234567",
        hours: "24/7",
        services: ["Emergency", "Surgery", "ICU"],
        distance: "1.2 km"
      },
      {
        id: randomUUID(),
        name: "District Hospital",
        address: "Ernakulam Medical College",
        latitude: "9.9816",
        longitude: "76.2999",
        phone: "0484-2345123",
        hours: "24/7",
        services: ["All Specialties", "Emergency", "Surgery"],
        distance: "2.1 km"
      }
    ];

    sampleClinics.forEach(clinic => {
      this.clinics.set(clinic.id, clinic);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isVerified: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getMigrantProfile(userId: string): Promise<MigrantProfile | undefined> {
    return Array.from(this.migrantProfiles.values()).find(profile => profile.userId === userId);
  }

  async getMigrantProfileById(id: string): Promise<MigrantProfile | undefined> {
    return this.migrantProfiles.get(id);
  }

  async createMigrantProfile(profileData: InsertMigrantProfile & { userId: string }): Promise<MigrantProfile> {
    const id = randomUUID();
    const healthId = `MIG${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const profile: MigrantProfile = { 
      ...profileData, 
      id, 
      healthId,
      createdAt: new Date()
    };
    this.migrantProfiles.set(id, profile);
    return profile;
  }

  async updateMigrantProfile(id: string, updates: Partial<MigrantProfile>): Promise<MigrantProfile | undefined> {
    const profile = this.migrantProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...updates };
    this.migrantProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async getHealthRecords(migrantId: string): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values())
      .filter(record => record.migrantId === migrantId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getHealthRecordsByType(migrantId: string, type: string): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values())
      .filter(record => record.migrantId === migrantId && record.recordType === type)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createHealthRecord(recordData: InsertHealthRecord): Promise<HealthRecord> {
    const id = randomUUID();
    const record: HealthRecord = { 
      ...recordData, 
      id,
      createdAt: new Date()
    };
    this.healthRecords.set(id, record);
    return record;
  }

  async getVaccinations(migrantId: string): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values())
      .filter(vaccination => vaccination.migrantId === migrantId)
      .sort((a, b) => {
        const dateA = vaccination.scheduledDate || vaccination.completedDate || new Date(0);
        const dateB = vaccination.scheduledDate || vaccination.completedDate || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  }

  async createVaccination(vaccinationData: InsertVaccination): Promise<Vaccination> {
    const id = randomUUID();
    const vaccination: Vaccination = { 
      ...vaccinationData, 
      id,
      createdAt: new Date()
    };
    this.vaccinations.set(id, vaccination);
    return vaccination;
  }

  async updateVaccination(id: string, updates: Partial<Vaccination>): Promise<Vaccination | undefined> {
    const vaccination = this.vaccinations.get(id);
    if (!vaccination) return undefined;
    
    const updatedVaccination = { ...vaccination, ...updates };
    this.vaccinations.set(id, updatedVaccination);
    return updatedVaccination;
  }

  async getAlerts(migrantId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.migrantId === migrantId || alert.isGlobal)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getGlobalAlerts(region?: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.isGlobal && (!region || alert.region === region))
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...alertData, 
      id,
      createdAt: new Date()
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.isRead = true;
      this.alerts.set(id, alert);
    }
  }

  async createSymptomCheck(symptomData: InsertSymptom): Promise<Symptom> {
    const id = randomUUID();
    const symptom: Symptom = { 
      ...symptomData, 
      id,
      submittedAt: new Date()
    };
    this.symptoms.set(id, symptom);
    return symptom;
  }

  async getLatestSymptomCheck(migrantId: string): Promise<Symptom | undefined> {
    const migrantSymptoms = Array.from(this.symptoms.values())
      .filter(symptom => symptom.migrantId === migrantId)
      .sort((a, b) => b.submittedAt!.getTime() - a.submittedAt!.getTime());
    
    return migrantSymptoms[0];
  }

  async getClinics(location?: string): Promise<Clinic[]> {
    const allClinics = Array.from(this.clinics.values());
    if (!location) return allClinics;
    
    return allClinics.filter(clinic => 
      clinic.address.toLowerCase().includes(location.toLowerCase())
    );
  }

  async getNearbyClinicsBylocation(latitude: string, longitude: string): Promise<Clinic[]> {
    // For demo purposes, return all clinics
    // In production, this would calculate actual distances
    return Array.from(this.clinics.values());
  }
}

export const storage = new MemStorage();
