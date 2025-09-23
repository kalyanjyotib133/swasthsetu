// Test script to verify Supabase connection
// Run with: node test-supabase-connection.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
  console.log('Please check your .env file and make sure these variables are set.');
  process.exit(1);
}

// Test client connection
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔄 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Service Role Key:', supabaseServiceRoleKey ? 'Set' : 'Not set');

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log('⚠️  Users table might not exist yet, or there might be RLS policies blocking access');
      console.log('This is normal if you haven\'t run the SQL schema yet.');
      console.log('Error details:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Users table exists and is accessible.');
    }

    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('⚠️  Auth connection test failed:', authError.message);
    } else {
      console.log('✅ Auth connection working!');
    }

    // Test server connection if service role key is available
    if (supabaseServiceRoleKey) {
      console.log('🔄 Testing server-side connection...');
      const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

      const { data: serverData, error: serverError } = await supabaseServer
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (serverError) {
        console.log('⚠️  Server connection failed:', serverError.message);
      } else {
        console.log('✅ Server-side connection working!');
      }
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testSupabaseConnection();