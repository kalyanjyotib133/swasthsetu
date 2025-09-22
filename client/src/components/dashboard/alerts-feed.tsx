import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  AlertCircle
} from "lucide-react";
import type { Alert } from "@/types/health";

export default function AlertsFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    queryFn: async () => {
      const response = await fetch("/api/alerts", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json() as Promise<Alert[]>;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest("PUT", `/api/alerts/${alertId}/read`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been acknowledged.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to mark alert as read",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (alertId: string) => {
    markAsReadMutation.mutate(alertId);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return AlertTriangle;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
      default:
        return Info;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case "urgent":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          subtext: "text-red-600",
          dot: "bg-red-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          subtext: "text-yellow-600",
          dot: "bg-yellow-500"
        };
      case "info":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          subtext: "text-green-600",
          dot: "bg-green-500"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          subtext: "text-gray-600",
          dot: "bg-gray-500"
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="kerala-card mb-8">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-6 w-48"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start p-4 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2 mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="kerala-card mb-8" data-testid="alerts-feed">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Alerts & Notifications</h3>
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts at this time</p>
            <p className="text-sm text-muted-foreground mt-2">You're all caught up!</p>
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
      <Card className="kerala-card mb-8" data-testid="alerts-feed">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Alerts & Notifications</h3>
            <Badge variant="secondary" className="text-xs">
              {alerts.filter(alert => !alert.isRead).length} unread
            </Badge>
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const colors = getAlertColors(alert.type);
              const IconComponent = getAlertIcon(alert.type);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex items-start p-4 ${colors.bg} border ${colors.border} rounded-lg ${
                    !alert.isRead ? 'shadow-sm' : 'opacity-75'
                  }`}
                  data-testid={`alert-${alert.id}`}
                >
                  <div className={`flex-shrink-0 w-2 h-2 ${colors.dot} rounded-full mt-2 mr-3 ${
                    !alert.isRead ? 'animate-pulse-alert' : ''
                  }`}></div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${colors.text} flex items-center gap-2`}>
                      <IconComponent className="h-4 w-4" />
                      {alert.title}
                      {!alert.isRead && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className={`text-sm ${colors.subtext} mt-1`}>
                      {alert.message}
                    </div>
                    <div className={`text-xs ${colors.subtext} mt-2 flex items-center gap-1`}>
                      <Clock className="h-3 w-3" />
                      {new Date(alert.createdAt).toLocaleString()}
                      {alert.region && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{alert.region}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(alert.id)}
                        disabled={markAsReadMutation.isPending}
                        className={`text-xs ${colors.subtext} hover:${colors.text}`}
                        data-testid={`button-acknowledge-${alert.id}`}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-xs ${colors.subtext} hover:${colors.text}`}
                      data-testid={`button-details-${alert.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
