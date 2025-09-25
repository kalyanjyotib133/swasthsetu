import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Moon,
  Zap,
  Calendar,
  Download,
  Filter,
  Eye,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { useLiveHealthData, LiveHealthData } from "@/lib/realtime-service";
import { useAuth } from "@/hooks/use-auth";

export default function HealthAnalytics() {
  const { user } = useAuth();
  const { data: liveData, isConnected } = useLiveHealthData(user?.id || '');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update timestamp when live data changes
  useEffect(() => {
    if (liveData) {
      setLastUpdate(new Date());
    }
  }, [liveData]);

  // Use live data if available, otherwise fallback to mock data
  const healthTrends = liveData ? {
    heartRate: [
      { date: "Now", value: liveData.heartRate, target: 75 },
      { date: "5m", value: liveData.heartRate - 2, target: 75 },
      { date: "10m", value: liveData.heartRate + 1, target: 75 },
      { date: "15m", value: liveData.heartRate - 1, target: 75 },
      { date: "20m", value: liveData.heartRate + 2, target: 75 },
      { date: "25m", value: liveData.heartRate, target: 75 },
      { date: "30m", value: liveData.heartRate - 3, target: 75 }
    ],
    bloodPressure: [
      {
        date: "Now",
        systolic: liveData.bloodPressure.systolic,
        diastolic: liveData.bloodPressure.diastolic,
        targetSystolic: 120,
        targetDiastolic: 80
      },
      {
        date: "5m",
        systolic: liveData.bloodPressure.systolic - 2,
        diastolic: liveData.bloodPressure.diastolic - 1,
        targetSystolic: 120,
        targetDiastolic: 80
      },
      {
        date: "10m",
        systolic: liveData.bloodPressure.systolic + 1,
        diastolic: liveData.bloodPressure.diastolic + 1,
        targetSystolic: 120,
        targetDiastolic: 80
      },
      {
        date: "15m",
        systolic: liveData.bloodPressure.systolic - 1,
        diastolic: liveData.bloodPressure.diastolic,
        targetSystolic: 120,
        targetDiastolic: 80
      },
      {
        date: "20m",
        systolic: liveData.bloodPressure.systolic + 2,
        diastolic: liveData.bloodPressure.diastolic + 1,
        targetSystolic: 120,
        targetDiastolic: 80
      },
      {
        date: "25m",
        systolic: liveData.bloodPressure.systolic,
        diastolic: liveData.bloodPressure.diastolic - 1,
        targetSystolic: 120,
        targetDiastolic: 80
      },
      {
        date: "30m",
        systolic: liveData.bloodPressure.systolic - 2,
        diastolic: liveData.bloodPressure.diastolic,
        targetSystolic: 120,
        targetDiastolic: 80
      }
    ],
    sleep: [
      { date: "Mon", hours: liveData.sleepHours || 7.5, quality: liveData.sleepQuality || 85 },
      { date: "Tue", hours: liveData.sleepHours || 8.2, quality: liveData.sleepQuality || 90 },
      { date: "Wed", hours: liveData.sleepHours || 6.8, quality: liveData.sleepQuality || 75 },
      { date: "Thu", hours: liveData.sleepHours || 7.9, quality: liveData.sleepQuality || 88 },
      { date: "Fri", hours: liveData.sleepHours || 8.1, quality: liveData.sleepQuality || 92 },
      { date: "Sat", hours: liveData.sleepHours || 9.2, quality: liveData.sleepQuality || 95 },
      { date: "Sun", hours: liveData.sleepHours || 7.8, quality: liveData.sleepQuality || 87 }
    ],
    steps: [
      { date: "Mon", steps: liveData.steps || 8432, target: 10000 },
      { date: "Tue", steps: liveData.steps || 9215, target: 10000 },
      { date: "Wed", steps: liveData.steps || 6875, target: 10000 },
      { date: "Thu", steps: liveData.steps || 10450, target: 10000 },
      { date: "Fri", steps: liveData.steps || 9876, target: 10000 },
      { date: "Sat", steps: liveData.steps || 12500, target: 10000 },
      { date: "Sun", steps: liveData.steps || 8920, target: 10000 }
    ]
  } : {
    heartRate: [
      { date: "Mon", value: 72, target: 75 },
      { date: "Tue", value: 75, target: 75 },
      { date: "Wed", value: 78, target: 75 },
      { date: "Thu", value: 74, target: 75 },
      { date: "Fri", value: 76, target: 75 },
      { date: "Sat", value: 73, target: 75 },
      { date: "Sun", value: 71, target: 75 }
    ],
    bloodPressure: [
      { date: "Mon", systolic: 120, diastolic: 80, targetSystolic: 120, targetDiastolic: 80 },
      { date: "Tue", systolic: 118, diastolic: 78, targetSystolic: 120, targetDiastolic: 80 },
      { date: "Wed", systolic: 122, diastolic: 82, targetSystolic: 120, targetDiastolic: 80 },
      { date: "Thu", systolic: 119, diastolic: 79, targetSystolic: 120, targetDiastolic: 80 },
      { date: "Fri", systolic: 121, diastolic: 81, targetSystolic: 120, targetDiastolic: 80 },
      { date: "Sat", systolic: 117, diastolic: 77, targetSystolic: 120, targetDiastolic: 80 },
      { date: "Sun", systolic: 118, diastolic: 78, targetSystolic: 120, targetDiastolic: 80 }
    ],
    sleep: [
      { date: "Mon", hours: 7.5, quality: 85 },
      { date: "Tue", hours: 8.2, quality: 90 },
      { date: "Wed", hours: 6.8, quality: 75 },
      { date: "Thu", hours: 7.9, quality: 88 },
      { date: "Fri", hours: 8.1, quality: 92 },
      { date: "Sat", hours: 9.2, quality: 95 },
      { date: "Sun", hours: 7.8, quality: 87 }
    ],
    steps: [
      { date: "Mon", steps: 8432, target: 10000 },
      { date: "Tue", steps: 9215, target: 10000 },
      { date: "Wed", steps: 6875, target: 10000 },
      { date: "Thu", steps: 10450, target: 10000 },
      { date: "Fri", steps: 9876, target: 10000 },
      { date: "Sat", steps: 12500, target: 10000 },
      { date: "Sun", steps: 8920, target: 10000 }
    ]
  };

  const weeklyStats = {
    avgHeartRate: 74,
    avgBloodPressure: "119/79",
    totalSleepHours: 55.5,
    totalSteps: 75268,
    caloriesBurned: 18420,
    activeMinutes: 420
  };

  const healthGoals = [
    {
      id: "steps",
      title: "Daily Steps",
      current: 8920,
      target: 10000,
      unit: "steps",
      progress: 89,
      trend: "up",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "sleep",
      title: "Sleep Quality",
      current: 87,
      target: 90,
      unit: "%",
      progress: 87,
      trend: "up",
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "heart",
      title: "Heart Rate",
      current: 74,
      target: 75,
      unit: "bpm",
      progress: 99,
      trend: "stable",
      color: "from-red-500 to-pink-500"
    },
    {
      id: "water",
      title: "Water Intake",
      current: 6,
      target: 8,
      unit: "glasses",
      progress: 75,
      trend: "down",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <div className="space-y-8" data-testid="health-analytics">
      {/* Analytics Header with Enhanced Micro-interactions */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
      >
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Health Analytics
            </h2>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Wifi className="h-3 w-3" />
                  <span className="font-semibold">Live</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  <WifiOff className="h-3 w-3" />
                  <span className="font-semibold">Offline</span>
                </div>
              )}
              {liveData && (
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <RefreshCw className="h-3 w-3" />
                  <span className="font-semibold">Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">Track your health trends and progress with real-time data</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Weekly Summary Cards - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
      >
        {Object.entries(weeklyStats).map(([key, value], index) => (
          <Card key={key} className="bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {typeof value === 'number' && key.includes('Hours') ? `${value}h` :
                 typeof value === 'number' && key.includes('Steps') ? value.toLocaleString() :
                 typeof value === 'number' && key.includes('Minutes') ? `${value}m` :
                 typeof value === 'number' && key.includes('Burned') ? `${value.toLocaleString()}` :
                 value}
              </div>
              <div className="text-xs text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Charts Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Heart Rate Trend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Heart Rate Trend</h3>
                  <p className="text-sm text-gray-600">Last 7 days • BPM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2%
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between space-x-2">
              {healthTrends.heartRate.map((data, index) => (
                <div key={data.date} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex-1 flex items-end justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value / 100) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="w-8 bg-gradient-to-t from-red-400 to-red-600 rounded-t-sm relative"
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                        {data.value}
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{data.date}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Steps Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Daily Steps</h3>
                  <p className="text-sm text-gray-600">Progress towards 10K goal</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">8,920</div>
                <div className="text-sm text-gray-600">89% of goal</div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {healthTrends.steps.map((data, index) => (
                <motion.div
                  key={data.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-semibold text-gray-700 w-10">{data.date}</div>
                    <div className="flex-1">
                      <Progress
                        value={(data.steps / data.target) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-800">
                    {data.steps.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Health Goals Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">Health Goals Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {healthGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center`}>
                    {goal.id === "steps" && <Activity className="h-6 w-6 text-white" />}
                    {goal.id === "sleep" && <Moon className="h-6 w-6 text-white" />}
                    {goal.id === "heart" && <Heart className="h-6 w-6 text-white" />}
                    {goal.id === "water" && <Droplets className="h-6 w-6 text-white" />}
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    goal.trend === "up" ? "bg-green-100 text-green-800" :
                    goal.trend === "down" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {goal.trend === "up" && <TrendingUp className="h-3 w-3" />}
                    {goal.trend === "down" && <TrendingDown className="h-3 w-3" />}
                    {goal.trend === "stable" && <Activity className="h-3 w-3" />}
                    <span>{goal.progress}%</span>
                  </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-2">{goal.title}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current</span>
                    <span className="font-semibold text-gray-800">
                      {goal.current} {goal.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target</span>
                    <span className="font-semibold text-gray-800">
                      {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sleep Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Sleep Analysis</h3>
                <p className="text-sm text-gray-600">Quality and duration trends</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              View Details
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sleep Duration Chart */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Sleep Duration (Hours)</h4>
              <div className="space-y-3">
                {healthTrends.sleep.map((data, index) => (
                  <motion.div
                    key={data.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/60 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-semibold text-gray-700 w-10">{data.date}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-indigo-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(data.hours / 10) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {data.hours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{data.quality}% quality</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sleep Quality Insights */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Sleep Insights</h4>
              <div className="space-y-3">
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-semibold text-green-800">Improving Trend</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your sleep quality has improved by 12% this week compared to last week.
                  </p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-800">Optimal Duration</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You're consistently getting 7-9 hours of sleep, which is ideal for health.
                  </p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-semibold text-purple-800">Deep Sleep</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Average deep sleep duration: 1.8 hours per night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}