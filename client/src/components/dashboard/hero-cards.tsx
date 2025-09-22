import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { User, Syringe, AlertTriangle } from "lucide-react";

export default function HeroCards() {
  const { data: profile } = useQuery({
    queryKey: ["/api/migrant/profile"],
    queryFn: async () => {
      const response = await fetch("/api/migrant/profile", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  const { data: vaccinations } = useQuery({
    queryKey: ["/api/vaccinations"],
    queryFn: async () => {
      const response = await fetch("/api/vaccinations", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch vaccinations");
      return response.json();
    },
  });

  const completedVaccinations = vaccinations?.filter((v: any) => v.status === "completed").length || 0;
  const totalVaccinations = 4; // Expected total vaccinations
  const vaccinationProgress = (completedVaccinations / totalVaccinations) * 100;
  const nextVaccination = vaccinations?.find((v: any) => v.status === "scheduled");

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8" data-testid="hero-cards">
      {/* Health Record Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="kerala-card p-6 hover:shadow-lg transition-shadow"
        data-testid="card-health-summary"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Health Record Summary</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Name: {profile?.fullName || "Loading..."}</div>
              <div>Age: {profile?.age || "-"} | {profile?.gender || "-"} | {profile?.bloodGroup || "Not specified"}</div>
              <div>Allergies: None reported</div>
              <div>Last Checkup: 15 Sept 2024</div>
            </div>
          </div>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <Button 
          className="w-full kerala-button-primary" 
          size="sm"
          data-testid="button-view-details"
        >
          View Details
        </Button>
      </motion.div>

      {/* Vaccination Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="kerala-card p-6 hover:shadow-lg transition-shadow"
        data-testid="card-vaccination"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Vaccination Status</h3>
          <Syringe className="h-5 w-5 text-primary" />
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{Math.round(vaccinationProgress)}%</span>
          </div>
          <Progress value={vaccinationProgress} className="h-2" />
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {nextVaccination ? (
            <>Next: {nextVaccination.vaccineName} - {new Date(nextVaccination.scheduledDate).toLocaleDateString()}</>
          ) : (
            "All vaccinations up to date"
          )}
        </div>
        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
          size="sm"
          data-testid="button-book-appointment"
        >
          Book Appointment
        </Button>
      </motion.div>

      {/* Alerts & Risk Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="kerala-card p-6 hover:shadow-lg transition-shadow"
        data-testid="card-alerts"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Alerts & Risk Level</h3>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse-alert"></div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800 font-medium">TB Screening Due</span>
          </div>
        </div>
        <Button 
          className="w-full bg-yellow-500 text-white hover:bg-yellow-600" 
          size="sm"
          data-testid="button-schedule-screening"
        >
          Schedule Screening
        </Button>
      </motion.div>
    </div>
  );
}
