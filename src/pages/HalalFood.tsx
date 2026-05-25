import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Search, ArrowLeft, Navigation, RefreshCw, Info, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlaces } from "@/hooks/usePlaces";
import PlaceCard from "@/components/PlaceCard";
import { PlaceCardSkeletonGrid } from "@/components/PlaceCardSkeleton";
import { useToast } from "@/hooks/use-toast";
import { useSharedLocation } from "@/contexts/LocationContext";
import LocationAutocomplete from "@/components/LocationAutocomplete";

const HalalFood = () => {
  const [radius, setRadius] = useState("5000");
  const [openNow, setOpenNow] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto');
  const { location, loading: locationLoading, error: locationError, requestLocation, setManualLocation, switchToAutoLocation } = useSharedLocation();
  const { places, generalPlaces, loading: placesLoading, error: placesError, isMuslimRegion, searchHalalFood } = usePlaces();
  const { toast } = useToast();

  useEffect(() => {
    if (location) {
      searchHalalFood(location.latitude, location.longitude, {
        radius: parseInt(radius),
        openNow
      });
    }
  }, [location, radius, openNow, searchHalalFood]);

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

  const handleAutocompleteSelect = async (lat: number, lon: number, city?: string, country?: string) => {
    if (city) {
      await setManualLocation(city + (country ? `, ${country}` : ""));
    }
    setLocationMode('manual');
    setShowManualInput(false);
  };

  const handleManualLocationSubmit = async () => {
    if (manualAddress.trim()) {
      await setManualLocation(manualAddress.trim());
      setLocationMode('manual');
      setShowManualInput(false);
    }
  };

  const handleLocationModeToggle = () => {
    const newMode = locationMode === 'auto' ? 'manual' : 'auto';
    setLocationMode(newMode);

    if (newMode === 'auto') {
      switchToAutoLocation();
    } else {
      setShowManualInput(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful">
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
                <Switch id="open-now" checked={openNow} onCheckedChange={setOpenNow} />
                <Label htmlFor="open-now" className="text-sm font-medium font-inter">
                  Open now only
                </Label>
              </div>
            </div>

            <Button onClick={handleSearch} disabled={locationLoading || placesLoading} className="w-full sm:w-auto font-inter touch-manipulation">
              {(locationLoading || placesLoading) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {locationLoading ? "Getting Location..." : placesLoading ? "Searching..." : "Search Halal Food"}
            </Button>
          </div>
        </Card>

        {location && (
          <Card className="p-4 mb-6 border-success">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2 text-success min-w-0">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="text-sm font-inter break-words">
                  {locationMode === 'manual' ? "Manual location: " : "Auto location: "}
                  {location.city && location.country ? `${location.city}, ${location.country}` : `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLocationModeToggle} className="font-inter flex items-center gap-2 shrink-0 min-h-[44px] sm:min-h-0 w-full sm:w-auto justify-center">
                <RefreshCw className="h-4 w-4" />
                {locationMode === 'auto' ? 'Switch to Manual' : 'Switch to Auto'}
              </Button>
            </div>
          </Card>
        )}

        {showManualInput && (
          <Card className="p-4 mb-6">
            <div className="space-y-3">
              <Label htmlFor="manual-address" className="text-sm font-medium font-inter">
                Search for a city or address
              </Label>
              <LocationAutocomplete
                onSelect={handleAutocompleteSelect}
                placeholder="e.g., Nouakchott, Mauritania"
              />
            </div>
          </Card>
        )}

        {locationError && (
          <Card className="p-4 mb-6 border-destructive">
            <div className="flex items-center gap-2 text-destructive mb-3">
              <MapPin className="h-4 w-4" />
              <p className="text-sm font-inter">{locationError}</p>
            </div>
            <Button onClick={() => setShowManualInput(true)} variant="outline" size="sm" className="font-inter">
              Set Location Manually
            </Button>
          </Card>
        )}

        {!location && !locationError && (
          <Card className="p-4 mb-6">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-inter mb-3">
                Location access is needed to find nearby halal restaurants
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={requestLocation} variant="outline" size="sm" className="font-inter">
                  <Navigation className="h-4 w-4 mr-2" />
                  Use GPS
                </Button>
                <Button onClick={() => setShowManualInput(true)} variant="outline" size="sm" className="font-inter">
                  <MapPin className="h-4 w-4 mr-2" />
                  Set Manually
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Muslim-majority region notice */}
        {isMuslimRegion && places.length > 0 && (
          <Alert className="mb-4 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm font-inter">
              In this region, Halal is the standard. We are showing all local restaurants. 
              Please verify specific dietary requirements (like hand-slaughtered or cross-contamination) directly with the establishment.
            </AlertDescription>
          </Alert>
        )}

        {places.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground font-amiri">
                {isMuslimRegion ? `Found ${places.length} Restaurants` : `Found ${places.length} Halal Restaurants`}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}

        {placesLoading && places.length === 0 && generalPlaces.length === 0 && location && (
          <PlaceCardSkeletonGrid count={6} />
        )}

        {/* General restaurants fallback (non-Muslim regions, no halal results) */}
        {generalPlaces.length > 0 && (
          <div className="space-y-4 mt-6">
            <Alert className="border-amber-400/30 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm font-inter text-amber-800">
                No certified Halal restaurants found nearby. Below are general restaurants — Halal status is unverified. Please call to confirm.
              </AlertDescription>
            </Alert>

            <h2 className="text-lg font-semibold text-foreground font-amiri">
              General Restaurants ({generalPlaces.length})
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {generalPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}

        {!placesLoading && places.length === 0 && generalPlaces.length === 0 && location && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2 font-amiri">
              No Restaurants Found
            </h3>
            <p className="text-muted-foreground font-inter mb-4">
              Try increasing the search radius or removing filters
            </p>
            <Button onClick={() => setRadius("10000")} variant="outline" className="font-inter">
              Expand Search to 10km
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HalalFood;
