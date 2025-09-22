import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Droplets, Activity, Heart } from "lucide-react";

interface HealthTip {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: any;
  color: string;
}

const healthTips: HealthTip[] = [
  {
    id: "1",
    title: "Wash Hands Regularly",
    description: "Clean your hands frequently with soap and water for at least 20 seconds to prevent infections.",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    icon: Droplets,
    color: "from-primary/10 to-primary/5"
  },
  {
    id: "2",
    title: "Drink Clean Water",
    description: "Always drink boiled or filtered water to avoid waterborne diseases like diarrhea and typhoid.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    icon: Droplets,
    color: "from-accent/10 to-accent/5"
  },
  {
    id: "3",
    title: "Exercise Daily",
    description: "Regular physical activity boosts immunity and helps maintain good mental health.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    icon: Activity,
    color: "from-green-100 to-green-50"
  },
  {
    id: "4",
    title: "Eat Nutritious Food",
    description: "Include fruits, vegetables, and proteins in your diet to maintain good health and energy levels.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    icon: Heart,
    color: "from-orange-100 to-orange-50"
  },
  {
    id: "5",
    title: "Get Adequate Sleep",
    description: "Aim for 7-8 hours of quality sleep each night to help your body recover and stay healthy.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    icon: Heart,
    color: "from-purple-100 to-purple-50"
  }
];

export default function HealthTips() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 320; // w-80 = 320px
      carouselRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + healthTips.length) % healthTips.length);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % healthTips.length);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="kerala-card mb-8" data-testid="health-tips">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Health Tips</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="h-8 w-8"
                data-testid="button-tips-previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                data-testid="button-tips-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={carouselRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              data-testid="carousel-tips"
            >
              {healthTips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex-shrink-0 w-80 bg-gradient-to-br ${tip.color} rounded-lg p-4 transition-transform hover:scale-105`}
                  data-testid={`tip-card-${tip.id}`}
                >
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                    data-testid={`tip-image-${tip.id}`}
                  />
                  
                  <div className="flex items-center gap-2 mb-2">
                    <tip.icon className="h-5 w-5 text-primary" />
                    <h4 className="font-medium text-foreground">{tip.title}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-4">
              {healthTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAutoPlaying(true), 3000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                  }`}
                  data-testid={`dot-${index}`}
                />
              ))}
            </div>
          </div>
          
          {/* Auto-play indicator */}
          <div className="flex items-center justify-center mt-4 gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
