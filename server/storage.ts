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
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

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

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log('Storage constructor - SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('Storage constructor - SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and key are required');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }

    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }

    return data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return undefined;
    }

    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return undefined;
    }

    return data;
  }

  // Migrant profile management
  async getMigrantProfile(userId: string): Promise<MigrantProfile | undefined> {
    const { data, error } = await this.supabase
      .from('migrant_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching migrant profile:', error);
      return undefined;
    }

    return data;
  }

  async getMigrantProfileById(id: string): Promise<MigrantProfile | undefined> {
    const { data, error } = await this.supabase
      .from('migrant_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching migrant profile by id:', error);
      return undefined;
    }

    return data;
  }

  async createMigrantProfile(profileData: InsertMigrantProfile & { userId: string }): Promise<MigrantProfile> {
    const { data, error } = await this.supabase
      .from('migrant_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating migrant profile:', error);
      throw error;
    }

    return data;
  }

  async updateMigrantProfile(id: string, updates: Partial<MigrantProfile>): Promise<MigrantProfile | undefined> {
    const { data, error } = await this.supabase
      .from('migrant_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating migrant profile:', error);
      return undefined;
    }

    return data;
  }

  // Health records
  async getHealthRecords(migrantId: string): Promise<HealthRecord[]> {
    const { data, error } = await this.supabase
      .from('health_records')
      .select('*')
      .eq('migrant_id', migrantId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching health records:', error);
      return [];
    }

    return data || [];
  }

  async getHealthRecordsByType(migrantId: string, type: string): Promise<HealthRecord[]> {
    const { data, error } = await this.supabase
      .from('health_records')
      .select('*')
      .eq('migrant_id', migrantId)
      .eq('record_type', type)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching health records by type:', error);
      return [];
    }

    return data || [];
  }

  async createHealthRecord(recordData: InsertHealthRecord): Promise<HealthRecord> {
    const { data, error } = await this.supabase
      .from('health_records')
      .insert(recordData)
      .select()
      .single();

    if (error) {
      console.error('Error creating health record:', error);
      throw error;
    }

    return data;
  }

  // Vaccinations
  async getVaccinations(migrantId: string): Promise<Vaccination[]> {
    const { data, error } = await this.supabase
      .from('vaccinations')
      .select('*')
      .eq('migrant_id', migrantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vaccinations:', error);
      return [];
    }

    return data || [];
  }

  async createVaccination(vaccinationData: InsertVaccination): Promise<Vaccination> {
    const { data, error } = await this.supabase
      .from('vaccinations')
      .insert(vaccinationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating vaccination:', error);
      throw error;
    }

    return data;
  }

  async updateVaccination(id: string, updates: Partial<Vaccination>): Promise<Vaccination | undefined> {
    const { data, error } = await this.supabase
      .from('vaccinations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating vaccination:', error);
      return undefined;
    }

    return data;
  }

  // Alerts
  async getAlerts(migrantId: string): Promise<Alert[]> {
    const { data, error } = await this.supabase
      .from('alerts')
      .select('*')
      .or(`migrant_id.eq.${migrantId},is_global.eq.true`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return data || [];
  }

  async getGlobalAlerts(region?: string): Promise<Alert[]> {
    let query = this.supabase
      .from('alerts')
      .select('*')
      .eq('is_global', true);

    if (region) {
      query = query.eq('region', region);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching global alerts:', error);
      return [];
    }

    return data || [];
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const { data, error } = await this.supabase
      .from('alerts')
      .insert(alertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      throw error;
    }

    return data;
  }

  async markAlertAsRead(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  }

  // Symptoms
  async createSymptomCheck(symptomData: InsertSymptom): Promise<Symptom> {
    const { data, error } = await this.supabase
      .from('symptoms')
      .insert(symptomData)
      .select()
      .single();

    if (error) {
      console.error('Error creating symptom check:', error);
      throw error;
    }

    return data;
  }

  async getLatestSymptomCheck(migrantId: string): Promise<Symptom | undefined> {
    const { data, error } = await this.supabase
      .from('symptoms')
      .select('*')
      .eq('migrant_id', migrantId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest symptom check:', error);
      return undefined;
    }

    return data;
  }

  // Clinics
  async getClinics(location?: string): Promise<Clinic[]> {
    let query = this.supabase.from('clinics').select('*');

    if (location) {
      query = query.ilike('address', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching clinics:', error);
      return [];
    }

    return data || [];
  }

  async getNearbyClinicsBylocation(latitude: string, longitude: string): Promise<Clinic[]> {
    // For demo purposes, return all clinics
    // In production, this would calculate actual distances
    const { data, error } = await this.supabase
      .from('clinics')
      .select('*');

    if (error) {
      console.error('Error fetching nearby clinics:', error);
      return [];
    }

    return data || [];
  }
}

export const storage = new SupabaseStorage();
