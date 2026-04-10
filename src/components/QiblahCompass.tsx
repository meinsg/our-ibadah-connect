import React, { useEffect, useRef, useState } from "react";
import { bearingToKaaba, normalize } from "../lib/qiblaMath";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Navigation, MapPin, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSharedLocation } from "@/contexts/LocationContext";

type Geo = { lat: number; lon: number };

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
const supportsDeviceOrientation = () => "DeviceOrientationEvent" in window;

export default function QiblahCompass() {
  const { t } = useLanguage();
  const { location, loading: locationLoading, error: locationError, requestLocation } = useSharedLocation();
  const [heading, setHeading] = useState<number | null>(null);
  const [needsMotionPerm, setNeedsMotionPerm] = useState(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const unsubRef = useRef<() => void>(() => {});

  const geo: Geo | null = location
    ? { lat: location.latitude, lon: location.longitude }
    : null;

  const qibla = geo ? bearingToKaaba(geo.lat, geo.lon) : null;
  const loading = locationLoading && !geo;
  const error = orientationError ?? locationError;

  useEffect(() => {
    if (!supportsDeviceOrientation()) {
      setOrientationError((current) => current ?? "Device orientation not supported.");
      return;
    }

    const attachListener = () => {
      const handler = (event: DeviceOrientationEvent) => {
        const nativeEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
        let nextHeading: number | null = null;

        if (typeof nativeEvent.webkitCompassHeading === "number") {
          nextHeading = nativeEvent.webkitCompassHeading;
        } else if (typeof event.alpha === "number") {
          nextHeading = normalize(360 - event.alpha);
        }

        if (nextHeading != null && !Number.isNaN(nextHeading)) {
          setHeading(normalize(nextHeading));
        }
      };

      window.addEventListener("deviceorientation", handler, { passive: true });
      unsubRef.current = () => window.removeEventListener("deviceorientation", handler);
    };

    if (isIOS() && typeof (DeviceOrientationEvent as never as { requestPermission?: () => Promise<string> }).requestPermission === "function") {
      setNeedsMotionPerm(true);
      return () => unsubRef.current();
    }

    attachListener();
    return () => unsubRef.current();
  }, []);

  const requestMotion = async () => {
    try {
      const permissionHandler = DeviceOrientationEvent as never as { requestPermission?: () => Promise<string> };
      const permission = await permissionHandler.requestPermission?.();

      if (permission === "granted") {
        setNeedsMotionPerm(false);

        const handler = (event: DeviceOrientationEvent) => {
          const nativeEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
          let nextHeading: number | null = null;

          if (typeof nativeEvent.webkitCompassHeading === "number") {
            nextHeading = nativeEvent.webkitCompassHeading;
          } else if (typeof event.alpha === "number") {
            nextHeading = normalize(360 - event.alpha);
          }

          if (nextHeading != null && !Number.isNaN(nextHeading)) {
            setHeading(normalize(nextHeading));
          }
        };

        window.addEventListener("deviceorientation", handler, { passive: true });
        unsubRef.current = () => window.removeEventListener("deviceorientation", handler);
      } else {
        setOrientationError("Motion permission was not granted.");
      }
    } catch (motionError) {
      setOrientationError(motionError instanceof Error ? motionError.message : "Motion permission request failed.");
    }
  };

  const rotation = qibla != null && heading != null ? normalize(qibla - heading) : 0;

  return (
    <Card className="p-4 sm:p-6 shadow-prayer bg-spiritual border-accent">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        <h2 className="text-base sm:text-lg font-semibold text-foreground font-inter">{t("qibla.title")}</h2>
      </div>

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate">
            {loading
              ? t("prayer.gettingLocation")
              : geo
                ? `${geo.lat.toFixed(4)}°, ${geo.lon.toFixed(4)}°`
                : t("qibla.locationUnavailable")}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={requestLocation}
          disabled={locationLoading}
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 touch-manipulation"
        >
          <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${locationLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {needsMotionPerm && (
        <div className="text-center mb-4">
          <Button onClick={requestMotion} variant="secondary" size="sm" className="touch-manipulation">
            <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {t("qibla.enableCompass")}
          </Button>
        </div>
      )}

      {error && (
        <div className="text-center mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="relative">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 sm:mb-6 touch-manipulation">
          <div className="absolute inset-0 rounded-full bg-gradient-peaceful border-2 border-primary/20">
            <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary">N</div>
            <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary">E</div>
            <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary">S</div>
            <div className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary">W</div>

            <div
              className="absolute top-1/2 left-1/2 w-1 h-16 sm:h-20 origin-bottom transform -translate-x-1/2 -translate-y-full"
              style={{
                transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
                transition: heading !== null ? "transform 120ms linear" : "none",
              }}
            >
              <div className="w-full h-full bg-gradient-qibla rounded-full shadow-soft"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-gold fill-current" />
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-qibla text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block shadow-soft">
            <span className="font-bold text-base sm:text-lg font-inter">
              {loading ? "..." : qibla !== null ? Math.round(qibla) : "--"}°
            </span>
            <span className="text-xs sm:text-sm ml-2 opacity-90">{t("qibla.fromNorth")}</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 font-inter px-2">
            {heading !== null ? t("qibla.pointDevice") : t("qibla.calibrate")}
          </p>
          {!needsMotionPerm && supportsDeviceOrientation() && (
            <div className="text-xs text-muted-foreground">
              {t("qibla.deviceHeading")} {heading !== null ? Math.round(heading) : "--"}°
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
