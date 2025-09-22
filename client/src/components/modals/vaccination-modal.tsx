import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Syringe, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const vaccinationSchema = z.object({
  vaccineName: z.string().min(1, "Please select a vaccination"),
  scheduledDate: z.date({
    required_error: "Please select a date",
  }),
  facilityName: z.string().min(1, "Please select a health center"),
});

type VaccinationForm = z.infer<typeof vaccinationSchema>;

interface VaccinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableVaccines = [
  "Flu Shot",
  "Hepatitis A",
  "Hepatitis B", 
  "Typhoid",
  "Tetanus",
  "COVID-19 Booster",
  "Meningitis",
  "Japanese Encephalitis"
];

export default function VaccinationModal({ open, onOpenChange }: VaccinationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clinics } = useQuery({
    queryKey: ["/api/clinics"],
    queryFn: async () => {
      const response = await fetch("/api/clinics");
      if (!response.ok) throw new Error("Failed to fetch clinics");
      return response.json();
    },
    enabled: open,
  });

  const form = useForm<VaccinationForm>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      vaccineName: "",
      scheduledDate: undefined,
      facilityName: "",
    },
  });

  const createVaccinationMutation = useMutation({
    mutationFn: async (data: VaccinationForm) => {
      const response = await apiRequest("POST", "/api/vaccinations", {
        ...data,
        status: "scheduled",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccinations"] });
      toast({
        title: "Vaccination Scheduled",
        description: "Your vaccination appointment has been successfully scheduled.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to schedule vaccination",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: VaccinationForm) => {
    setIsSubmitting(true);
    try {
      await createVaccinationMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-lg" data-testid="modal-vaccination">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Book Vaccination
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="vaccineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaccination Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-vaccination-type">
                          <SelectValue placeholder="Select vaccination type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableVaccines.map((vaccine) => (
                          <SelectItem key={vaccine} value={vaccine}>
                            {vaccine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-select-date"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facilityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Center</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-health-center">
                          <SelectValue placeholder="Select health center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clinics?.map((clinic: any) => (
                          <SelectItem key={clinic.id} value={clinic.name}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{clinic.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {clinic.distance || "Distance unknown"}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        )) || [
                          <SelectItem key="loading" value="" disabled>
                            Loading clinics...
                          </SelectItem>
                        ]}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Please arrive 15 minutes before your appointment</li>
                <li>• Bring a valid ID and your health card</li>
                <li>• Inform staff of any allergies or medical conditions</li>
                <li>• You'll receive a confirmation SMS with appointment details</li>
              </ul>
            </motion.div>

            <Button
              type="submit"
              className="w-full kerala-button-primary"
              disabled={isSubmitting || createVaccinationMutation.isPending}
              data-testid="button-confirm-appointment"
            >
              {isSubmitting || createVaccinationMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Syringe className="h-4 w-4" />
                </motion.div>
              ) : (
                <CalendarIcon className="h-4 w-4 mr-2" />
              )}
              {isSubmitting || createVaccinationMutation.isPending
                ? "Scheduling..."
                : "Confirm Appointment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
