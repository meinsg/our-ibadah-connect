import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean | null;
  types?: string[];
  photo_ref?: string | null;
}

interface UsePlacesOptions {
  radius?: number;
  openNow?: boolean;
}

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMosques = useCallback(async (
    latitude: number, 
    longitude: number, 
    options: UsePlacesOptions = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        lat: latitude.toString(),
        lng: longitude.toString(),
        radius: (options.radius || 5000).toString(),
        ...(options.openNow && { open_now: 'true' })
      });

      const { data, error } = await supabase.functions.invoke('places-mosques', {
        body: { lat: latitude, lng: longitude, radius: options.radius || 5000, open_now: options.openNow }
      });

      if (error) throw error;
      if (data?.items) {
        setPlaces(data.items);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error('Error searching mosques:', err);
      setError(err instanceof Error ? err.message : 'Failed to search mosques');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchHalalFood = useCallback(async (
    latitude: number, 
    longitude: number, 
    options: UsePlacesOptions = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('places-halal', {
        body: { lat: latitude, lng: longitude, radius: options.radius || 5000, open_now: options.openNow }
      });

      if (error) throw error;
      if (data?.items) {
        setPlaces(data.items);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error('Error searching halal food:', err);
      setError(err instanceof Error ? err.message : 'Failed to search halal food');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    places,
    loading,
    error,
    searchMosques,
    searchHalalFood,
  };
};