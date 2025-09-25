import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VaccinationModal from "@/components/modals/vaccination-modal";
import {
  Phone,
  Hospital,
  Pill,
  Calendar,
  FileText,
  Bot,
  Bell,
  User,
  Activity,
  Shield,
  Clock,
  MapPin,
  Stethoscope,
  Heart,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  LineChart,
  PieChart
} from "lucide-react";

export default function QuickActions() {
  const { toast } = useToast();

  const handleEmergency = () => {
    toast({
      title: "🚨 Emergency Services",
      description: "Calling emergency services and alerting contacts...",
      duration: 5000,
    });
    window.open('tel:108', '_self');
  };

  const handleHospital = () => {
    toast({
      title: "🏥 Finding Hospitals",
      description: "Locating nearest healthcare facilities...",
    });
  };

  const handleMedicine = () => {
    toast({
      title: "💊 Medicine Tracker",
      description: "Opening medication management...",
    });
  };

  const handleAppointment = () => {
    toast({
      title: "📅 Book Appointment",
      description: "Opening appointment booking system...",
    });
  };

  const handleRecords = () => {
    toast({
      title: "📋 Health Records",
      description: "Accessing your medical records...",
    });
  };

  const handleAIChat = () => {
    toast({
      title: "🤖 AI Health Assistant",
      description: "Connecting to SEETU AI assistant...",
    });
  };

  const handleAlerts = () => {
    toast({
      title: "🔔 Health Alerts",
      description: "Checking for health notifications...",
    });
  };

  const handleConsult = () => {
    toast({
      title: "👨‍⚕️ Consult Doctor",
      description: "Connecting to healthcare consultation...",
    });
  };

  const serviceCategories = [
    {
      id: "emergency",
      icon: Phone,
      title: "Emergency",
      subtitle: "Call 108",
      description: "24/7 emergency support",
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      borderColor: "border-red-200/50",
      iconBg: "bg-gradient-to-br from-red-500 to-red-600",
      status: "active",
      badge: "Critical"
    },
    {
      id: "hospital",
      icon: Hospital,
      title: "Hospital Finder",
      subtitle: "Find Nearby",
      description: "Locate healthcare facilities",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200/50",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      status: "available",
      badge: "Nearby"
    },
    {
      id: "medicine",
      icon: Pill,
      title: "Medicine Tracker",
      subtitle: "Track & Refill",
      description: "Manage medications",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100/50",
      borderColor: "border-green-200/50",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      status: "available",
      badge: "Smart"
    },
    {
      id: "consultation",
      icon: Stethoscope,
      title: "Doctor Consult",
      subtitle: "Chat Now",
      description: "Instant medical advice",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100/50",
      borderColor: "border-purple-200/50",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      status: "online",
      badge: "Online"
    },
    {
      id: "records",
      icon: FileText,
      title: "Health Records",
      subtitle: "Digital History",
      description: "Access medical records",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100/50",
      borderColor: "border-orange-200/50",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      status: "synced",
      badge: "Secure"
    },
    {
      id: "ai-assistant",
      icon: Bot,
      title: "AI Assistant",
      subtitle: "SEETU AI",
      description: "Smart health guidance",
      color: "from-cyan-500 to-cyan-600",
      hoverColor: "hover:from-cyan-600 hover:to-cyan-700",
      bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100/50",
      borderColor: "border-cyan-200/50",
      iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      status: "ready",
      badge: "AI-Powered"
    },
    {
      id: "vitals",
      icon: Heart,
      title: "Health Vitals",
      subtitle: "Track Progress",
      description: "Monitor vital signs",
      color: "from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700",
      bgColor: "bg-gradient-to-br from-pink-50 to-pink-100/50",
      borderColor: "border-pink-200/50",
      iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
      status: "tracking",
      badge: "Live"
    },
    {
      id: "appointments",
      icon: Calendar,
      title: "Appointments",
      subtitle: "Schedule Visit",
      description: "Book consultations",
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100/50",
      borderColor: "border-indigo-200/50",
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      status: "available",
      badge: "Easy"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "online":
      case "ready":
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>;
      case "tracking":
        return <Activity className="w-3 h-3 text-blue-500" />;
      case "synced":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "online":
      case "ready":
        return "text-green-600 bg-green-50";
      case "tracking":
        return "text-blue-600 bg-blue-50";
      case "synced":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="service-categories-grid">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Apollo24/7 Healthcare Services</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Healthcare at Your Fingertips
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Access comprehensive healthcare services instantly with our advanced digital platform
          </p>
        </motion.div>

        {/* Service Categories Grid - Enhanced Mobile-First */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {serviceCategories.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30, scale: 0.9, rotateY: -15 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateY: 0,
                transition: {
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }
              }}
              whileHover={{
                y: -12,
                scale: 1.03,
                rotateX: 5,
                transition: {
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{
                scale: 0.98,
                rotateX: 0,
                transition: { duration: 0.1 }
              }}
              className="group cursor-pointer"
            >
              <div
                className={`relative overflow-hidden ${service.bgColor} rounded-3xl p-6 border ${service.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:shadow-xl`}
                onClick={getServiceHandler(service.id)}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500"></div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center space-x-1">
                  {getStatusIcon(service.status)}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(service.status)}`}>
                    {service.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-4">
                  <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                      {service.subtitle}
                    </span>
                    <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gray-600 text-sm">→</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 bg-gray-50 rounded-2xl px-8 py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>🔒 Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>⚡ Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>🏥 24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>💝 Healthcare for All</span>
            </div>
          </div>

          {/* Call-to-Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center">
                Explore All Services
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );

  function getServiceHandler(serviceId: string) {
    const handlers: { [key: string]: () => void } = {
      emergency: handleEmergency,
      "hospital": handleHospital,
      "medicine": handleMedicine,
      "consultation": handleConsult,
      "records": handleRecords,
      "ai-assistant": handleAIChat,
      "vitals": handleAlerts,
      "appointments": handleAppointment
    };
    return handlers[serviceId] || (() => console.log(`Service ${serviceId} clicked`));
  }
}
