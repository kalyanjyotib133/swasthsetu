import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Syringe, AlertTriangle } from "lucide-react";

export default function SummaryCards() {
  const { profile } = useAuth();

  const { data: healthSummary } = useQuery({
    queryKey: ["/api/health/summary", profile?.id],
  });

  const { data: vaccinationStatus } = useQuery({
    queryKey: ["/api/vaccinations/status", profile?.id],
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts", profile?.id],
  });

  const urgentAlerts = alerts?.filter((alert: any) => alert.urgency === 'high') || [];
  const vaccinationProgress = vaccinationStatus?.completionPercentage || 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8 slide-in">
      {/* Health Record Summary Card */}
      <Card className="hover:shadow-lg transition-shadow bounce-hover">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-health-summary-title">
                Health Record Summary
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div data-testid="text-patient-name">Name: {profile?.fullName}</div>
                <div data-testid="text-patient-details">
                  Age: {profile?.age} | {profile?.gender} | {profile?.bloodGroup || 'Unknown'}
                </div>
                <div data-testid="text-allergies">Allergies: {profile?.allergies || 'None reported'}</div>
                <div data-testid="text-last-checkup">
                  Last Checkup: {healthSummary?.lastVisit || '15 Sept 2024'}
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <User className="text-muted-foreground h-8 w-8" />
              )}
            </div>
          </div>
          <Button className="w-full" data-testid="button-view-details">
            View Details
          </Button>
        </CardContent>
      </Card>

      {/* Vaccination Status Card */}
      <Card className="hover:shadow-lg transition-shadow bounce-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground" data-testid="text-vaccination-title">
              Vaccination Status
            </h3>
            <Syringe className="text-primary h-6 w-6" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium" data-testid="text-vaccination-percentage">
                {vaccinationProgress}%
              </span>
            </div>
            <Progress value={vaccinationProgress} className="h-2" data-testid="progress-vaccination" />
          </div>
          <div className="text-sm text-muted-foreground mb-4" data-testid="text-next-vaccine">
            Next: {vaccinationStatus?.nextVaccine || 'Flu Shot - 28 Sept 2024'}
          </div>
          <Button variant="secondary" className="w-full" data-testid="button-book-appointment">
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      {/* Alerts & Risk Level Card */}
      <Card className="hover:shadow-lg transition-shadow bounce-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground" data-testid="text-alerts-title">
              Alerts & Risk Level
            </h3>
            <div 
              className={`w-3 h-3 rounded-full pulse-alert ${
                urgentAlerts.length > 0 ? 'bg-red-500' : 'bg-green-500'
              }`}
              data-testid="status-risk-indicator"
            />
          </div>
          
          {urgentAlerts.length > 0 ? (
            <div className="alert-yellow rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertTriangle className="text-yellow-600 mr-2 h-4 w-4" />
                <span className="text-sm font-medium" data-testid="text-urgent-alert">
                  {urgentAlerts[0].title}
                </span>
              </div>
            </div>
          ) : (
            <div className="alert-green rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium" data-testid="text-no-alerts">
                  All clear - No urgent alerts
                </span>
              </div>
            </div>
          )}
          
          <Button 
            variant={urgentAlerts.length > 0 ? "destructive" : "outline"} 
            className="w-full"
            data-testid="button-manage-alerts"
          >
            {urgentAlerts.length > 0 ? 'Schedule Screening' : 'View Health Status'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
