import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import DashboardNavigation from "@/components/dashboard/navigation";
import HeroCards from "@/components/dashboard/hero-cards";
import SymptomCheck from "@/components/dashboard/symptom-checker";
import VaccinationTracker from "@/components/dashboard/vaccination-tracker";
import HealthRecords from "@/components/dashboard/health-records";
import AlertsFeed from "@/components/dashboard/alerts-feed";
import NearbyClinics from "@/components/dashboard/nearby-clinics";
import HealthTips from "@/components/dashboard/health-tips";
import QuickActions from "@/components/dashboard/quick-actions";
import HealthAnalytics from "@/components/dashboard/health-analytics";
import PersonalizedInsights from "@/components/dashboard/personalized-insights";
import MobileNav from "@/components/ui/mobile-nav";
import EmergencyButton from "@/components/ui/emergency-button";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  console.log('Dashboard component rendered:', { user: user?.id, loading, pathname: window.location.pathname });

  // Error boundary for dashboard components
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Dashboard error:', event.error);
      setError('An error occurred while loading the dashboard');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your health records</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (with safety check)
  if (!user && !loading) {
    console.log('No authenticated user found, redirecting to landing page');
    window.location.href = "/";
    return null;
  }

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your health records</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      data-testid="dashboard-page"
      style={{ touchAction: 'pan-y' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardNavigation />

      <motion.div
        className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-24 lg:pb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroCards />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SymptomCheck />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <VaccinationTracker />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <HealthRecords />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <AlertsFeed />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <NearbyClinics />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <HealthTips />
        </motion.div>

        {/* Quick Actions Grid - Now part of main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <QuickActions />
        </motion.div>

        {/* Health Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <HealthAnalytics />
        </motion.div>

        {/* Personalized Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <PersonalizedInsights />
        </motion.div>
      </motion.div>

      <MobileNav />
    </motion.div>
  );
}
