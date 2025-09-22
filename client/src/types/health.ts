export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface MigrantProfile {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  mobile: string;
  bloodGroup?: string;
  language: string;
  homeState?: string;
  currentLocation?: string;
  employerInfo?: string;
  healthId?: string;
  profileImage?: string;
  createdAt: Date;
}

export interface HealthRecord {
  id: string;
  migrantId: string;
  recordType: string;
  title: string;
  description?: string;
  doctorName?: string;
  facilityName?: string;
  date: Date;
  attachments?: any;
  metadata?: any;
  createdAt: Date;
}

export interface Vaccination {
  id: string;
  migrantId: string;
  vaccineName: string;
  status: 'completed' | 'pending' | 'scheduled';
  scheduledDate?: Date;
  completedDate?: Date;
  facilityName?: string;
  batchNumber?: string;
  createdAt: Date;
}

export interface Alert {
  id: string;
  migrantId?: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info';
  isRead: boolean;
  isGlobal: boolean;
  region?: string;
  createdAt: Date;
}

export interface Symptom {
  id: string;
  migrantId: string;
  fever: boolean;
  cough: boolean;
  fatigue: boolean;
  otherSymptoms?: string;
  riskLevel?: string;
  recommendation?: string;
  submittedAt: Date;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  hours?: string;
  services?: string[];
  distance?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
