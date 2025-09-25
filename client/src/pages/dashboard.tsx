import { useEffect } from "react";
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
  const { user } = useAuth();

  return (
    <motion.div
      className="min-h-screen bg-background"
      data-testid="dashboard-page"
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
