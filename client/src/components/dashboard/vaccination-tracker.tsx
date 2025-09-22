import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import VaccinationModal from "@/components/modals/vaccination-modal";
import { CheckCircle, Calendar, Syringe } from "lucide-react";
import type { Vaccination } from "@/types/health";

export default function VaccinationTracker() {
  const [showModal, setShowModal] = useState(false);

  const { data: vaccinations, isLoading } = useQuery({
    queryKey: ["/api/vaccinations"],
    queryFn: async () => {
      const response = await fetch("/api/vaccinations", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch vaccinations");
      return response.json() as Promise<Vaccination[]>;
    },
  });

  if (isLoading) {
    return (
      <Card className="kerala-card mb-8">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-4 w-48"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-2 bg-muted rounded mb-4"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedVaccinations = vaccinations?.filter(v => v.status === "completed") || [];
  const scheduledVaccinations = vaccinations?.filter(v => v.status === "scheduled") || [];
  const pendingVaccinations = vaccinations?.filter(v => v.status === "pending") || [];
  
  const totalVaccinations = 4; // Expected total vaccinations
  const progress = (completedVaccinations.length / totalVaccinations) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="kerala-card mb-8" data-testid="vaccination-tracker">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Vaccination Tracker</h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-foreground font-medium">
                  {completedVaccinations.length} of {totalVaccinations} completed
                </span>
              </div>
              <Progress value={progress} className="h-3 progress-bar" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Completed Vaccinations</h4>
                {completedVaccinations.length > 0 ? (
                  <div className="space-y-2">
                    {completedVaccinations.map((vaccination) => (
                      <motion.div
                        key={vaccination.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center text-sm"
                        data-testid={`vaccination-completed-${vaccination.id}`}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>
                          {vaccination.vaccineName} - {" "}
                          {vaccination.completedDate ? 
                            new Date(vaccination.completedDate).toLocaleDateString() : 
                            "Date not available"
                          }
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No completed vaccinations yet</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Upcoming Vaccinations</h4>
                {scheduledVaccinations.length > 0 || pendingVaccinations.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledVaccinations.map((vaccination) => (
                      <motion.div
                        key={vaccination.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-accent/10 border border-accent/20 rounded-lg p-3"
                        data-testid={`vaccination-scheduled-${vaccination.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">{vaccination.vaccineName}</div>
                            <div className="text-sm text-muted-foreground">
                              Due: {vaccination.scheduledDate ? 
                                new Date(vaccination.scheduledDate).toLocaleDateString() : 
                                "Date TBD"
                              }
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setShowModal(true)}
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            data-testid="button-book-vaccination"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {pendingVaccinations.map((vaccination) => (
                      <motion.div
                        key={vaccination.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                        data-testid={`vaccination-pending-${vaccination.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">{vaccination.vaccineName}</div>
                            <div className="text-sm text-yellow-600">Pending scheduling</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setShowModal(true)}
                            className="bg-yellow-500 text-white hover:bg-yellow-600"
                            data-testid="button-schedule-vaccination"
                          >
                            <Syringe className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming vaccinations</p>
                    <Button
                      size="sm"
                      onClick={() => setShowModal(true)}
                      className="mt-2 kerala-button-primary"
                      data-testid="button-add-vaccination"
                    >
                      Add Vaccination
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <VaccinationModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
