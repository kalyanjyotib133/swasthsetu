import { supabase } from "./supabase";
import type { User, AuthResponse } from "@/types/health";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user) {
    // Get or create user profile in our users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(profileError.message);
    }

    return {
      user: userProfile || {
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
        role: 'migrant',
        isVerified: data.user.email_confirmed_at ? true : false,
        createdAt: data.user.created_at,
      },
      token: data.session?.access_token || '',
    };
  }

  throw new Error('Login failed');
}

export async function register(userData: RegisterData): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        username: userData.username,
        role: userData.role || 'migrant',
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user) {
    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        username: userData.username,
        role: userData.role || 'migrant',
        isVerified: false,
        createdAt: new Date(data.user.created_at),
      },
      token: data.session?.access_token || '',
    };
  }

  throw new Error('Registration failed');
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }

  // Clear local storage
  localStorage.removeItem("user_data");
}

export async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Authentication timeout')), 5000)
    );

    const getUserPromise = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    };

    const user = await Promise.race([getUserPromise(), timeoutPromise]) as any;

    if (!user) return null;

    // Try to get user profile from our users table with timeout
    const getProfilePromise = async () => {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      return { userProfile, error };
    };

    try {
      const { userProfile, error } = await Promise.race([
        getProfilePromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 2000))
      ]) as { userProfile: any, error: any };

      if (userProfile && !error) {
        return userProfile;
      }
    } catch (profileError) {
      console.warn('User profile not found, using auth data:', profileError);
    }

    // Always return user data from auth, even if database query fails
    return {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      role: user.user_metadata?.role || 'migrant',
      isVerified: user.email_confirmed_at ? true : false,
      createdAt: new Date(user.created_at),
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    // If auth fails completely, return null to allow app to load
    return null;
  }
}

export async function setCurrentUser(user: User): Promise<void> {
  localStorage.setItem("user_data", JSON.stringify(user));
}

export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Add auth header to requests
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

// Additional Supabase auth utilities
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateProfile(updates: Partial<User>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}

// Google OAuth authentication
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard#oauth_callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // OAuth flow will redirect to Google and back to dashboard
  // The auth state listener in useAuth hook will handle the authentication
}
