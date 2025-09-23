-- Supabase Database Schema for MigrantHealthConnect
-- Execute this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (replaces the custom users table)
-- This will work alongside Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'migrant' CHECK (role IN ('migrant', 'health_worker', 'officer', 'admin')),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrant profiles table
CREATE TABLE IF NOT EXISTS public.migrant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    mobile TEXT NOT NULL,
    blood_group TEXT,
    language TEXT DEFAULT 'malayalam',
    home_state TEXT,
    current_location TEXT,
    employer_info TEXT,
    health_id TEXT UNIQUE,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health records table
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migrant_id UUID NOT NULL REFERENCES public.migrant_profiles(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (record_type IN ('visit', 'immunization', 'lab', 'document')),
    title TEXT NOT NULL,
    description TEXT,
    doctor_name TEXT,
    facility_name TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    attachments JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccinations table
CREATE TABLE IF NOT EXISTS public.vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migrant_id UUID NOT NULL REFERENCES public.migrant_profiles(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'scheduled')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    facility_name TEXT,
    batch_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migrant_id UUID REFERENCES public.migrant_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('urgent', 'warning', 'info')),
    is_read BOOLEAN DEFAULT false,
    is_global BOOLEAN DEFAULT false,
    region TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptoms table
CREATE TABLE IF NOT EXISTS public.symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migrant_id UUID NOT NULL REFERENCES public.migrant_profiles(id) ON DELETE CASCADE,
    fever BOOLEAN DEFAULT false,
    cough BOOLEAN DEFAULT false,
    fatigue BOOLEAN DEFAULT false,
    other_symptoms TEXT,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
    recommendation TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinics table
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude TEXT,
    longitude TEXT,
    phone TEXT,
    hours TEXT,
    services JSONB,
    distance TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_migrant_profiles_user_id ON public.migrant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_migrant_profiles_health_id ON public.migrant_profiles(health_id);
CREATE INDEX IF NOT EXISTS idx_health_records_migrant_id ON public.health_records(migrant_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON public.health_records(date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_migrant_id ON public.vaccinations(migrant_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_status ON public.vaccinations(status);
CREATE INDEX IF NOT EXISTS idx_alerts_migrant_id ON public.alerts(migrant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_symptoms_migrant_id ON public.symptoms(migrant_id);
CREATE INDEX IF NOT EXISTS idx_clinics_location ON public.clinics(latitude, longitude);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migrant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Migrant profiles are viewable by owner" ON public.migrant_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Migrant profiles are insertable by owner" ON public.migrant_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Migrant profiles are updatable by owner" ON public.migrant_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Health records are viewable by owner" ON public.health_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = health_records.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Health records are insertable by owner" ON public.health_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = health_records.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Vaccinations are viewable by owner" ON public.vaccinations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = vaccinations.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Vaccinations are insertable by owner" ON public.vaccinations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = vaccinations.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Vaccinations are updatable by owner" ON public.vaccinations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = vaccinations.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Alerts are viewable by owner" ON public.alerts
    FOR SELECT USING (
        migrant_id IS NULL OR
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = alerts.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Symptoms are viewable by owner" ON public.symptoms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = symptoms.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Symptoms are insertable by owner" ON public.symptoms
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.migrant_profiles
            WHERE migrant_profiles.id = symptoms.migrant_id
            AND migrant_profiles.user_id = auth.uid()
        )
    );

-- Clinics are publicly readable
CREATE POLICY "Clinics are publicly readable" ON public.clinics
    FOR SELECT USING (true);

-- Create a function to handle user creation from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for testing
INSERT INTO public.clinics (name, address, latitude, longitude, phone, hours, services) VALUES
('Primary Health Center', 'Perumbavoor, Kerala', '10.1067', '76.4736', '0484-2523456', '8:00 AM - 5:00 PM', '["general_medicine", "vaccination", "emergency"]'),
('Community Health Center', 'Kothamangalam, Kerala', '10.0618', '76.6290', '0485-2823456', '8:00 AM - 6:00 PM', '["general_medicine", "maternal_care", "child_health"]'),
('District Hospital', 'Muvattupuzha, Kerala', '9.9799', '76.5738', '0485-2833456', '24/7', '["emergency", "surgery", "specialist_care"]');