import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { useLiveHealthData } from "@/lib/realtime-service";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  Syringe,
  AlertTriangle,
  Trophy,
  TrendingUp,
  Target,
  Lightbulb,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Moon,
  Zap,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";

export default function HeroCards() {
  const { user } = useAuth();
  const { data: liveData, isConnected } = useLiveHealthData(user?.id || '');
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/migrant/profile"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch("/api/migrant/profile", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  const { data: vaccinations, isLoading: vaccinationsLoading } = useQuery({
    queryKey: ["/api/vaccinations"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch("/api/vaccinations", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch vaccinations");
      return response.json();
    },
  });

  const isLoading = profileLoading || vaccinationsLoading;

  const completedVaccinations = vaccinations?.filter((v: any) => v.status === "completed").length || 0;
  const totalVaccinations = 4;
  const vaccinationProgress = (completedVaccinations / totalVaccinations) * 100;
  const nextVaccination = vaccinations?.find((v: any) => v.status === "scheduled");

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 mb-8" data-testid="hero-cards">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Enhanced health score data with real-time metrics
  const healthScore = 87;
  const healthScoreData = {
    score: healthScore,
    status: "EXCELLENT",
    trend: "+5",
    trendLabel: "this month",
    improvement: "Improving trend",
    tip: "Schedule dental checkup in next 2 days",
    goal: "Reach 90+ score by month end",
    metrics: {
      records: 20,
      vaccinations: 85,
      checkups: 95,
      medication: 90,
      vitals: 88,
      lifestyle: 75
    },
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      oxygenSat: 98,
      sleepHours: 7.5,
      steps: 8432
    }
  };

  return (
    <div className="mb-8" data-testid="hero-cards">
      {/* Main Health Score Widget - Apollo24/7 Style */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-100/50 shadow-xl group"
        data-testid="health-score-widget"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/10 to-purple-400/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Left Section - Score Display */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    HEALTH SCORE
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Your wellness journey</p>
                </div>
              </div>

              {/* Enhanced Circular Progress Ring */}
              <div className="relative w-56 h-56 mx-auto lg:mx-0 mb-6">
                <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circles */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-100"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-indigo-100"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#healthGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: healthScore / 100 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    style={{
                      strokeDasharray: `${2 * Math.PI * 42}`,
                      strokeDashoffset: `${2 * Math.PI * 42 * (1 - healthScore / 100)}`
                    }}
                  />
                  {/* Define gradient */}
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {healthScore}
                  </div>
                  <div className="text-xl font-semibold text-gray-600 mb-1">
                    {healthScore}/100
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    ⭐ {healthScoreData.status}
                  </Badge>
                </div>
              </div>

              {/* Enhanced Score Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm">
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-semibold">+{healthScoreData.trend}</span>
                  </div>
                  <div className="text-gray-600">{healthScoreData.trendLabel}</div>
                  <div className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                    📈 {healthScoreData.improvement}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-2">💡 Daily Health Tip</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{healthScoreData.tip}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-purple-700">🎯 Goal: {healthScoreData.goal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Vitals & Quick Stats */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Today's Vitals
              </h3>

              {/* Real-time Vitals Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Heart Rate</p>
                        <p className="text-lg font-bold text-gray-800">
                          {liveData ? liveData.heartRate : healthScoreData.vitals.heartRate}
                          {isConnected && <span className="text-green-500 text-xs ml-1">●</span>}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-500 text-xs font-semibold">Normal</span>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Blood Pressure</p>
                        <p className="text-lg font-bold text-gray-800">
                          {liveData
                            ? `${liveData.bloodPressure.systolic}/${liveData.bloodPressure.diastolic}`
                            : healthScoreData.vitals.bloodPressure
                          }
                        </p>
                      </div>
                    </div>
                    <span className="text-green-500 text-xs font-semibold">Normal</span>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Thermometer className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Temperature</p>
                        <p className="text-lg font-bold text-gray-800">
                          {liveData ? liveData.temperature : healthScoreData.vitals.temperature}°F
                        </p>
                      </div>
                    </div>
                    <span className="text-green-500 text-xs font-semibold">Normal</span>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Steps</p>
                        <p className="text-lg font-bold text-gray-800">
                          {liveData ? liveData.steps.toLocaleString() : healthScoreData.vitals.steps.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-blue-500 text-xs font-semibold">Today</span>
                  </div>
                </motion.div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Activity className="h-5 w-5 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards Row */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8" data-testid="hero-stats-cards">
        {/* Health Record Summary Card */}
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
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100/50 shadow-lg group hover:shadow-xl transition-all duration-300"
          data-testid="card-health-summary"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Health Profile</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="font-semibold text-gray-800">{profile?.fullName || "Loading..."}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <span className="text-sm text-gray-600">Age | Gender</span>
                  <span className="font-semibold text-gray-800">{profile?.age || "-"} | {profile?.gender || "-"}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <span className="text-sm text-gray-600">Blood Group</span>
                  <span className="font-semibold text-gray-800">{profile?.bloodGroup || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <span className="text-sm text-gray-600">Last Checkup</span>
                  <span className="font-semibold text-gray-800">15 Sept 2024</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <span className="flex items-center justify-center">
              View Full Profile
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
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100/50 shadow-lg group hover:shadow-xl transition-all duration-300"
          data-testid="card-vaccination"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-3">
                <Syringe className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Vaccination Status</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{Math.round(vaccinationProgress)}%</div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Progress value={vaccinationProgress} className="h-3 bg-orange-100" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${vaccinationProgress}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-4 mb-4 border border-orange-200/50">
            {nextVaccination ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">Next: {nextVaccination.vaccineName}</p>
                  <p className="text-sm text-orange-600">{new Date(nextVaccination.scheduledDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-green-800">All vaccinations up to date</p>
                  <p className="text-sm text-green-600">Great job staying protected!</p>
                </div>
              </div>
            )}
          </div>

          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <span className="flex items-center justify-center">
              Schedule Vaccination
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

        {/* Health Alerts Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50 shadow-lg group hover:shadow-xl transition-all duration-300"
          data-testid="card-alerts"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Health Alerts</h3>
            </div>
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-200/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">TB Screening Due</p>
                  <p className="text-sm text-yellow-700 mt-1">Schedule within 2 weeks</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Moon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Sleep Quality</p>
                  <p className="text-sm text-blue-700 mt-1">Average 7.5 hours last week</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <span className="flex items-center justify-center">
              View All Alerts
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
    </div>
  );
}
