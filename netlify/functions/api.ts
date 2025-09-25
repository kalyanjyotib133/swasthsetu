import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables at the very beginning
config({ path: join(__dirname, '..', '..', '.env') });

import { supabaseServer } from "../../server/supabase.js";

// Helper function to extract token from Authorization header
const authenticateToken = async (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Access token required', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      return { error: 'Invalid token', status: 403 };
    }

    return { user: { userId: user.id, role: user.user_metadata?.role || 'migrant' } };
  } catch (error) {
    return { error: 'Invalid token', status: 403 };
  }
};

// Migrant profile routes
export async function handleMigrantProfile(event: any) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);

  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: authResult.error })
    };
  }

  try {
    if (event.httpMethod === 'POST') {
      const profileData = JSON.parse(event.body);
      const { data, error } = await supabaseServer
        .from('migrant_profiles')
        .insert({
          ...profileData,
          user_id: authResult.user!.userId
        })
        .select()
        .single();

      if (error) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Invalid profile data", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'GET') {
      const { data, error } = await supabaseServer
        .from('migrant_profiles')
        .select('*')
        .eq('user_id', authResult.user!.userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Profile not found" })
          };
        }
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Failed to fetch profile", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'PUT') {
      const updateData = JSON.parse(event.body);
      const { data, error } = await supabaseServer
        .from('migrant_profiles')
        .update(updateData)
        .eq('user_id', authResult.user!.userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Profile not found" })
          };
        }
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Failed to update profile", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Invalid profile data", error })
    };
  }
}

// Health records routes
export async function handleHealthRecords(event: any) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);

  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: authResult.error })
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabaseServer
        .from('health_records')
        .select('*')
        .eq('migrant_id', authResult.user!.userId);

      if (error) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Failed to fetch records", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      const recordData = JSON.parse(event.body);
      const { data, error } = await supabaseServer
        .from('health_records')
        .insert({
          ...recordData,
          migrant_id: authResult.user!.userId
        })
        .select()
        .single();

      if (error) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Invalid record data", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Failed to process health records", error })
    };
  }
}

// Vaccination routes
export async function handleVaccinations(event: any) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);

  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: authResult.error })
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabaseServer
        .from('vaccinations')
        .select('*')
        .eq('migrant_id', authResult.user!.userId);

      if (error) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Failed to fetch vaccinations", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      const vaccinationData = JSON.parse(event.body);
      const { data, error } = await supabaseServer
        .from('vaccinations')
        .insert({
          ...vaccinationData,
          migrant_id: authResult.user!.userId
        })
        .select()
        .single();

      if (error) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Invalid vaccination data", error: error.message })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Failed to process vaccinations", error })
    };
  }
}

// Alerts routes
export async function handleAlerts(event: any) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);

  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: authResult.error })
    };
  }

  try {
    const { data, error } = await supabaseServer
      .from('alerts')
      .select('*')
      .or(`migrant_id.is.null,migrant_id.eq.${authResult.user!.userId}`);

    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Failed to fetch alerts", error: error.message })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Failed to fetch alerts", error })
    };
  }
}

// Symptom check routes
export async function handleSymptomsCheck(event: any) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);

  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: authResult.error })
    };
  }

  try {
    const symptomData = JSON.parse(event.body);

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
        migrant_id: authResult.user!.userId,
        risk_level: riskLevel,
        recommendation
      })
      .select()
      .single();

    if (error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Invalid symptom data", error: error.message })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Invalid symptom data", error })
    };
  }
}

// Clinics routes (public)
export async function handleClinics(event: any) {
  try {
    const { location } = event.queryStringParameters || {};
    let query = supabaseServer.from('clinics').select('*');

    if (location) {
      query = query.ilike('address', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Failed to fetch clinics", error: error.message })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Failed to fetch clinics", error })
    };
  }
}

// Main handler function
export async function handler(event: any, context: any) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '') || '/';

  try {
    if (path === '/migrant/profile' || path === '/migrant/profile/') {
      return await handleMigrantProfile(event);
    } else if (path === '/health/records' || path === '/health/records/') {
      return await handleHealthRecords(event);
    } else if (path === '/vaccinations' || path === '/vaccinations/') {
      return await handleVaccinations(event);
    } else if (path === '/alerts' || path === '/alerts/') {
      return await handleAlerts(event);
    } else if (path === '/symptoms/check' || path === '/symptoms/check/') {
      return await handleSymptomsCheck(event);
    } else if (path === '/clinics' || path === '/clinics/') {
      return await handleClinics(event);
    } else {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Not found" })
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Internal server error", error: error instanceof Error ? error.message : String(error) })
    };
  }
}