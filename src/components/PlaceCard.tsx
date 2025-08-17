import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Navigation } from "lucide-react";

interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean | null;
  types?: string[];
  photo_ref?: string | null;
}

interface PlaceCardProps {
  place: Place;
  className?: string;
}

const PlaceCard = ({ place, className = "" }: PlaceCardProps) => {
  const handleDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <Card className={`p-4 hover:shadow-prayer transition-shadow ${className}`}>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground font-amiri text-lg leading-tight">
            {place.name}
          </h3>
          <div className="flex items-start gap-1 mt-1">
            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-inter leading-tight">
              {place.address}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-gold fill-current" />
              <span className="text-sm font-medium text-foreground font-inter">
                {place.rating}
              </span>
              {place.user_ratings_total && (
                <span className="text-xs text-muted-foreground font-inter">
                  ({place.user_ratings_total})
                </span>
              )}
            </div>
          )}
          
          {place.open_now !== null && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <Badge 
                variant={place.open_now ? "default" : "secondary"}
                className="text-xs font-inter"
              >
                {place.open_now ? "Open" : "Closed"}
              </Badge>
            </div>
          )}
        </div>

        <Button 
          onClick={handleDirections}
          size="sm" 
          className="w-full font-inter touch-manipulation"
        >
          <Navigation className="h-3 w-3 mr-2" />
          Get Directions
        </Button>
      </div>
    </Card>
  );
};

export default PlaceCard;