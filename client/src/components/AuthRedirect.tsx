import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading) {
      const hash = window.location.hash;
      const hasAccessToken = hash.includes("access_token");
      const hasOAuthCallback = hash.includes("oauth_callback");

      // If user is authenticated and on landing page, redirect to dashboard
      if (user && window.location.pathname === "/") {
        setLocation("/dashboard");
      }
      // If user is authenticated and on login page, redirect to dashboard
      else if (user && window.location.pathname === "/login") {
        setLocation("/dashboard");
      }
      // If user is authenticated and on register page, redirect to dashboard
      else if (user && window.location.pathname === "/register") {
        setLocation("/dashboard");
      }
      // If user is authenticated and on not-found page, redirect to dashboard
      else if (user && window.location.pathname === "/not-found") {
        setLocation("/dashboard");
      }
      // Handle OAuth callback - redirect to dashboard if we have auth tokens
      else if ((hasAccessToken || hasOAuthCallback) && !loading) {
        console.log('OAuth callback detected, redirecting to dashboard');
        // Clean up the URL by removing hash parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        setLocation("/dashboard");
      }
      // Only redirect from dashboard to landing if user explicitly navigates there without auth
      // Don't redirect during OAuth callback process or if still loading
      else if (!user && window.location.pathname === "/dashboard" &&
               !hasAccessToken && !hasOAuthCallback && !loading) {
        setLocation("/");
      }
    }
  }, [user, loading, setLocation]);

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {window.location.hash.includes("access_token") || window.location.hash.includes("oauth_callback")
              ? "Completing Google login..."
              : "Loading your dashboard..."
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {window.location.hash.includes("access_token") || window.location.hash.includes("oauth_callback")
              ? "Please wait while we verify your credentials"
              : "Please wait while we prepare your health records"
            }
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}