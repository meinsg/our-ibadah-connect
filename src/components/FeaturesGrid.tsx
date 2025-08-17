import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  Calendar, 
  UtensilsCrossed,
  Building2,
  BookOpen,
  Clock,
  Compass
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Find Mosques",
    description: "Locate nearby mosques with prayer times and facilities",
    color: "primary",
    comingSoon: false
  },
  {
    icon: UtensilsCrossed,
    title: "Halal Food",
    description: "Discover halal restaurants and certified eateries",
    color: "secondary",
    comingSoon: true
  },
  {
    icon: Calendar,
    title: "Islamic Events",
    description: "Browse local dawah events and community gatherings",
    color: "gold",
    comingSoon: true
  },
  {
    icon: Users,
    title: "Connect",
    description: "Join Muslim community groups and discussions",
    color: "primary",
    comingSoon: true
  },
  {
    icon: BookOpen,
    title: "Islamic Resources",
    description: "Access Quran, Hadith, and educational content",
    color: "secondary",
    comingSoon: true
  },
  {
    icon: Clock,
    title: "Prayer Reminders",
    description: "Customizable adhan notifications and reminders",
    color: "gold",
    comingSoon: true
  }
];

const FeaturesGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card key={index} className="p-4 sm:p-6 shadow-soft bg-card border-accent hover:shadow-prayer transition-all group touch-manipulation">
            <div className="flex flex-col items-center text-center">
              <div className={`
                p-3 sm:p-4 rounded-full mb-3 sm:mb-4 transition-all group-hover:scale-110
                ${feature.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
                ${feature.color === 'secondary' ? 'bg-secondary/10 text-secondary' : ''}
                ${feature.color === 'gold' ? 'bg-gold/10 text-gold' : ''}
              `}>
                <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 font-inter">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 font-inter leading-relaxed px-2">
                {feature.description}
              </p>

              {feature.comingSoon ? (
                <div className="px-2 sm:px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground font-inter">
                  Coming Soon
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="font-inter text-xs sm:text-sm touch-manipulation"
                >
                  Explore
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FeaturesGrid;