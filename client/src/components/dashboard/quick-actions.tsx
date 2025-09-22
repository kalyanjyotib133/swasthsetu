import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VaccinationModal from "@/components/modals/vaccination-modal";
import { 
  CalendarPlus, 
  Download, 
  UserPen,
  Plus,
  Minus
} from "lucide-react";

export default function QuickActions() {
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleDownloadHealthCard = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Health Card Download",
      description: "Your health card is being prepared for download.",
    });
  };

  const handleUpdateProfile = () => {
    // In a real implementation, this would open a profile update modal
    toast({
      title: "Profile Update",
      description: "Profile update feature coming soon.",
    });
  };

  const actions = [
    {
      id: "book-checkup",
      icon: CalendarPlus,
      title: "Book Checkup",
      color: "bg-primary text-primary-foreground hover:bg-primary/90",
      onClick: () => setShowVaccinationModal(true),
      testId: "button-book-checkup"
    },
    {
      id: "download-card",
      icon: Download,
      title: "Download Health Card",
      color: "bg-accent text-accent-foreground hover:bg-accent/90",
      onClick: handleDownloadHealthCard,
      testId: "button-download-card"
    },
    {
      id: "update-profile",
      icon: UserPen,
      title: "Update Profile",
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      onClick: handleUpdateProfile,
      testId: "button-update-profile"
    }
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-30" data-testid="quick-actions">
        {/* Expand/Collapse Button */}
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90"
            data-testid="button-expand-actions"
          >
            {isExpanded ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            scale: isExpanded ? 1 : 0.8,
            y: isExpanded ? 0 : 20
          }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
          className="flex flex-col gap-3"
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                scale: isExpanded ? 1 : 0.8,
                y: isExpanded ? 0 : 20
              }}
              transition={{ 
                duration: 0.3, 
                delay: isExpanded ? index * 0.1 : 0,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <Button
                onClick={action.onClick}
                className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 ${action.color}`}
                title={action.title}
                data-testid={action.testId}
              >
                <action.icon className="h-6 w-6" />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Labels (show on hover or when expanded) */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute right-16 bottom-0 flex flex-col gap-3 pointer-events-none"
          >
            {actions.map((action, index) => (
              <div
                key={`label-${action.id}`}
                className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm font-medium whitespace-nowrap"
                style={{ 
                  transform: `translateY(${-60 - (index * 68)}px)` 
                }}
              >
                {action.title}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Backdrop blur when expanded */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <VaccinationModal 
        open={showVaccinationModal} 
        onOpenChange={setShowVaccinationModal} 
      />
    </>
  );
}
