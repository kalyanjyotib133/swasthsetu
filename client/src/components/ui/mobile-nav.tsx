import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import QRModal from "@/components/modals/qr-modal";
import { 
  Home, 
  FileText, 
  QrCode, 
  Bell, 
  User,
  Calendar,
  MapPin
} from "lucide-react";

export default function MobileNav() {
  const [location, setLocation] = useLocation();
  const [showQRModal, setShowQRModal] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
      active: location === "/dashboard"
    },
    {
      id: "records",
      label: "Records",
      icon: FileText,
      path: "/dashboard", // Could be a separate records page
      active: false
    },
    {
      id: "qr",
      label: "QR Code",
      icon: QrCode,
      action: () => setShowQRModal(true),
      active: false
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: Bell,
      path: "/dashboard", // Could be a separate alerts page
      badge: 3,
      active: false
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/dashboard", // Could be a separate profile page
      active: false
    }
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      setLocation(item.path);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40 safe-area-bottom" data-testid="mobile-nav">
        <div className="flex justify-around py-2 px-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center py-3 px-2 min-w-0 relative touch-manipulation min-h-[60px] ${
                item.active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ touchAction: 'manipulation' }}
              data-testid={`nav-${item.id}`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5 mb-1" />
                {item.badge && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs"
                    data-testid={`badge-${item.id}`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <QRModal open={showQRModal} onOpenChange={setShowQRModal} />
    </>
  );
}
