import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const { toast } = useToast();

  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (!response.ok) return {};
      const data = await response.json();
      return { city: data.city || data.locality, country: data.countryName };
    } catch {
      return {};
    }
  }, []);

  const setResolvedLocation = useCallback(async (latitude: number, longitude: number, fallback?: Partial<LocationData>) => {
    const geocoded = await reverseGeocode(latitude, longitude);
    setLocation({
      latitude,
      longitude,
      city: geocoded.city || fallback?.city,
      country: geocoded.country || fallback?.country,
    });
    setError(null);
  }, [reverseGeocode]);

  const fetchApproximateLocation = useCallback(async (): Promise<LocationData> => {
    // Primary: Geoapify IP info (uses our configured API key via edge function)
    // Fallback: free IP services
    const services = [
      {
        url: "https://api.geoapify.com/v1/ipinfo?apiKey=" + (import.meta.env.VITE_GEOAPIFY_KEY || ""),
        parse: (data: Record<string, unknown>) => {
          const loc = data.location as Record<string, unknown> | undefined;
          const city = data.city as Record<string, unknown> | undefined;
          const country = data.country as Record<string, unknown> | undefined;
          return {
            latitude: (loc?.latitude ?? data.latitude) as number,
            longitude: (loc?.longitude ?? data.longitude) as number,
            city: (city?.name ?? data.city) as string,
            country: (country?.name ?? data.country) as string,
          };
        },
        valid: (data: Record<string, unknown>) => {
          const loc = data.location as Record<string, unknown> | undefined;
          return typeof (loc?.latitude ?? data.latitude) === "number";
        },
      },
      {
        url: "https://ipapi.co/json/",
        parse: (data: Record<string, unknown>) => ({
          latitude: data.latitude as number,
          longitude: data.longitude as number,
          city: data.city as string,
          country: data.country_name as string,
        }),
        valid: (data: Record<string, unknown>) => typeof data.latitude === "number",
      },
      {
        url: "https://ipwho.is/",
        parse: (data: Record<string, unknown>) => ({
          latitude: data.latitude as number,
          longitude: data.longitude as number,
          city: data.city as string,
          country: data.country as string,
        }),
        valid: (data: Record<string, unknown>) => data.success === true && typeof data.latitude === "number",
      },
    ];

    for (const service of services) {
      if (!service.url || service.url.includes("apiKey=&") || service.url.endsWith("apiKey=")) {
        continue; // skip if no key configured
      }
      try {
        const response = await fetch(service.url);
        if (!response.ok) continue;
        const data = await response.json();
        if (!service.valid(data)) continue;
        return service.parse(data);
      } catch {
        continue;
      }
    }

    throw new Error("Approximate location unavailable");
  }, []);

  const useApproximateLocation = useCallback(async (showToast = false) => {
    const approximate = await fetchApproximateLocation();
    await setResolvedLocation(approximate.latitude, approximate.longitude, approximate);
    if (showToast) {
      toast({
        title: "Using approximate location",
        description: "GPS was unavailable, so we used your network location.",
      });
    }
  }, [fetchApproximateLocation, setResolvedLocation, toast]);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setIsManualLocation(false);

    if (!navigator.geolocation) {
      useApproximateLocation(true)
        .catch(() => setError("Geolocation is not supported"))
        .finally(() => setLoading(false));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await setResolvedLocation(latitude, longitude);
        setLoading(false);
      },
      (geoError) => {
        useApproximateLocation(geoError.code === geoError.PERMISSION_DENIED)
          .catch(() => {
            setError(geoError.message);
            toast({
              title: "Location Access Denied",
              description: "Please enable location or set it manually.",
              variant: "destructive",
            });
          })
          .finally(() => setLoading(false));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [setResolvedLocation, toast, useApproximateLocation]);

  const setManualLocation = async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`
      );
      if (!response.ok) throw new Error("Failed to geocode");
      const data = await response.json();
      if (!data?.length) throw new Error("Location not found");
      const result = data[0];
      setLocation({
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        city: result.address?.city || result.address?.town || result.address?.village,
        country: result.address?.country,
      });
      setIsManualLocation(true);
      toast({ title: "Location Set", description: `Set to ${result.display_name}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set location");
      toast({ title: "Error", description: "Could not find location.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const switchToAutoLocation = () => {
    setIsManualLocation(false);
    getCurrentLocation();
  };

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    location, loading, error, isManualLocation,
    refetch: getCurrentLocation,
    requestLocation: getCurrentLocation,
    setManualLocation,
    switchToAutoLocation,
  };
};
