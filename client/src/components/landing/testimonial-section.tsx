import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function TestimonialSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Quote className="text-primary-foreground h-8 w-8" />
            </div>
            <blockquote className="text-xl text-foreground mb-6" data-testid="text-testimonial-quote">
              "This system made it easy to keep my medical records safe while working away from home. 
              Now I can show my vaccination status and health history to any doctor instantly."
            </blockquote>
            <div className="text-muted-foreground" data-testid="text-testimonial-author">
              <strong>Ramesh Kumar</strong> — Construction Worker from Bihar
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
