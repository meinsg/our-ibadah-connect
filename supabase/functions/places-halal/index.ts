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
      console.error('Google Maps API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('Making request to Google Places API with params:', { lat, lng, radius, keyword: 'halal' });
    console.log('API_KEY present:', !!API_KEY);
    console.log('API_KEY length:', API_KEY?.length);

    const params = new URLSearchParams({
      key: API_KEY,
      location: `${lat},${lng}`,
      radius: radius,
      keyword: 'halal',
      type: 'restaurant',
      ...(openNow && { opennow: 'true' })
    });

    const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
    console.log('Google Maps URL (without API key):', googleMapsUrl.replace(API_KEY, '[REDACTED]'));
    
    const response = await fetch(googleMapsUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data: GooglePlacesResponse = await response.json();
    console.log('Google Places API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      
      // Provide specific error messages for common issues
      let errorMessage = `Google Places API error: ${data.status}`;
      if (data.error_message) {
        errorMessage += ` - ${data.error_message}`;
      }
      
      if (data.status === 'REQUEST_DENIED') {
        errorMessage += '. This usually indicates an invalid API key, billing not enabled, or API restrictions. Please check your Google Cloud Console settings.';
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        errorMessage += '. You have exceeded your daily quota or rate limit.';
      } else if (data.status === 'INVALID_REQUEST') {
        errorMessage += '. The request is invalid, usually due to missing required parameters.';
      }
      
      throw new Error(errorMessage);
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