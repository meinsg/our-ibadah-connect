import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  types?: string[];
  photos?: Array<{
    photo_reference: string;
  }>;
}

interface GooglePlacesResponse {
  status: string;
  results: PlaceResult[];
}

function normalizePlace(place: PlaceResult) {
  return {
    id: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address,
    lat: place.geometry?.location?.lat,
    lng: place.geometry?.location?.lng,
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    open_now: place.opening_hours?.open_now || null,
    types: place.types || [],
    photo_ref: place.photos?.[0]?.photo_reference || null
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let lat, lng, radius, openNow;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      lat = url.searchParams.get('lat');
      lng = url.searchParams.get('lng');
      radius = url.searchParams.get('radius') || '5000';
      openNow = url.searchParams.get('open_now') === 'true';
    } else if (req.method === 'POST') {
      const body = await req.json();
      lat = body.lat?.toString();
      lng = body.lng?.toString();
      radius = (body.radius || 5000).toString();
      openNow = body.open_now === true;
    }

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'lat and lng parameters are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const params = new URLSearchParams({
      key: API_KEY,
      location: `${lat},${lng}`,
      radius: radius,
      keyword: 'halal',
      type: 'restaurant',
      ...(openNow && { opennow: 'true' })
    });

    const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
    
    const response = await fetch(googleMapsUrl);
    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const places = (data.results || []).map(normalizePlace);
    
    // Filter out places with non-halal indicators
    const badKeywords = /(pork|wine|barbecue.*pork|non-halal|bacon|ham)/i;
    const filtered = places.filter(place => {
      const searchText = `${place.name} ${(place.types || []).join(', ')}`;
      return !badKeywords.test(searchText);
    });

    return new Response(
      JSON.stringify({ items: filtered }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})