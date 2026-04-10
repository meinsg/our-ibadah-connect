import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HalalAnalysis {
  likelyHalal: boolean;
  confidence: string;
}

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
  phone?: string | null;
  cuisine?: string | null;
  halalAnalysis?: HalalAnalysis;
}

interface UsePlacesOptions {
  radius?: number;
  openNow?: boolean;
}

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [generalPlaces, setGeneralPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuslimRegion, setIsMuslimRegion] = useState(false);

  const analyzeNames = useCallback(async (items: Place[]): Promise<Place[]> => {
    if (items.length === 0) return items;
    try {
      const names = items.map(p => p.name);
      const { data, error } = await supabase.functions.invoke('analyze-halal', {
        body: { names },
      });
      if (error || !data?.results) return items;

      const analysisMap = new Map<string, HalalAnalysis>();
      for (const r of data.results) {
        analysisMap.set(r.name, { likelyHalal: r.likelyHalal, confidence: r.confidence });
      }

      return items.map(p => ({
        ...p,
        halalAnalysis: analysisMap.get(p.name) || undefined,
      }));
    } catch {
      return items;
    }
  }, []);

  const searchMosques = useCallback(async (
    latitude: number, 
    longitude: number, 
    options: UsePlacesOptions = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('places-mosques', {
        body: { lat: latitude, lng: longitude, radius: options.radius || 5000, open_now: options.openNow }
      });

      if (error) throw error;
      setPlaces(data?.items || []);
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

      const muslimRegion = data?.isMuslimRegion || false;
      setIsMuslimRegion(muslimRegion);

      // Run AI analysis on results (non-blocking enhancement)
      const items = data?.items || [];
      const general = data?.generalItems || [];

      // Analyze halal likelihood for non-Muslim regions where status is uncertain
      if (!muslimRegion && (items.length > 0 || general.length > 0)) {
        const allItems = [...items, ...general];
        const analyzed = await analyzeNames(allItems);
        setPlaces(analyzed.slice(0, items.length));
        setGeneralPlaces(analyzed.slice(items.length));
      } else {
        setPlaces(items);
        setGeneralPlaces(general);
      }
    } catch (err) {
      console.error('Error searching halal food:', err);
      setError(err instanceof Error ? err.message : 'Failed to search halal food');
      setPlaces([]);
      setGeneralPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [analyzeNames]);

  return {
    places,
    generalPlaces,
    loading,
    error,
    isMuslimRegion,
    searchMosques,
    searchHalalFood,
  };
};
