import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("migrant"), // migrant, health_worker, officer, admin
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const migrantProfiles = pgTable("migrant_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  mobile: text("mobile").notNull(),
  bloodGroup: text("blood_group"),
  language: text("language").default("malayalam"),
  homeState: text("home_state"),
  currentLocation: text("current_location"),
  employerInfo: text("employer_info"),
  healthId: text("health_id").unique(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  migrantId: varchar("migrant_id").notNull().references(() => migrantProfiles.id),
  recordType: text("record_type").notNull(), // visit, immunization, lab, document
  title: text("title").notNull(),
  description: text("description"),
  doctorName: text("doctor_name"),
  facilityName: text("facility_name"),
  date: timestamp("date").notNull(),
  attachments: jsonb("attachments"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vaccinations = pgTable("vaccinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  migrantId: varchar("migrant_id").notNull().references(() => migrantProfiles.id),
  vaccineName: text("vaccine_name").notNull(),
  status: text("status").notNull().default("pending"), // completed, pending, scheduled
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  facilityName: text("facility_name"),
  batchNumber: text("batch_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  migrantId: varchar("migrant_id").references(() => migrantProfiles.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // urgent, warning, info
  isRead: boolean("is_read").default(false),
  isGlobal: boolean("is_global").default(false),
  region: text("region"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const symptoms = pgTable("symptoms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  migrantId: varchar("migrant_id").notNull().references(() => migrantProfiles.id),
  fever: boolean("fever").default(false),
  cough: boolean("cough").default(false),
  fatigue: boolean("fatigue").default(false),
  otherSymptoms: text("other_symptoms"),
  riskLevel: text("risk_level"), // low, medium, high
  recommendation: text("recommendation"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const clinics = pgTable("clinics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  phone: text("phone"),
  hours: text("hours"),
  services: jsonb("services"),
  distance: text("distance"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMigrantProfileSchema = createInsertSchema(migrantProfiles).omit({
  id: true,
  userId: true,
  healthId: true,
  createdAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
});

export const insertVaccinationSchema = createInsertSchema(vaccinations).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertSymptomSchema = createInsertSchema(symptoms).omit({
  id: true,
  submittedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MigrantProfile = typeof migrantProfiles.$inferSelect;
export type InsertMigrantProfile = z.infer<typeof insertMigrantProfileSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Symptom = typeof symptoms.$inferSelect;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Clinic = typeof clinics.$inferSelect;
