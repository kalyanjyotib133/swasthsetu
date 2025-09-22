import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Download, Share, X } from "lucide-react";

interface QRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QRModal({ open, onOpenChange }: QRModalProps) {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/migrant/profile"],
    queryFn: async () => {
      const response = await fetch("/api/migrant/profile", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: open, // Only fetch when modal is open
  });

  const handleDownloadQR = () => {
    // In a real implementation, this would generate and download the QR code
    toast({
      title: "QR Code Download",
      description: "Your health QR code is being prepared for download.",
    });
  };

  const handleShareQR = () => {
    // In a real implementation, this would open share options
    if (navigator.share) {
      navigator.share({
        title: 'My Health QR Code',
        text: `Health ID: ${profile?.healthId}`,
        url: window.location.origin
      });
    } else {
      toast({
        title: "Share Feature",
        description: "Share functionality not available on this device.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-qr">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            My Health QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="text-center p-4">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="w-48 h-48 bg-muted rounded-lg mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* QR Code Container */}
              <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-primary/30">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">QR Code</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {profile?.healthId || "Loading..."}
                  </p>
                </div>
              </div>

              {/* Health ID Info */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Scan this QR code for instant access to your health profile
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Health ID</p>
                  <p className="font-mono font-semibold text-foreground">
                    {profile?.healthId || "Loading..."}
                  </p>
                </div>
              </div>

              {/* Profile Summary */}
              {profile && (
                <div className="text-left bg-card border border-border rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-foreground mb-2">Profile Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <br />
                      <span className="font-medium">{profile.fullName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <br />
                      <span className="font-medium">{profile.age}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood Group:</span>
                      <br />
                      <span className="font-medium">{profile.bloodGroup || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <br />
                      <span className="font-medium">{profile.currentLocation || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadQR}
                  className="flex-1 kerala-button-primary"
                  data-testid="button-download-qr"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
                <Button
                  onClick={handleShareQR}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-share-qr"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Show this QR code to healthcare providers for quick access to your medical history.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
