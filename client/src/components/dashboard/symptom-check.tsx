import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, MapPin } from "lucide-react";

const symptomSchema = z.object({
  fever: z.boolean(),
  cough: z.boolean(),
  fatigue: z.boolean(),
});

type SymptomForm = z.infer<typeof symptomSchema>;

export default function SymptomCheck() {
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<SymptomForm>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      fever: false,
      cough: false,
      fatigue: false,
    },
  });

  const checkSymptomsMutation = useMutation({
    mutationFn: async (data: SymptomForm) => {
      const response = await apiRequest("POST", "/api/symptoms/check", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Risk assessment complete",
        description: `Risk level: ${data.riskLevel}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assessment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SymptomForm) => {
    checkSymptomsMutation.mutate(data);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "green";
      case "medium": return "yellow";
      case "high": return "red";
      default: return "gray";
    }
  };

  return (
    <Card className="kerala-card mb-8" data-testid="symptom-check">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Symptom Self-Check</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="fever"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-3">Fever</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? "yes" : "no"}
                        onValueChange={(value) => field.onChange(value === "yes")}
                        data-testid="radio-fever"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="fever-yes" />
                          <Label htmlFor="fever-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="fever-no" />
                          <Label htmlFor="fever-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cough"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-3">Cough</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? "yes" : "no"}
                        onValueChange={(value) => field.onChange(value === "yes")}
                        data-testid="radio-cough"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="cough-yes" />
                          <Label htmlFor="cough-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="cough-no" />
                          <Label htmlFor="cough-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatigue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-3">Fatigue</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? "yes" : "no"}
                        onValueChange={(value) => field.onChange(value === "yes")}
                        data-testid="radio-fatigue"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="fatigue-yes" />
                          <Label htmlFor="fatigue-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="fatigue-no" />
                          <Label htmlFor="fatigue-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                className="kerala-button-primary"
                disabled={checkSymptomsMutation.isPending}
                data-testid="button-check-risk"
              >
                {checkSymptomsMutation.isPending ? "Checking..." : "Check My Risk"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                data-testid="button-locate-clinic"
              >
                <MapPin className="h-4 w-4" />
                Locate Nearby Clinic
              </Button>
            </div>
          </form>
        </Form>

        {/* Risk Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 p-4 rounded-lg border ${
                result.riskLevel === "low"
                  ? "bg-green-50 border-green-200"
                  : result.riskLevel === "medium"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-red-50 border-red-200"
              }`}
              data-testid="result-risk"
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    result.riskLevel === "low"
                      ? "bg-green-500"
                      : result.riskLevel === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {result.riskLevel === "low" ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <div
                    className={`font-medium capitalize ${
                      result.riskLevel === "low"
                        ? "text-green-800"
                        : result.riskLevel === "medium"
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {result.riskLevel} Risk
                  </div>
                  <div
                    className={`text-sm ${
                      result.riskLevel === "low"
                        ? "text-green-600"
                        : result.riskLevel === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.recommendation}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
