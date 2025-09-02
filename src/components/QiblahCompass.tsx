import React, { useEffect, useRef, useState } from "react";
import { bearingToKaaba, normalize } from "../lib/qiblaMath";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Navigation, MapPin, RefreshCw } from "lucide-react";

type Geo = { lat: number; lon: number };

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
const supportsDeviceOrientation = () => "DeviceOrientationEvent" in window;

export default function QiblahCompass() {
  const [geo, setGeo] = useState<Geo | null>(null);
  const [qibla, setQibla] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [needsMotionPerm, setNeedsMotionPerm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<() => void>(() => {});

  // 1) Get geolocation once
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported in this browser.");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setGeo({ lat, lon });
        setQibla(bearingToKaaba(lat, lon));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // 2) Subscribe to device orientation (compass) if supported
  useEffect(() => {
    if (!supportsDeviceOrientation()) {
      setError((e) => e ?? "Device orientation not supported.");
      return;
    }

    const start = async () => {
      // iOS 13+ requires a permission request within a user gesture
      // We allow user to press a button to grant, hence gating.
      if (isIOS() && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        setNeedsMotionPerm(true);
        return;
      }
      attachListener();
    };

    const attachListener = () => {
      const handler = (e: DeviceOrientationEvent) => {
        // Prefer 'webkitCompassHeading' on iOS (0° = North, increases clockwise)
        // Otherwise compute from alpha (but that's more error-prone in web)
        // Many modern browsers provide 'absolute' true heading only on secure origin.
        const anyE = e as any;
        let hdg: number | null = null;
        if (typeof anyE.webkitCompassHeading === "number") {
          hdg = anyE.webkitCompassHeading; // already degrees from north
        } else if (typeof e.alpha === "number") {
          // e.alpha is rotation around Z-axis in degrees. This is not guaranteed to be compass heading.
          // Use as a fallback; normalize to (0..360).
          hdg = normalize(360 - e.alpha); // invert to make 0 = north, clockwise positive
        }
        if (hdg != null && !Number.isNaN(hdg)) setHeading(normalize(hdg));
      };

      window.addEventListener("deviceorientation", handler, { passive: true });
      unsubRef.current = () => window.removeEventListener("deviceorientation", handler as any);
    };

    start();
    return () => unsubRef.current();
  }, []);

  const requestMotion = async () => {
    try {
      const perm = await (DeviceOrientationEvent as any).requestPermission();
      if (perm === "granted") {
        setNeedsMotionPerm(false);
        // small delay to ensure permission state settles before attaching
        setTimeout(() => {
          attachListener();
        }, 50);
      } else {
        setError("Motion permission was not granted.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Motion permission request failed.");
    }

    function attachListener() {
      const handler = (e: DeviceOrientationEvent) => {
        const anyE = e as any;
        let hdg: number | null = null;
        if (typeof anyE.webkitCompassHeading === "number") {
          hdg = anyE.webkitCompassHeading;
        } else if (typeof e.alpha === "number") {
          hdg = normalize(360 - e.alpha);
        }
        if (hdg != null && !Number.isNaN(hdg)) setHeading(normalize(hdg));
      };
      window.addEventListener("deviceorientation", handler, { passive: true });
      unsubRef.current = () => window.removeEventListener("deviceorientation", handler as any);
    }
  };

  // rotation = how much to rotate needle so it points to Qiblah
  const rotation = qibla != null && heading != null ? normalize(qibla - heading) : 0;

  return (
    <Card className="p-4 sm:p-6 shadow-prayer bg-spiritual border-accent">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        <h2 className="text-base sm:text-lg font-semibold text-foreground font-inter">Qibla Direction</h2>
      </div>

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate">
            {loading 
              ? "Getting location..." 
              : geo 
                ? `${geo.lat.toFixed(4)}°, ${geo.lon.toFixed(4)}°`
                : "Location unavailable"
            }
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={getCurrentLocation}
          disabled={loading}
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 touch-manipulation"
        >
          <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {needsMotionPerm && (
        <div className="text-center mb-4">
          <Button onClick={requestMotion} variant="secondary" size="sm" className="touch-manipulation">
            <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Enable Compass
          </Button>
        </div>
      )}

      {error && (
        <div className="text-center mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="relative">
        {/* Compass Circle */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 sm:mb-6 touch-manipulation">
          <div className="absolute inset-0 rounded-full bg-gradient-peaceful border-2 border-primary/20">
            {/* Compass directions */}
            <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary">
              N
            </div>
            <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary">
              E
            </div>
            <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary">
              S
            </div>
            <div className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary">
              W
            </div>

            {/* Qibla Indicator */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-16 sm:h-20 origin-bottom transform -translate-x-1/2 -translate-y-full"
              style={{
                transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
                transition: heading !== null ? 'transform 120ms linear' : 'none',
              }}
            >
              <div className="w-full h-full bg-gradient-qibla rounded-full shadow-soft"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-gold fill-current" />
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-qibla text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block shadow-soft">
            <span className="font-bold text-base sm:text-lg font-inter">
              {loading ? "..." : qibla !== null ? Math.round(qibla) : "--"}°
            </span>
            <span className="text-xs sm:text-sm ml-2 opacity-90">from North</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 font-inter px-2">
            {heading !== null 
              ? "Point your device towards the golden arrow" 
              : "Move your phone in a '∞' to calibrate the compass"
            }
          </p>
          {!needsMotionPerm && supportsDeviceOrientation() && (
            <div className="text-xs text-muted-foreground">
              Device heading: {heading !== null ? Math.round(heading) : "--"}°
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
