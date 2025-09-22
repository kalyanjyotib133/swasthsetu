import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone,
  Hospital,
  Stethoscope
} from "lucide-react";
import type { Clinic } from "@/types/health";

export default function NearbyClinics() {
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);

  const { data: clinics, isLoading } = useQuery({
    queryKey: ["/api/clinics"],
    queryFn: async () => {
      const response = await fetch("/api/clinics");
      if (!response.ok) throw new Error("Failed to fetch clinics");
      return response.json() as Promise<Clinic[]>;
    },
  });

  const handleGetDirections = (clinic: Clinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="kerala-card mb-8">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-6 w-48"></div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="w-full h-64 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-1 w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="kerala-card mb-8" data-testid="nearby-clinics">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Nearby Clinics</h3>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Map placeholder with clinic markers */}
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Background map pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20"></div>
                </div>
                
                {/* Location indicator */}
                <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-2 shadow-lg z-10">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Your Location
                  </div>
                  <div className="text-xs text-muted-foreground">Kochi, Ernakulam</div>
                </div>
                
                {/* Clinic markers */}
                {clinics?.slice(0, 3).map((clinic, index) => (
                  <motion.button
                    key={clinic.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedClinic(selectedClinic === clinic.id ? null : clinic.id)}
                    className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      index === 0 ? 'top-1/3 left-1/3 bg-primary' :
                      index === 1 ? 'top-1/2 right-1/3 bg-accent' :
                      'bottom-1/3 left-1/2 bg-primary'
                    } ${selectedClinic === clinic.id ? 'ring-4 ring-white ring-opacity-50' : ''}`}
                    title={clinic.name}
                    data-testid={`marker-clinic-${clinic.id}`}
                  >
                    <Hospital className="h-3 w-3 text-white" />
                  </motion.button>
                ))}
                
                {/* Center map icon */}
                <MapPin className="h-16 w-16 text-muted-foreground" />
              </div>
              
              {/* Selected clinic info */}
              {selectedClinic && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg"
                >
                  {clinics?.find(c => c.id === selectedClinic) && (
                    <div>
                      <h4 className="font-medium text-foreground">
                        {clinics.find(c => c.id === selectedClinic)?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {clinics.find(c => c.id === selectedClinic)?.address}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleGetDirections(clinics.find(c => c.id === selectedClinic)!)}
                          className="kerala-button-primary"
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        {clinics.find(c => c.id === selectedClinic)?.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`tel:${clinics.find(c => c.id === selectedClinic)?.phone}`)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
            <div className="space-y-4">
              {clinics?.length ? (
                clinics.map((clinic, index) => (
                  <motion.div
                    key={clinic.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border border-border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedClinic === clinic.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedClinic(selectedClinic === clinic.id ? null : clinic.id)}
                    data-testid={`clinic-card-${clinic.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{clinic.name}</h4>
                      <Stethoscope className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{clinic.distance || "Distance unknown"}</span>
                      </div>
                      
                      {clinic.hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Open: {clinic.hours}</span>
                        </div>
                      )}
                      
                      {clinic.services && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Services: {Array.isArray(clinic.services) ? clinic.services.join(", ") : clinic.services}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(clinic);
                        }}
                        className="flex-1 kerala-button-primary text-xs"
                        data-testid={`button-directions-${clinic.id}`}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                      
                      {clinic.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${clinic.phone}`);
                          }}
                          className="text-xs"
                          data-testid={`button-call-${clinic.id}`}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Hospital className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No clinics found in your area</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
