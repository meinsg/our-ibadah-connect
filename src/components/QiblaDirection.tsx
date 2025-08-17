import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Navigation, MapPin, RefreshCw } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useQibla } from "@/hooks/useQibla";

const QiblaDirection = () => {
  const { location, loading: locationLoading, refetch } = useLocation();
  const { qiblaDirection, deviceHeading, relativeQibla, loading: qiblaLoading } = useQibla(
    location?.latitude,
    location?.longitude
  );

  return (
    <Card className="p-6 shadow-prayer bg-spiritual border-accent">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground font-inter">Qibla Direction</h2>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {locationLoading 
              ? "Getting location..." 
              : location 
                ? `${location.city || 'Unknown City'}, ${location.country || 'Unknown Country'}`
                : "Location unavailable"
            }
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refetch}
          disabled={locationLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${locationLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="relative">
        {/* Compass Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-peaceful border-2 border-primary/20">
            {/* Compass directions */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary">
              N
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary">
              E
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary">
              S
            </div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary">
              W
            </div>

            {/* Qibla Indicator */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom transform -translate-x-1/2 -translate-y-full"
              style={{
                transform: `translate(-50%, -100%) rotate(${relativeQibla}deg)`,
              }}
            >
              <div className="w-full h-full bg-gradient-qibla rounded-full shadow-soft"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Navigation className="h-4 w-4 text-gold fill-current" />
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-qibla text-white px-6 py-3 rounded-full inline-block shadow-soft">
            <span className="font-bold text-lg font-inter">
              {qiblaLoading ? "..." : Math.round(qiblaDirection)}°
            </span>
            <span className="text-sm ml-2 opacity-90">from North</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-3 font-inter">
            Point your device towards the golden arrow
          </p>
          <Button variant="secondary" size="sm" className="text-sm">
            <Navigation className="h-4 w-4 mr-2" />
            Calibrate Compass
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QiblaDirection;