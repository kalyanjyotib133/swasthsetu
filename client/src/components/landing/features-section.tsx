import { Card, CardContent } from "@/components/ui/card";
import { FileText, Syringe, MapPin, Languages, Lock, QrCode } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Centralized Health Records",
      description: "All your medical history in one secure digital wallet",
    },
    {
      icon: Syringe,
      title: "Vaccination Tracking", 
      description: "Never miss a vaccine with smart reminders and scheduling",
    },
    {
      icon: MapPin,
      title: "Nearby Clinics Map",
      description: "Find healthcare facilities wherever you are working",
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Available in Malayalam, Hindi, Tamil, and English",
    },
    {
      icon: Lock,
      title: "Data Privacy & Security",
      description: "Bank-level encryption keeps your health data safe",
    },
    {
      icon: QrCode,
      title: "QR Health Card",
      description: "Instant access to your health profile anywhere",
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-features-title">
            Comprehensive Health Management
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-features-subtitle">
            Everything you need for your health journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow bounce-hover"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="text-primary-foreground h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
