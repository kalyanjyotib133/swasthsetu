import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import DashboardNavigation from "@/components/dashboard/navigation";
import HeroCards from "@/components/dashboard/hero-cards";
import SymptomCheck from "@/components/dashboard/symptom-check";
import VaccinationTracker from "@/components/dashboard/vaccination-tracker";
import HealthRecords from "@/components/dashboard/health-records";
import AlertsFeed from "@/components/dashboard/alerts-feed";
import NearbyClinics from "@/components/dashboard/nearby-clinics";
import HealthTips from "@/components/dashboard/health-tips";
import QuickActions from "@/components/dashboard/quick-actions";
import MobileNav from "@/components/ui/mobile-nav";
import EmergencyButton from "@/components/ui/emergency-button";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-page">
      <DashboardNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <HeroCards />
        <SymptomCheck />
        <VaccinationTracker />
        <HealthRecords />
        <AlertsFeed />
        <NearbyClinics />
        <HealthTips />
      </div>

      <QuickActions />
      <EmergencyButton />
      <MobileNav />
    </div>
  );
}
