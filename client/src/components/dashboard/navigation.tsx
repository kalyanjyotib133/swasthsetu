import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import QRModal from "@/components/modals/qr-modal";
import { QrCode, Bell, ChevronDown, Settings, Globe, LogOut, User } from "lucide-react";

export default function DashboardNavigation() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <nav className="bg-card/90 backdrop-blur-md border-b border-border/50 sticky top-0 z-40" data-testid="navigation-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div
              className="flex-shrink-0 cursor-pointer group"
              onClick={handleGoHome}
              data-testid="button-home"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-sm">KL</span>
              </div>
            </div>
            <div className="ml-3">
              <span className="text-xl font-semibold text-primary kerala-gradient bg-clip-text text-transparent">SwasthSetu</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-foreground font-medium" data-testid="text-greeting">
              Hi, {user?.username || "User"} 👋
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQRModal(true)}
              title="QR Health Card"
              data-testid="button-qr"
              className="hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            >
              <QrCode className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="relative hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs animate-pulse">
                3
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                  data-testid="button-profile"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-testid="menu-profile">
                <DropdownMenuItem data-testid="menu-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-language">
                  <Globe className="mr-2 h-4 w-4" />
                  Language
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <QRModal open={showQRModal} onOpenChange={setShowQRModal} />
    </nav>
  );
}
