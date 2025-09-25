import { useState, useEffect, createContext, useContext } from "react";
import type { User } from "@/types/health";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, logout as authLogout } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithUser: (user: User) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getSession = async () => {
      const timeout = setTimeout(() => {
        if (isMounted) {
          console.warn('Auth timeout reached, proceeding without authentication');
          setLoading(false);
        }
      }, 8000); // Increased to 8 seconds for OAuth flows

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            clearTimeout(timeout);
            setLoading(false);
          }
          return;
        }

        // Check for OAuth callback parameters
        const hash = window.location.hash;
        const hasAccessToken = hash.includes("access_token");
        const hasOAuthCallback = hash.includes("oauth_callback");

        if (hasAccessToken || hasOAuthCallback) {
          console.log('OAuth callback detected, cleaning up URL and setting up session');
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (session?.user && isMounted) {
          try {
            console.log('Session found, fetching user profile...');
            const userProfile = await getCurrentUser();
            if (isMounted) {
              setUser(userProfile);
              console.log('User profile loaded successfully');
            }
          } catch (error) {
            console.error('Error getting current user:', error);
            if (isMounted) {
              setUser(null);
            }
          }
        }

        if (isMounted) {
          clearTimeout(timeout);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (isMounted) {
          clearTimeout(timeout);
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);

        // Check for OAuth callback parameters
        const hash = window.location.hash;
        const hasAccessToken = hash.includes("access_token");
        const hasOAuthCallback = hash.includes("oauth_callback");

        try {
          if (event === 'SIGNED_IN' && session?.user && isMounted) {
            console.log('User signed in, fetching profile...');
            const userProfile = await getCurrentUser();
            if (isMounted) {
              setUser(userProfile);
              console.log('User profile set successfully');
            }

            // Clean up URL after successful OAuth
            if (hasAccessToken || hasOAuthCallback) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            if (isMounted) {
              setUser(null);
            }
          }

          if (isMounted) {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { login } = await import("@/lib/auth");
      await login({ email, password });
      // Don't set loading to false here - let the auth state change listener handle it
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithUser = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      // Don't set loading to false here - let the auth state change listener handle it
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithUser,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
