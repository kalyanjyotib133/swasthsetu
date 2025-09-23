import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { User, Syringe, AlertTriangle } from "lucide-react";

export default function HeroCards() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/migrant/profile"],
    queryFn: async () => {
      const response = await fetch("/api/migrant/profile", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  const { data: vaccinations, isLoading: vaccinationsLoading } = useQuery({
    queryKey: ["/api/vaccinations"],
    queryFn: async () => {
      const response = await fetch("/api/vaccinations", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch vaccinations");
      return response.json();
    },
  });

  const isLoading = profileLoading || vaccinationsLoading;

  const completedVaccinations = vaccinations?.filter((v: any) => v.status === "completed").length || 0;
  const totalVaccinations = 4; // Expected total vaccinations
  const vaccinationProgress = (completedVaccinations / totalVaccinations) * 100;
  const nextVaccination = vaccinations?.find((v: any) => v.status === "scheduled");

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 mb-8" data-testid="hero-cards">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8 stagger-animation" data-testid="hero-cards">
      {/* Health Record Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className="professional-card p-6 card-hover-effect group"
        data-testid="card-health-summary"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">Health Record Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">{profile?.fullName || "Loading..."}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Details:</span>
                <span className="text-foreground">{profile?.age || "-"} | {profile?.gender || "-"} | {profile?.bloodGroup || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Allergies:</span>
                <span className="text-foreground">None reported</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Last Checkup:</span>
                <span className="text-foreground">15 Sept 2024</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <User className="h-8 w-8 text-primary" />
          </div>
        </div>
        <Button
          className="w-full kerala-button-primary group-hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          size="sm"
          data-testid="button-view-details"
        >
          <span className="flex items-center justify-center">
            View Details
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.div>
          </span>
        </Button>
      </motion.div>

      {/* Vaccination Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className="professional-card p-6 card-hover-effect group"
        data-testid="card-vaccination"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Vaccination Status</h3>
          <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Syringe className="h-5 w-5 text-accent" />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="text-foreground font-semibold text-accent">{Math.round(vaccinationProgress)}%</span>
          </div>
          <div className="relative">
            <Progress value={vaccinationProgress} className="h-3 bg-muted/50" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent/60 to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${vaccinationProgress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
          {nextVaccination ? (
            <div className="flex items-center space-x-2">
              <span className="text-accent font-medium">Next:</span>
              <span className="text-foreground">{nextVaccination.vaccineName}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-foreground">{new Date(nextVaccination.scheduledDate).toLocaleDateString()}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium">✓</span>
              <span className="text-foreground">All vaccinations up to date</span>
            </div>
          )}
        </div>
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          size="sm"
          data-testid="button-book-appointment"
        >
          <span className="flex items-center justify-center">
            Book Appointment
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.div>
          </span>
        </Button>
      </motion.div>

      {/* Alerts & Risk Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className="professional-card p-6 card-hover-effect group"
        data-testid="card-alerts"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Alerts & Risk Level</h3>
          <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full glow-effect"></div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-lg p-4 mb-4 group-hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <span className="text-sm text-yellow-800 font-semibold">TB Screening Due</span>
          </div>
          <div className="mt-2 text-xs text-yellow-700">
            Please schedule your screening within the next 2 weeks
          </div>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 group-hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          size="sm"
          data-testid="button-schedule-screening"
        >
          <span className="flex items-center justify-center">
            Schedule Screening
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.div>
          </span>
        </Button>
      </motion.div>
    </div>
  );
}
