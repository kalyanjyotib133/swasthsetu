import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, TrendingUp } from "lucide-react";

export default function SDGSection() {
  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Heart className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-sdg-title">
            Supporting UN SDG-3
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-sdg-subtitle">
            Good Health & Well-being for All
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow bounce-hover">
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-accent-foreground h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-disease-prevention">
                Disease Prevention
              </h3>
              <p className="text-muted-foreground">
                Early detection and preventive care for migrant communities
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bounce-hover">
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="text-accent-foreground h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-fair-healthcare">
                Fair Healthcare
              </h3>
              <p className="text-muted-foreground">
                Equal access to healthcare services regardless of location
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bounce-hover">
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-accent-foreground h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-surveillance">
                Real-time Surveillance
              </h3>
              <p className="text-muted-foreground">
                Monitor health trends and respond to emergencies quickly
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
