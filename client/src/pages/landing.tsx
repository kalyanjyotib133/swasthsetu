import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoginModal from "@/components/auth/login-modal";
import RegistrationModal from "@/components/auth/registration-modal";
import { useAuth } from "@/hooks/use-auth";
import {
  Heart,
  Shield,
  MapPin,
  Globe,
  Lock,
  QrCode,
  FileText,
  Syringe,
  Quote,
  Phone,
  Ambulance,
  ShieldAlert,
  Flame,
  Star,
  ChevronRight,
  Download,
  CheckCircle,
  Users,
  Building2,
  Clock,
  Award,
  Play,
  Menu,
  X,
  Languages
} from "lucide-react";

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "हिं", name: "हिंदी", flag: "🇮🇳" },
    { code: "বাং", name: "বাংলা", flag: "🇧🇩" }
  ];

  const features = [
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Store and access your complete medical history securely in the cloud",
      features: ["Secure cloud storage", "Instant access anywhere", "Share with doctors easily"],
      color: "text-blue-600"
    },
    {
      icon: Syringe,
      title: "Smart Appointments",
      description: "Book appointments with top doctors and track your health visits",
      features: ["500+ partner hospitals", "Real-time availability", "Video consultations"],
      color: "text-emerald-600"
    },
    {
      icon: Heart,
      title: "AI Health Assistant",
      description: "Get instant health guidance and symptom checking 24/7",
      features: ["24/7 symptom checker", "Multi-language support", "Emergency detection"],
      color: "text-emerald-500"
    },
    {
      icon: Shield,
      title: "Emergency Services",
      description: "One-tap access to emergency help and nearest hospital finder",
      features: ["Instant emergency calls", "Nearest hospital finder", "Medical ID access"],
      color: "text-red-500"
    }
  ];

  const emergencyContacts = [
    {
      number: "108",
      service: "Ambulance",
      icon: Ambulance,
      color: "bg-red-500 text-white",
      pulse: true
    },
    {
      number: "100",
      service: "Police",
      icon: ShieldAlert,
      color: "bg-blue-600 text-white"
    },
    {
      number: "101",
      service: "Fire",
      icon: Flame,
      color: "bg-orange-500 text-white"
    },
    {
      number: "104",
      service: "Health Helpline",
      icon: Phone,
      color: "bg-green-600 text-white"
    }
  ];

  const hospitalPartners = [
    "AIIMS", "Apollo", "Fortis", "Max Healthcare", "Medanta"
  ];

  const testimonials = [
    {
      quote: "This app saved my life when I had emergency in a new city. Found nearest hospital instantly!",
      name: "Ramesh Kumar",
      role: "Construction Worker",
      location: "Delhi",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      quote: "Finally, all my medical records in one place. Easy to share with any doctor anywhere.",
      name: "Priya Sharma",
      role: "Nurse",
      location: "Mumbai",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face"
    },
    {
      quote: "The AI assistant helped me understand my symptoms and find the right specialist quickly.",
      name: "Amit Patel",
      role: "Factory Worker",
      location: "Ahmedabad",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" data-testid="landing-page" style={{ touchAction: 'pan-y', paddingTop: '64px' }} /* Add padding for fixed nav */>
      {/* Premium Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo Section */}
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex-shrink-0">
                <motion.img
                  src="/swasthsetu-logo.png"
                  alt="Swasth Setu Logo"
                  className="h-8 sm:h-10 lg:h-12 w-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">Swasth Setu</h1>
                <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Digital Health Partner</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </a>
              <a href="#hospitals" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Hospitals
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About Us
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Language Toggle - Hidden on mobile */}
              <div className="relative hidden sm:block">
                <button
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors p-2 touch-manipulation"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                  onClick={() => setLanguage(language === "EN" ? "हिं" : "EN")}
                >
                  <span className="text-lg">
                    {languages.find(l => l.code === language)?.flag}
                  </span>
                  <Languages className="h-4 w-4" />
                </button>
              </div>

              {/* Login Button - Smaller on mobile */}
              <Button
                variant="outline"
                onClick={() => setShowLoginModal(true)}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm sm:text-base px-3 sm:px-4 py-2 touch-manipulation"
                style={{ minHeight: '44px' }}
              >
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Log in</span>
              </Button>

              {/* Get Started Button - Smaller on mobile */}
              <Button
                onClick={() => setShowRegisterModal(true)}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-3 sm:px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base touch-manipulation"
                style={{ minHeight: '44px' }}
              >
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Get Started</span>
                <ChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 touch-manipulation"
                style={{ minHeight: '44px', minWidth: '44px' }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 py-4 shadow-lg"
            >
              <div className="flex flex-col space-y-2 px-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-2 hover:bg-gray-50 rounded-lg touch-manipulation" style={{ minHeight: '48px' }} onClick={() => setIsMenuOpen(false)}>
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-2 hover:bg-gray-50 rounded-lg touch-manipulation" style={{ minHeight: '48px' }} onClick={() => setIsMenuOpen(false)}>
                  How It Works
                </a>
                <a href="#hospitals" className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-2 hover:bg-gray-50 rounded-lg touch-manipulation" style={{ minHeight: '48px' }} onClick={() => setIsMenuOpen(false)}>
                  Hospitals
                </a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-2 hover:bg-gray-50 rounded-lg touch-manipulation" style={{ minHeight: '48px' }} onClick={() => setIsMenuOpen(false)}>
                  About Us
                </a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-2 hover:bg-gray-50 rounded-lg touch-manipulation" style={{ minHeight: '48px' }} onClick={() => setIsMenuOpen(false)}>
                  Contact
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Premium Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-20"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-400/20 rounded-full animate-float"></div>

        <div className="relative z-10 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                >
                  Your Health Records,{" "}
                  <span className="text-yellow-300 relative">
                    Always With You
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-300 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                      style={{ originX: 0 }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed"
                >
                  Secure digital health platform designed specifically for migrant workers, students, and travelers.
                </motion.p>

                {/* Key Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col space-y-3 mb-8"
                >
                  {[
                    "✓ Access records from anywhere",
                    "✓ Multi-language support",
                    "✓ Emergency assistance 24/7"
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <span className="text-green-300 font-bold">{benefit}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowDemoModal(true)}
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 font-bold px-8 py-4 rounded-lg transition-all duration-300 text-lg group shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Phone Mockup */}
                <div className="relative mx-auto max-w-md">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop"
                      alt="Mobile health app interface"
                      className="w-full h-auto rounded-3xl shadow-2xl"
                    />

                    {/* Floating UI Elements */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                    >
                      <Heart className="h-8 w-8 text-red-500" />
                    </motion.div>

                    <motion.div
                      animate={{
                        rotate: [360, 0],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -bottom-4 -left-4 w-12 h-12 bg-emerald-400/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                    >
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute bottom-10 right-10 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{i}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Trusted by 10,000+</div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">migrants</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Strip */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Side - Trust Text */}
            <div className="text-center lg:text-left">
              <p className="text-gray-600 font-medium">Trusted by leading hospitals:</p>
            </div>

            {/* Center - Hospital Logos */}
            <div className="flex items-center justify-center space-x-8 overflow-hidden">
              {hospitalPartners.map((partner, index) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <div className="w-24 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors">
                    {partner}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Side - Security Badges */}
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-full"
              >
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">256-bit Encrypted</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full"
              >
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">ISO 27001 Certified</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Showcase */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Better Healthcare
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital health solutions designed for modern healthcare needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + itemIndex * 0.1 }}
                          className="flex items-center space-x-3 text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="mt-6 text-blue-600 font-semibold flex items-center group"
                    >
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Swasth Setu Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-blue-200 transform -translate-y-1/2 z-0"></div>

            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: 1,
                  title: "Create Your Account",
                  description: "Quick registration with basic details and phone verification",
                  icon: Users,
                  visual: "Sign up form with mobile verification"
                },
                {
                  step: 2,
                  title: "Upload Your Health Data",
                  description: "Scan or upload your medical records, prescriptions, and test reports",
                  icon: FileText,
                  visual: "Document upload interface with scanning"
                },
                {
                  step: 3,
                  title: "Access From Anywhere",
                  description: "Your health data travels with you - access from any device, anywhere",
                  icon: Globe,
                  visual: "Multi-device sync illustration"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center group"
                >
                  {/* Step Number */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl"
                  >
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </motion.div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-50 transition-colors">
                    <item.icon className="h-8 w-8 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>

                  {/* Visual Placeholder */}
                  <div className="bg-gray-50 rounded-xl p-6 h-32 flex items-center justify-center">
                    <p className="text-sm text-gray-500">{item.visual}</p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                      className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20"
                    >
                      <ChevronRight className="h-8 w-8 text-blue-400" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Counter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Happy Users", icon: Users },
              { number: "500+", label: "Partner Hospitals", icon: Building2 },
              { number: "24/7", label: "Emergency Support", icon: Clock },
              { number: "99.9%", label: "Data Security", icon: Shield }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1, type: "spring" }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="text-3xl md:text-4xl font-bold mb-2"
                >
                  {stat.number}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="text-blue-100 font-medium"
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Thousands of Users
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Rating */}
                <div className="flex items-center justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-3 bg-gray-200">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Button
              size="lg"
              onClick={() => setShowRegisterModal(true)}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
            >
              Join 50,000+ Happy Users
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Healthcare Partners Section */}
      <section id="hospitals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted Healthcare Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're proud to partner with leading hospitals and healthcare providers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            {hospitalPartners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              >
                <div className="text-lg font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  {partner}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Download Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get the Mobile App
              </h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Access your health records on the go with our mobile app. Available for iOS and Android.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  "Offline access to health records",
                  "Push notifications for appointments",
                  "Emergency SOS button",
                  "Multi-language support"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span className="text-blue-100">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-center lg:text-left"
              >
                <p className="text-blue-200 mb-2">Or scan QR code to download</p>
                <div className="inline-block bg-white p-4 rounded-2xl">
                  <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <img
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop"
                    alt="Mobile health app showcase"
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                </motion.div>

                {/* Stats Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">4.8★</div>
                    <div className="text-sm text-gray-600">1,000+ reviews</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer id="contact" className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/2 via-transparent to-white/2 opacity-20"></div>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="h-12 w-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4"
                  >
                    <span className="text-white font-bold text-lg">KL</span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">Swasth Setu</h3>
                    <p className="text-gray-400 text-sm">Digital Health Partner</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
                  Empowering migrant workers with secure, accessible healthcare solutions.
                  Supporting UN SDG-3 for good health and well-being for all.
                </p>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                    <motion.a
                      key={social}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="text-sm font-bold text-gray-400 capitalize">{social[0]}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Hospitals</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-bold text-lg mb-6">Support</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                </ul>
              </div>

              {/* Emergency Contacts */}
              <div>
                <h4 className="font-bold text-lg mb-6">Emergency</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <span className="block">Ambulance:</span>
                    <a href="tel:108" className="text-red-400 font-bold hover:text-red-300 transition-colors">108</a>
                  </li>
                  <li>
                    <span className="block">Police:</span>
                    <a href="tel:100" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">100</a>
                  </li>
                  <li>
                    <span className="block">Fire:</span>
                    <a href="tel:101" className="text-orange-400 font-bold hover:text-orange-300 transition-colors">101</a>
                  </li>
                  <li>
                    <span className="block">Health Helpline:</span>
                    <a href="tel:104" className="text-green-400 font-bold hover:text-green-300 transition-colors">104</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-400 mb-4 md:mb-0">
                  © 2024 All rights reserved SwasthSetu.
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Languages className="h-4 w-4" />
                    <span>Available in:</span>
                    <span className="text-lg">🇺🇸</span>
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-lg">🇧🇩</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Swasth Setu Demo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDemoModal(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="aspect-video bg-gray-900 relative">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Swasth Setu Demo Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center">
                Watch this demo to see how Swasth Setu helps you manage your health records efficiently.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
      <RegistrationModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
      />
    </div>
  );
}
