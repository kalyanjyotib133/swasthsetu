import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { generateHealthId } from "@/lib/auth";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // User data
    email: "",
    password: "",
    username: "",
    role: "migrant",
    // Profile data
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    bloodGroup: "",
    language: "malayalam",
    homeState: "",
    workLocation: "",
    allergies: "",
    emergencyContact: "",
    termsAccepted: false,
  });

  const { register, isLoading, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const healthId = generateHealthId();
      const registrationData = {
        user: {
          email: formData.email,
          password: formData.password,
          username: formData.username || formData.email,
          role: formData.role,
        },
        profile: {
          fullName: formData.fullName,
          age: parseInt(formData.age),
          gender: formData.gender,
          mobile: formData.mobile,
          bloodGroup: formData.bloodGroup,
          language: formData.language,
          homeState: formData.homeState,
          workLocation: formData.workLocation,
          allergies: formData.allergies,
          emergencyContact: formData.emergencyContact,
          healthId,
        }
      };

      await register(registrationData);
      
      toast({
        title: "Registration Successful!",
        description: `Welcome to SwasthSetu! Your Health ID is ${healthId}`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const progressWidth = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center" data-testid="text-register-title">Register as Migrant Worker</CardTitle>
          <CardDescription className="text-center">
            Create your digital health profile in Kerala
          </CardDescription>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                <span className="ml-2 text-sm">Basic Info</span>
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                <span className="ml-2 text-sm">Details</span>
              </div>
              <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
                <span className="ml-2 text-sm">Complete</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full progress-bar" 
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4 fade-in">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                      data-testid="input-fullname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      data-testid="input-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      required
                      data-testid="input-mobile"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                      data-testid="input-age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="button" onClick={handleNext} className="w-full" data-testid="button-next">
                  Next Step
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 fade-in">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                      <SelectTrigger data-testid="select-blood-group">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                      <SelectTrigger data-testid="select-language">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="malayalam">Malayalam</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homeState">Home State/District</Label>
                  <Input
                    id="homeState"
                    type="text"
                    placeholder="e.g., Bihar, Muzaffarpur"
                    value={formData.homeState}
                    onChange={(e) => handleInputChange("homeState", e.target.value)}
                    data-testid="input-home-state"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workLocation">Current Work Location in Kerala</Label>
                  <Input
                    id="workLocation"
                    type="text"
                    placeholder="e.g., Kochi, Ernakulam"
                    value={formData.workLocation}
                    onChange={(e) => handleInputChange("workLocation", e.target.value)}
                    data-testid="input-work-location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies (Optional)</Label>
                  <Input
                    id="allergies"
                    type="text"
                    placeholder="List any known allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    data-testid="input-allergies"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    placeholder="Emergency contact number"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    data-testid="input-emergency-contact"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1" data-testid="button-back">
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} className="flex-1" data-testid="button-next-2">
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 fade-in">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Complete Registration</h3>
                  <p className="text-muted-foreground">
                    Please review your information and accept our terms to create your health profile.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div><strong>Name:</strong> {formData.fullName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Mobile:</strong> {formData.mobile}</div>
                  <div><strong>Age:</strong> {formData.age} | <strong>Gender:</strong> {formData.gender}</div>
                  {formData.bloodGroup && <div><strong>Blood Group:</strong> {formData.bloodGroup}</div>}
                  <div><strong>Language:</strong> {formData.language}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms & Conditions and Privacy Policy
                  </Label>
                </div>

                <div className="flex space-x-4">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1" data-testid="button-back-2">
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isLoading || !formData.termsAccepted}
                    data-testid="button-complete-registration"
                  >
                    {isLoading ? "Creating Account..." : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}
          </form>
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              className="text-sm"
              onClick={() => navigate("/login")}
              data-testid="link-login"
            >
              Already have an account? Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
