import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface IpLocationResponse {
  success: boolean;
  latitude?: number;
  longitude?: number;
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

      if (!response.ok) {
        return {};
      }

      const data = await response.json();
      return {
        city: data.city || data.locality,
        country: data.countryName,
      };
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

  const fetchApproximateLocation = useCallback(async () => {
    const response = await fetch("https://ipwho.is/");
    if (!response.ok) {
      throw new Error("Failed to fetch approximate location");
    }

    const data: IpLocationResponse = await response.json();
    if (!data.success || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      throw new Error("Approximate location unavailable");
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country,
    } satisfies LocationData;
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
        .catch(() => {
          setError("Geolocation is not supported by this browser");
        })
        .finally(() => {
          setLoading(false);
        });
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
              description: "Please enable location access or set your location manually.",
              variant: "destructive",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [setResolvedLocation, toast, useApproximateLocation]);

  const setManualLocation = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const latitude = parseFloat(result.lat);
          const longitude = parseFloat(result.lon);

          setLocation({
            latitude,
            longitude,
            city: result.address?.city || result.address?.town || result.address?.village,
            country: result.address?.country,
          });
          setIsManualLocation(true);
          toast({
            title: "Location Set",
            description: `Location set to ${result.display_name}`,
          });
        } else {
          throw new Error("Location not found");
        }
      } else {
        throw new Error("Failed to geocode address");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set location");
      toast({
        title: "Error",
        description: "Could not find the specified location. Please try a different address.",
        variant: "destructive",
      });
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
    location,
    loading,
    error,
    isManualLocation,
    refetch: getCurrentLocation,
    requestLocation: getCurrentLocation,
    setManualLocation,
    switchToAutoLocation,
  };
};
