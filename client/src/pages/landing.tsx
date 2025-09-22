import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
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
  Flame
} from "lucide-react";

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  const features = [
    {
      icon: FileText,
      title: "Centralized Health Records",
      description: "All your medical history in one secure digital wallet",
      color: "text-primary"
    },
    {
      icon: Syringe,
      title: "Vaccination Tracking",
      description: "Never miss a vaccine with smart reminders and scheduling",
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: "Nearby Clinics Map",
      description: "Find healthcare facilities wherever you are working",
      color: "text-primary"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in Malayalam, Hindi, Tamil, and English",
      color: "text-primary"
    },
    {
      icon: Lock,
      title: "Data Privacy & Security",
      description: "Bank-level encryption keeps your health data safe",
      color: "text-primary"
    },
    {
      icon: QrCode,
      title: "QR Health Card",
      description: "Instant access to your health profile anywhere",
      color: "text-primary"
    }
  ];

  const emergencyContacts = [
    {
      number: "108",
      service: "Ambulance",
      icon: Ambulance,
      color: "bg-destructive text-destructive-foreground",
      pulse: true
    },
    {
      number: "100",
      service: "Police",
      icon: ShieldAlert,
      color: "bg-card border border-border text-foreground hover:shadow-lg"
    },
    {
      number: "101",
      service: "Fire",
      icon: Flame,
      color: "bg-card border border-border text-foreground hover:shadow-lg"
    },
    {
      number: "104",
      service: "Health Helpline",
      icon: Phone,
      color: "bg-primary text-primary-foreground"
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">KL</span>
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-semibold text-primary">SwasthSetu</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(true)}
                data-testid="button-login"
              >
                Login
              </Button>
              <Button
                onClick={() => setShowRegisterModal(true)}
                className="kerala-button-primary"
                data-testid="button-register"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="kerala-gradient py-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Digital Health Records for{" "}
                <span className="text-kerala-gold">Migrant Workers</span> in Kerala
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Track your health, get timely care, stay protected — all in one secure digital platform designed for your mobility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-white text-primary hover:bg-white/90 font-semibold transform hover:scale-105 transition-all"
                  data-testid="button-register-hero"
                >
                  Register as Migrant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowLoginModal(true)}
                  className="border-white text-white hover:bg-white hover:text-primary font-semibold"
                  data-testid="button-health-worker-login"
                >
                  Health Worker Login
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Healthcare workers helping patients"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SDG Highlight Section */}
      <section className="py-16 bg-card" data-testid="sdg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Supporting UN SDG-3</h2>
            <p className="text-xl text-muted-foreground">Good Health & Well-being for All</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Disease Prevention",
                description: "Early detection and preventive care for migrant communities"
              },
              {
                icon: Heart,
                title: "Fair Healthcare",
                description: "Equal access to healthcare services regardless of location"
              },
              {
                icon: Heart,
                title: "Real-time Surveillance",
                description: "Monitor health trends and respond to emergencies quickly"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="kerala-card text-center p-6"
                data-testid={`card-sdg-${index}`}
              >
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-destructive/10" data-testid="emergency-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Emergency Contacts</h2>
            <p className="text-xl text-muted-foreground">Quick access to emergency services</p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.a
                key={index}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${contact.color} p-6 rounded-xl text-center transition-all cursor-pointer ${
                  contact.pulse ? 'animate-pulse-alert' : ''
                }`}
                data-testid={`link-emergency-${contact.number}`}
              >
                <contact.icon className="mx-auto mb-3 h-8 w-8" />
                <div className="text-xl font-bold">{contact.number}</div>
                <div className="text-sm">{contact.service}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Health Management</h2>
            <p className="text-xl text-muted-foreground">Everything you need for your health journey</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="kerala-card p-6"
                data-testid={`card-feature-${index}`}
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className={`h-6 w-6 text-primary-foreground`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-muted/50" data-testid="testimonial-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="kerala-card p-8"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Quote className="h-8 w-8 text-primary-foreground" />
            </div>
            <blockquote className="text-xl text-foreground mb-6">
              "This system made it easy to keep my medical records safe while working away from home. 
              Now I can show my vaccination status and health history to any doctor instantly."
            </blockquote>
            <div className="text-muted-foreground">
              <strong>Ramesh Kumar</strong> — Construction Worker from Bihar
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                  <span className="text-primary-foreground font-bold text-xs">KL</span>
                </div>
                <span className="text-lg font-semibold text-primary">SwasthSetu</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Powered by Government of Kerala<br />
                Supporting UN SDG-3
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Ambulance: <a href="tel:108" className="text-destructive font-medium">108</a></li>
                <li>Police: <a href="tel:100" className="text-primary font-medium">100</a></li>
                <li>Health Helpline: <a href="tel:104" className="text-primary font-medium">104</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Government of Kerala. All rights reserved. | Built for migrant worker welfare.
          </div>
        </div>
      </footer>

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
