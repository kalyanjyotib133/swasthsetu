import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Calendar,
  Clock,
  Star,
  Zap,
  Heart,
  Brain,
  Shield,
  Activity,
  Bell,
  Award,
  Sparkles
} from "lucide-react";

export default function PersonalizedInsights() {
  // Mock personalized insights data
  const insightsData = {
    dailyScore: 87,
    weeklyTrend: "+12%",
    riskLevel: "Low",
    nextAppointment: "Cardiology Checkup - Dec 15, 2024",
    achievements: [
      {
        id: "steps-goal",
        title: "10K Steps Champion",
        description: "Achieved daily step goal for 5 consecutive days",
        icon: Activity,
        color: "from-green-500 to-emerald-500",
        earnedAt: "2 hours ago"
      },
      {
        id: "sleep-quality",
        title: "Sleep Master",
        description: "Maintained excellent sleep quality this week",
        icon: Heart,
        color: "from-blue-500 to-indigo-500",
        earnedAt: "1 day ago"
      },
      {
        id: "heart-health",
        title: "Heart Guardian",
        description: "Perfect heart rate readings all week",
        icon: Shield,
        color: "from-red-500 to-pink-500",
        earnedAt: "3 days ago"
      }
    ],
    aiRecommendations: [
      {
        id: "hydration",
        type: "hydration",
        title: "Increase Water Intake",
        description: "You're 2 glasses below your daily hydration goal. Consider setting hourly reminders.",
        priority: "medium",
        actionable: true,
        impact: "High",
        icon: Zap
      },
      {
        id: "exercise",
        type: "exercise",
        title: "Add Cardio Session",
        description: "Based on your heart rate patterns, adding 20 minutes of cardio 3x/week would optimize your fitness score.",
        priority: "high",
        actionable: true,
        impact: "Very High",
        icon: Heart
      },
      {
        id: "sleep",
        type: "sleep",
        title: "Optimize Sleep Schedule",
        description: "Your sleep quality peaks when you maintain consistent bedtime. Try sleeping by 11 PM tonight.",
        priority: "medium",
        actionable: true,
        impact: "Medium",
        icon: Brain
      },
      {
        id: "stress",
        type: "wellness",
        title: "Stress Management",
        description: "Your recent activity patterns suggest moderate stress. Consider meditation or breathing exercises.",
        priority: "low",
        actionable: true,
        impact: "Medium",
        icon: Shield
      }
    ],
    healthPredictions: [
      {
        metric: "Blood Pressure",
        prediction: "Stable",
        confidence: 92,
        trend: "Improving",
        impact: "High",
        recommendation: "Continue current lifestyle patterns"
      },
      {
        metric: "Heart Rate Variability",
        prediction: "Improving",
        confidence: 87,
        trend: "Up",
        impact: "Very High",
        recommendation: "Your HRV is improving due to consistent exercise"
      },
      {
        metric: "Sleep Quality",
        prediction: "Excellent",
        confidence: 94,
        trend: "Stable",
        impact: "High",
        recommendation: "Maintain current sleep hygiene practices"
      },
      {
        metric: "Energy Levels",
        prediction: "High",
        confidence: 89,
        trend: "Improving",
        impact: "Medium",
        recommendation: "Your energy levels are consistently high this week"
      }
    ],
    weeklyHighlights: [
      {
        category: "Most Active Day",
        value: "Saturday",
        detail: "12,500 steps",
        icon: Activity
      },
      {
        category: "Best Sleep Night",
        value: "Tuesday",
        detail: "8.2 hours, 95% quality",
        icon: Heart
      },
      {
        category: "Consistency Score",
        value: "94%",
        detail: "Excellent routine adherence",
        icon: CheckCircle
      },
      {
        category: "Recovery Rate",
        value: "Excellent",
        detail: "Fast recovery between activities",
        icon: TrendingUp
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "from-red-500 to-red-600";
      case "medium": return "from-yellow-500 to-orange-500";
      case "low": return "from-blue-500 to-indigo-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "Very High": return "bg-purple-100 text-purple-800 border-purple-200";
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8" data-testid="personalized-insights">
      {/* AI Insights Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-4">
          <Brain className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">AI-Powered Personalized Insights</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Your Health Intelligence
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get personalized recommendations based on your health data and patterns
        </p>
      </motion.div>

      {/* Daily Health Score - Mobile Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-lg overflow-hidden"
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Daily Health Score</h3>
                <p className="text-xs sm:text-sm text-gray-600">AI-calculated wellness indicator</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{insightsData.dailyScore}</div>
              <div className="text-xs sm:text-sm text-green-600 font-semibold">{insightsData.weeklyTrend} this week</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {insightsData.healthPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.metric}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/60 rounded-xl p-4 border border-indigo-100/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{prediction.metric}</span>
                  <Badge className={`text-xs ${getImpactBadge(prediction.impact)}`}>
                    {prediction.confidence}% confidence
                  </Badge>
                </div>
                <div className="text-lg font-bold text-indigo-600 mb-1">{prediction.prediction}</div>
                <div className="text-xs text-gray-600">{prediction.recommendation}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">AI Recommendations</h3>
          </div>

          {insightsData.aiRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getPriorityColor(recommendation.priority)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <recommendation.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{recommendation.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{recommendation.description}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getImpactBadge(recommendation.impact)}`}>
                    {recommendation.impact} Impact
                  </Badge>
                </div>

                {recommendation.actionable && (
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Bell className="h-4 w-4 mr-2" />
                      Remind Me
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Highlights & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Weekly Highlights */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Weekly Highlights</h3>
            </div>

            <div className="space-y-3">
              {insightsData.weeklyHighlights.map((highlight, index) => (
                <motion.div
                  key={highlight.category}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <highlight.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{highlight.category}</p>
                        <p className="font-bold text-gray-800">{highlight.value}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{highlight.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Recent Achievements</h3>
            </div>

            <div className="space-y-3">
              {insightsData.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <achievement.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <p className="text-xs text-gray-500">Earned {achievement.earnedAt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Risk Assessment</h3>
                <p className="text-sm text-gray-600">AI-powered health risk analysis</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{insightsData.riskLevel}</div>
              <div className="text-sm text-gray-600">Overall Risk</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Cardiovascular</h4>
              <p className="text-sm text-green-600 font-semibold mb-2">Low Risk</p>
              <p className="text-xs text-gray-600">Excellent heart health indicators</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Metabolic</h4>
              <p className="text-sm text-green-600 font-semibold mb-2">Low Risk</p>
              <p className="text-xs text-gray-600">Stable blood sugar and cholesterol</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Lifestyle</h4>
              <p className="text-sm text-yellow-600 font-semibold mb-2">Moderate Risk</p>
              <p className="text-xs text-gray-600">Consider increasing daily activity</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Comprehensive Checkup
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}