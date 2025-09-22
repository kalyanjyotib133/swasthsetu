import { Button } from "@/components/ui/button";
import { Ambulance, Shield, Flame, Phone } from "lucide-react";

export default function EmergencySection() {
  const emergencyContacts = [
    {
      number: "108",
      service: "Ambulance",
      icon: Ambulance,
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 pulse-alert",
    },
    {
      number: "100", 
      service: "Police",
      icon: Shield,
      className: "bg-card border border-border hover:shadow-lg text-foreground",
    },
    {
      number: "101",
      service: "Fire",
      icon: Flame,
      className: "bg-card border border-border hover:shadow-lg text-foreground",
    },
    {
      number: "104",
      service: "Health Helpline", 
      icon: Phone,
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
  ];

  return (
    <section className="py-16 bg-destructive/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-emergency-title">
            Emergency Contacts
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-emergency-subtitle">
            Quick access to emergency services
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyContacts.map((contact) => {
            const IconComponent = contact.icon;
            return (
              <Button
                key={contact.number}
                asChild
                className={`p-6 h-auto flex-col space-y-3 ${contact.className}`}
                data-testid={`button-emergency-${contact.number}`}
              >
                <a href={`tel:${contact.number}`}>
                  <IconComponent className="h-8 w-8" />
                  <div className="text-xl font-bold">{contact.number}</div>
                  <div className="text-sm">{contact.service}</div>
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
