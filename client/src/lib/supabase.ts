import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dubqlbhbthqwaqojcbwe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjE1MzMsImV4cCI6MjA3NDEzNzUzM30.DluC7TMLtOEj7L-oJSa0PzaT-t0uCn1GMxoSOzHgZhM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;