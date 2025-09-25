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
import {
  QrCode,
  Bell,
  ChevronDown,
  Settings,
  Globe,
  LogOut,
  User,
  MapPin,
  Shield,
  Phone,
  MessageCircle
} from "lucide-react";

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

  const mockNotifications = [
    { id: 1, type: "appointment", title: "Upcoming Appointment", message: "Cardiology checkup tomorrow at 10:30 AM", time: "2 hours ago" },
    { id: 2, type: "health", title: "Health Alert", message: "Your BP reading is higher than normal", time: "4 hours ago" },
    { id: 3, type: "vaccination", title: "Vaccination Due", message: "Flu shot due in 2 weeks", time: "1 day ago" }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500/20 sticky top-0 z-40 shadow-lg" data-testid="navigation-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left Section - Logo and User Info */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div
              className="flex-shrink-0 cursor-pointer group"
              onClick={handleGoHome}
              data-testid="button-home"
            >
              <img
                src="/swasthsetu-logo.png"
                alt="SwasthSetu Logo"
                className="h-10 sm:h-12 lg:h-16 w-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
            </div>

            {/* Mobile: Show only essential info */}
            <div className="flex flex-col text-white min-w-0 flex-1 lg:flex-initial">
              <span className="text-sm sm:text-lg lg:text-2xl font-bold tracking-tight truncate" data-testid="text-greeting">
                <span className="block sm:hidden">Hi!</span>
                <span className="hidden sm:block">Good Morning!</span>
              </span>
              <div className="hidden lg:flex items-center space-x-2 text-blue-100">
                <span className="font-medium">📍 Mumbai → Delhi</span>
                <span className="text-blue-200">•</span>
                <span className="font-medium">Migrant ID: MH2024001</span>
                <span className="text-blue-200">•</span>
                <span className="font-medium">Profile: 87% Complete</span>
              </div>
              {/* Mobile: Show condensed info */}
              <div className="flex lg:hidden items-center space-x-1 text-xs sm:text-sm text-blue-100">
                <span className="font-medium truncate">📍 Delhi</span>
                <span className="text-blue-200 hidden sm:inline">•</span>
                <span className="font-medium truncate sm:inline">87% Complete</span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* QR Code Button - Essential */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQRModal(true)}
              title="QR Health Card"
              data-testid="button-qr"
              className="hover:bg-white/20 transition-all duration-300 hover:scale-110 text-white touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Notifications - Essential */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/20 transition-all duration-300 hover:scale-110 text-white touch-manipulation"
                  data-testid="button-notifications"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-xs animate-pulse font-bold">
                    {mockNotifications.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0" data-testid="menu-notifications">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Stay updated with your health</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex-col items-start p-4 cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center space-x-2 w-full">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.type === 'appointment' ? 'bg-blue-500' :
                          notification.type === 'health' ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                        <span className="font-medium text-sm">{notification.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" className="w-full justify-center text-sm">
                    Mark all as read
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown - Essential (simplified for mobile) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 sm:space-x-3 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-white p-1 sm:p-2 touch-manipulation"
                  data-testid="button-profile"
                  style={{ minHeight: '44px' }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                      <span className="text-white font-bold text-sm sm:text-lg">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  {/* Hide text on small screens */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="font-semibold text-sm">{user?.username || "User"}</span>
                    <span className="text-xs text-blue-100">Rahul Kumar</span>
                  </div>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-testid="menu-profile">
                <DropdownMenuItem data-testid="menu-profile-details">
                  <User className="mr-2 h-4 w-4" />
                  Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-health-id">
                  <Shield className="mr-2 h-4 w-4" />
                  Health ID Card
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-emergency">
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency Contacts
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-help">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-privacy">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout" className="text-red-600">
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
