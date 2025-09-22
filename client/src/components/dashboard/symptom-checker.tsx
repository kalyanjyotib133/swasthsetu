import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { analyzeSymptoms } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    fatigue: false,
  });
  const [result, setResult] = useState<{
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string;
    shouldSeekCare: boolean;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSymptomChange = (symptom: string, value: boolean) => {
    setSymptoms(prev => ({ ...prev, [symptom]: value }));
    setResult(null); // Clear previous result
  };

  const handleCheckRisk = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeSymptoms(symptoms);
      setResult(analysis);
      
      toast({
        title: "Symptom Analysis Complete",
        description: `Risk Level: ${analysis.riskLevel.toUpperCase()}`,
        variant: analysis.riskLevel === 'high' ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'alert-red';
      case 'medium': return 'alert-yellow';
      default: return 'alert-green';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'medium': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      default: return <CheckCircle2 className="h-6 w-6 text-green-600" />;
    }
  };

  return (
    <Card className="mb-8 slide-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6" data-testid="text-symptom-checker-title">
          Symptom Self-Check
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Fever</Label>
            <RadioGroup
              value={symptoms.fever.toString()}
              onValueChange={(value) => handleSymptomChange('fever', value === 'true')}
              className="flex space-x-4"
              data-testid="radio-fever"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="fever-yes" />
                <Label htmlFor="fever-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="fever-no" />
                <Label htmlFor="fever-no" className="text-sm">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Cough</Label>
            <RadioGroup
              value={symptoms.cough.toString()}
              onValueChange={(value) => handleSymptomChange('cough', value === 'true')}
              className="flex space-x-4"
              data-testid="radio-cough"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="cough-yes" />
                <Label htmlFor="cough-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="cough-no" />
                <Label htmlFor="cough-no" className="text-sm">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Fatigue</Label>
            <RadioGroup
              value={symptoms.fatigue.toString()}
              onValueChange={(value) => handleSymptomChange('fatigue', value === 'true')}
              className="flex space-x-4"
              data-testid="radio-fatigue"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="fatigue-yes" />
                <Label htmlFor="fatigue-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="fatigue-no" />
                <Label htmlFor="fatigue-no" className="text-sm">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button 
            onClick={handleCheckRisk} 
            disabled={isAnalyzing}
            data-testid="button-check-risk"
          >
            {isAnalyzing ? "Analyzing..." : "Check My Risk"}
          </Button>
          <Button variant="outline" data-testid="button-locate-clinic">
            <MapPin className="mr-2 h-4 w-4" />
            Locate Nearby Clinic
          </Button>
        </div>
        
        {result && (
          <div className={`p-4 rounded-lg border fade-in ${getRiskColor(result.riskLevel)}`} data-testid="result-risk-analysis">
            <div className="flex items-center mb-2">
              {getRiskIcon(result.riskLevel)}
              <div className="ml-3">
                <div className="font-medium capitalize" data-testid="text-risk-level">
                  {result.riskLevel} Risk
                </div>
                <div className="text-sm mt-1" data-testid="text-recommendations">
                  {result.recommendations}
                </div>
              </div>
            </div>
            {result.shouldSeekCare && (
              <div className="mt-3">
                <Button size="sm" variant="outline" data-testid="button-seek-care">
                  Find Healthcare Provider
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
