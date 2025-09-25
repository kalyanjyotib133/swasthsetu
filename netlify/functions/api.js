// netlify/functions/api.ts
import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL || "https://dubqlbhbthqwaqojcbwe.supabase.co";
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MTUzMywiZXhwIjoyMDc0MTM3NTMzfQ.gqD-4ZURaF6lqQWroD1gtyzbbI_D7lVdzLpj41AB3OE";
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnFsYmhidGhxd2Fxb2pjYndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjE1MzMsImV4cCI6MjA3NDEzNzUzM30.DluC7TMLtOEj7L-oJSa0PzaT-t0uCn1GMxoSOzHgZhM";
if (!supabaseServiceRoleKey && !supabaseAnonKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required for server-side operations");
}
var keyToUse = supabaseServiceRoleKey || supabaseAnonKey || "";
var supabaseServer = createClient(supabaseUrl, keyToUse, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// netlify/functions/api.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
config({ path: join(__dirname, "..", "..", ".env") });
var authenticateToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Access token required", status: 401 };
  }
  const token = authHeader.split(" ")[1];
  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return { error: "Invalid token", status: 403 };
    }
    return { user: { userId: user.id, role: user.user_metadata?.role || "migrant" } };
  } catch (error) {
    return { error: "Invalid token", status: 403 };
  }
};
async function handleMigrantProfile(event) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);
  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: authResult.error })
    };
  }
  try {
    if (event.httpMethod === "POST") {
      const profileData = JSON.parse(event.body);
      const { data, error } = await supabaseServer.from("migrant_profiles").insert({
        ...profileData,
        user_id: authResult.user.userId
      }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Invalid profile data", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    if (event.httpMethod === "GET") {
      const { data, error } = await supabaseServer.from("migrant_profiles").select("*").eq("user_id", authResult.user.userId).single();
      if (error) {
        if (error.code === "PGRST116") {
          return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Profile not found" })
          };
        }
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Failed to fetch profile", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    if (event.httpMethod === "PUT") {
      const updateData = JSON.parse(event.body);
      const { data, error } = await supabaseServer.from("migrant_profiles").update(updateData).eq("user_id", authResult.user.userId).select().single();
      if (error) {
        if (error.code === "PGRST116") {
          return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Profile not found" })
          };
        }
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Failed to update profile", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid profile data", error })
    };
  }
}
async function handleHealthRecords(event) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);
  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: authResult.error })
    };
  }
  try {
    if (event.httpMethod === "GET") {
      const { data, error } = await supabaseServer.from("health_records").select("*").eq("migrant_id", authResult.user.userId);
      if (error) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Failed to fetch records", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    if (event.httpMethod === "POST") {
      const recordData = JSON.parse(event.body);
      const { data, error } = await supabaseServer.from("health_records").insert({
        ...recordData,
        migrant_id: authResult.user.userId
      }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Invalid record data", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to process health records", error })
    };
  }
}
async function handleVaccinations(event) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);
  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: authResult.error })
    };
  }
  try {
    if (event.httpMethod === "GET") {
      const { data, error } = await supabaseServer.from("vaccinations").select("*").eq("migrant_id", authResult.user.userId);
      if (error) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Failed to fetch vaccinations", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    if (event.httpMethod === "POST") {
      const vaccinationData = JSON.parse(event.body);
      const { data, error } = await supabaseServer.from("vaccinations").insert({
        ...vaccinationData,
        migrant_id: authResult.user.userId
      }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Invalid vaccination data", error: error.message })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to process vaccinations", error })
    };
  }
}
async function handleAlerts(event) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);
  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: authResult.error })
    };
  }
  try {
    const { data, error } = await supabaseServer.from("alerts").select("*").or(`migrant_id.is.null,migrant_id.eq.${authResult.user.userId}`);
    if (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Failed to fetch alerts", error: error.message })
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to fetch alerts", error })
    };
  }
}
async function handleSymptomsCheck(event) {
  const authHeader = event.headers.authorization;
  const authResult = await authenticateToken(authHeader);
  if (authResult.error) {
    return {
      statusCode: authResult.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: authResult.error })
    };
  }
  try {
    const symptomData = JSON.parse(event.body);
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
    const { data, error } = await supabaseServer.from("symptoms").insert({
      ...symptomData,
      migrant_id: authResult.user.userId,
      risk_level: riskLevel,
      recommendation
    }).select().single();
    if (error) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid symptom data", error: error.message })
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid symptom data", error })
    };
  }
}
async function handleClinics(event) {
  try {
    const { location } = event.queryStringParameters || {};
    let query = supabaseServer.from("clinics").select("*");
    if (location) {
      query = query.ilike("address", `%${location}%`);
    }
    const { data, error } = await query;
    if (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Failed to fetch clinics", error: error.message })
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to fetch clinics", error })
    };
  }
}
async function handler(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  const path = event.path.replace("/.netlify/functions/api", "") || "/";
  try {
    if (path === "/migrant/profile" || path === "/migrant/profile/") {
      return await handleMigrantProfile(event);
    } else if (path === "/health/records" || path === "/health/records/") {
      return await handleHealthRecords(event);
    } else if (path === "/vaccinations" || path === "/vaccinations/") {
      return await handleVaccinations(event);
    } else if (path === "/alerts" || path === "/alerts/") {
      return await handleAlerts(event);
    } else if (path === "/symptoms/check" || path === "/symptoms/check/") {
      return await handleSymptomsCheck(event);
    } else if (path === "/clinics" || path === "/clinics/") {
      return await handleClinics(event);
    } else {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Not found" })
      };
    }
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Internal server error", error: error instanceof Error ? error.message : String(error) })
    };
  }
}
export {
  handleAlerts,
  handleClinics,
  handleHealthRecords,
  handleMigrantProfile,
  handleSymptomsCheck,
  handleVaccinations,
  handler
};
