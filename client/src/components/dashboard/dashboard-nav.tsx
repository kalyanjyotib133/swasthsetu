import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, QrCode, Languages, Settings, LogOut, User } from "lucide-react";
import QRModal from "@/components/modals/qr-modal";

export default function DashboardNav() {
  const { user, profile, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate("/")}
                className="flex-shrink-0 cursor-pointer"
                data-testid="button-home-logo"
              >
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">KL</span>
                </div>
              </button>
              <div className="ml-3">
                <span className="text-xl font-semibold text-primary">SwasthSetu</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-foreground" data-testid="text-user-greeting">
                Hi, {profile?.fullName?.split(' ')[0] || user?.username} 👋
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRModal(true)}
                title="QR Health Card"
                data-testid="button-qr-card"
              >
                <QrCode className="h-4 w-4" />
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                  data-testid="button-notifications"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-destructive">
                    3
                  </Badge>
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 hover:bg-muted/50 border-b border-border">
                        <div className="text-sm font-medium text-destructive">Dengue Alert</div>
                        <div className="text-xs text-muted-foreground">High cases near your area</div>
                      </div>
                      <div className="p-3 hover:bg-muted/50 border-b border-border">
                        <div className="text-sm font-medium text-yellow-600">TB Screening Due</div>
                        <div className="text-xs text-muted-foreground">Schedule your annual screening</div>
                      </div>
                      <div className="p-3 hover:bg-muted/50">
                        <div className="text-sm font-medium text-green-600">Profile Updated</div>
                        <div className="text-xs text-muted-foreground">Your health records were updated</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-profile-menu">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      {profile?.profileImage ? (
                        <img src={profile.profileImage} alt="Profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-primary-foreground text-sm font-medium">
                          {profile?.fullName?.[0] || user?.username?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem data-testid="menu-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-language">
                    <Languages className="mr-2 h-4 w-4" />
                    Language
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
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
      </nav>
      
      <QRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
        healthId={profile?.healthId || ""}
      />
    </>
  );
}
