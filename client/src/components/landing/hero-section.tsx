import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="slide-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6" data-testid="text-hero-title">
              Digital Health Records for{" "}
              <span className="text-primary">Migrant Workers</span> in Kerala
            </h1>
            <p className="text-xl text-muted-foreground mb-8" data-testid="text-hero-subtitle">
              Track your health, get timely care, stay protected — all in one secure digital platform designed for your mobility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/register")}
                className="bounce-hover transform transition-all"
                data-testid="button-register-hero"
              >
                Register as Migrant
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
                data-testid="button-login-hero"
              >
                Health Worker Login
              </Button>
            </div>
          </div>
          <div className="slide-in">
            <img 
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Healthcare workers helping patients" 
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="img-hero-illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
