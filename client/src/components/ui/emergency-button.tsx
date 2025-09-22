import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Phone, 
  MapPin,
  Ambulance,
  ShieldAlert,
  Flame,
  Heart
} from "lucide-react";

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const emergencyContacts = [
    {
      number: "108",
      service: "Ambulance",
      icon: Ambulance,
      color: "bg-red-600 hover:bg-red-700 text-white",
      priority: "urgent"
    },
    {
      number: "100",
      service: "Police",
      icon: ShieldAlert,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      priority: "urgent"
    },
    {
      number: "101",
      service: "Fire",
      icon: Flame,
      color: "bg-orange-600 hover:bg-orange-700 text-white",
      priority: "urgent"
    },
    {
      number: "104",
      service: "Health Helpline",
      icon: Heart,
      color: "bg-green-600 hover:bg-green-700 text-white",
      priority: "normal"
    }
  ];

  const handleEmergencyClick = () => {
    setShowModal(true);
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleCall = (number: string, service: string) => {
    // In a real emergency, this would initiate the call
    window.open(`tel:${number}`);
    
    // For demonstration, show confirmation
    alert(`Calling ${service} (${number})\n\nLocation: ${
      userLocation 
        ? `Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}`
        : "Location not available"
    }`);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-30"
      >
        <Button
          onClick={handleEmergencyClick}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse-alert"
          data-testid="button-emergency"
        >
          <AlertTriangle className="h-8 w-8" />
        </Button>
      </motion.div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md" data-testid="modal-emergency">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Emergency Contacts
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Location Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">Location Status:</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {isLocating ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <MapPin className="h-3 w-3" />
                    </motion.div>
                    Getting your location...
                  </span>
                ) : userLocation ? (
                  `Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}`
                ) : (
                  "Location not available"
                )}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={contact.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleCall(contact.number, contact.service)}
                    className={`w-full h-20 flex flex-col items-center justify-center ${contact.color} rounded-lg`}
                    data-testid={`button-call-${contact.number}`}
                  >
                    <contact.icon className="h-6 w-6 mb-1" />
                    <div className="text-lg font-bold">{contact.number}</div>
                    <div className="text-xs">{contact.service}</div>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Emergency Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium text-yellow-800 mb-2">Emergency Tips:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Stay calm and speak clearly</li>
                <li>• Provide your exact location</li>
                <li>• Describe the emergency clearly</li>
                <li>• Follow the operator's instructions</li>
              </ul>
            </div>

            {/* Quick Location Share */}
            {userLocation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Share Location:</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Emergency Location',
                        text: 'I need help at this location:',
                        url: mapsUrl
                      });
                    } else {
                      navigator.clipboard.writeText(mapsUrl);
                      alert('Location URL copied to clipboard');
                    }
                  }}
                  className="w-full"
                  data-testid="button-share-location"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Share My Location
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
