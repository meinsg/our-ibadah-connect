import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Navigation, Phone, Sparkles } from "lucide-react";

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
  phone?: string | null;
  halalAnalysis?: {
    likelyHalal: boolean;
    confidence: string;
  };
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

  const handleCall = () => {
    if (place.phone) {
      window.open(`tel:${place.phone}`, '_self');
    }
  };

  const isUnverified = place.types?.includes('unverified');
  const analysis = place.halalAnalysis;

  return (
    <Card className={`p-4 hover:shadow-prayer transition-shadow ${className}`}>
      <div className="space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground font-amiri text-lg leading-tight">
              {place.name}
            </h3>
            <div className="flex flex-col gap-1 shrink-0">
              {isUnverified && (
                <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600 whitespace-nowrap">
                  Unverified
                </Badge>
              )}
              {analysis?.likelyHalal && (
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary whitespace-nowrap gap-0.5">
                  <Sparkles className="h-2.5 w-2.5" />
                  Likely Halal
                </Badge>
              )}
            </div>
          </div>
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

        <div className="flex gap-2">
          <Button 
            onClick={handleDirections}
            size="sm" 
            className="flex-1 font-inter touch-manipulation"
          >
            <Navigation className="h-3 w-3 mr-2" />
            Directions
          </Button>
          {place.phone && (
            <Button
              onClick={handleCall}
              size="sm"
              variant="outline"
              className="font-inter touch-manipulation"
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;
