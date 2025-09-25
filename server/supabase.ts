import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dubqlbhbthqwaqojcbwe.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MTUzMywiZXhwIjoyMDc0MTM3NTMzfQ.gqD-4ZURaF6lqQWroD1gtyzbbI_D7lVdzLpj41AB3OE';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjE1MzMsImV4cCI6MjA3NDEzNzUzM30.DluC7TMLtOEj7L-oJSa0PzaT-t0uCn1GMxoSOzHgZhM';

if (!supabaseServiceRoleKey && !supabaseAnonKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required for server-side operations');
}

// Use service role key if available, otherwise fall back to anon key for development
const keyToUse = supabaseServiceRoleKey || supabaseAnonKey || '';

export const supabaseServer = createClient(supabaseUrl, keyToUse, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabaseServer;