import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Navigation, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const QiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(45); // Mock angle
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [location, setLocation] = useState("Getting location...");

  useEffect(() => {
    // Mock location and qibla calculation
    setTimeout(() => {
      setLocation("Riyadh, Saudi Arabia");
      setQiblaDirection(245); // Mock qibla direction
    }, 1500);

    // Mock device orientation
    const timer = setInterval(() => {
      setDeviceHeading(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const relativeQibla = (qiblaDirection - deviceHeading + 360) % 360;

  return (
    <Card className="p-6 shadow-prayer bg-spiritual border-accent">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground font-inter">Qibla Direction</h2>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
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
            <span className="font-bold text-lg font-inter">{Math.round(qiblaDirection)}°</span>
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