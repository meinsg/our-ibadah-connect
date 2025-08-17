import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "@/hooks/useLocation";
import { usePlaces } from "@/hooks/usePlaces";
import PlaceCard from "@/components/PlaceCard";
import { useToast } from "@/hooks/use-toast";

const HalalFood = () => {
  const [radius, setRadius] = useState("5000");
  const [openNow, setOpenNow] = useState(false);
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const { places, loading: placesLoading, error: placesError, searchHalalFood } = usePlaces();
  const { toast } = useToast();

  useEffect(() => {
    if (location && !placesLoading) {
      searchHalalFood(location.latitude, location.longitude, {
        radius: parseInt(radius),
        openNow
      });
    }
  }, [location, radius, openNow, searchHalalFood, placesLoading]);

  useEffect(() => {
    if (placesError) {
      toast({
        title: "Error",
        description: placesError,
        variant: "destructive",
      });
    }
  }, [placesError, toast]);

  const handleSearch = () => {
    if (location) {
      searchHalalFood(location.latitude, location.longitude, {
        radius: parseInt(radius),
        openNow
      });
    } else {
      requestLocation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-accent safe-area-top">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="font-inter">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary font-amiri">Halal Food</h1>
              <p className="text-xs text-muted-foreground font-inter hidden sm:block">
                Discover halal restaurants and certified eateries
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="radius" className="text-sm font-medium font-inter">
                  Search Radius
                </Label>
                <Select value={radius} onValueChange={setRadius}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1 km</SelectItem>
                    <SelectItem value="3000">3 km</SelectItem>
                    <SelectItem value="5000">5 km</SelectItem>
                    <SelectItem value="10000">10 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="open-now"
                  checked={openNow}
                  onCheckedChange={setOpenNow}
                />
                <Label htmlFor="open-now" className="text-sm font-medium font-inter">
                  Open now only
                </Label>
              </div>
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={locationLoading || placesLoading}
              className="w-full sm:w-auto font-inter touch-manipulation"
            >
              {(locationLoading || placesLoading) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {locationLoading ? "Getting Location..." : placesLoading ? "Searching..." : "Search Halal Food"}
            </Button>
          </div>
        </Card>

        {/* Location Status */}
        {locationError && (
          <Card className="p-4 mb-6 border-destructive">
            <div className="flex items-center gap-2 text-destructive">
              <MapPin className="h-4 w-4" />
              <p className="text-sm font-inter">{locationError}</p>
            </div>
          </Card>
        )}

        {!location && !locationError && (
          <Card className="p-4 mb-6">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-inter mb-3">
                Location access is needed to find nearby halal restaurants
              </p>
              <Button onClick={requestLocation} variant="outline" size="sm" className="font-inter">
                Enable Location
              </Button>
            </div>
          </Card>
        )}

        {/* Results */}
        {places.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground font-amiri">
                Found {places.length} Halal Restaurants
              </h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}

        {!placesLoading && places.length === 0 && location && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2 font-amiri">
              No Halal Restaurants Found
            </h3>
            <p className="text-muted-foreground font-inter mb-4">
              Try increasing the search radius or removing filters
            </p>
            <Button 
              onClick={() => setRadius("10000")} 
              variant="outline" 
              className="font-inter"
            >
              Expand Search to 10km
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HalalFood;