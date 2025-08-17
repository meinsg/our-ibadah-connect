import { useState, useEffect } from "react";
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
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get city/country using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              city: data.city || data.locality,
              country: data.countryName
            });
          } else {
            setLocation({ latitude, longitude });
          }
        } catch {
          // Fallback to just coordinates
          setLocation({ latitude, longitude });
        }
        
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        toast({
          title: "Location Access Denied",
          description: "Please enable location access for accurate prayer times and Qibla direction.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    loading,
    error,
    refetch: getCurrentLocation,
    requestLocation: getCurrentLocation
  };
};