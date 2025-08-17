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
  const [isManualLocation, setIsManualLocation] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    setIsManualLocation(false);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log('Raw GPS coordinates:', { latitude, longitude });
        console.log('Position accuracy:', position.coords.accuracy, 'meters');
        
        try {
          // Try to get city/country using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log('Reverse geocoding response:', data);
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
          description: "Please enable location access or set your location manually.",
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

  const setManualLocation = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Nominatim (OpenStreetMap) for geocoding - free service
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
            country: result.address?.country
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
      setError(err instanceof Error ? err.message : 'Failed to set location');
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
  }, []);

  return {
    location,
    loading,
    error,
    isManualLocation,
    refetch: getCurrentLocation,
    requestLocation: getCurrentLocation,
    setManualLocation,
    switchToAutoLocation
  };
};