import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface GeoapifyFeature {
  properties: {
    place_id: string;
    name?: string;
    formatted?: string;
    street?: string;
    city?: string;
    country?: string;
    lat: number;
    lon: number;
    categories?: string[];
  };
}

function normalizePlace(feature: GeoapifyFeature) {
  const p = feature.properties;
  return {
    id: p.place_id,
    name: p.name || 'Mosque',
    address: p.formatted || [p.street, p.city, p.country].filter(Boolean).join(', '),
    lat: p.lat,
    lng: p.lon,
    rating: null,
    user_ratings_total: null,
    open_now: null,
    types: ['mosque'],
    photo_ref: null,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let lat: string | null = null;
    let lng: string | null = null;
    let radius = '5000';

    if (req.method === 'GET') {
      const url = new URL(req.url);
      lat = url.searchParams.get('lat');
      lng = url.searchParams.get('lng');
      radius = url.searchParams.get('radius') || '5000';
    } else if (req.method === 'POST') {
      const body = await req.json();
      lat = body.lat?.toString() ?? null;
      lng = body.lng?.toString() ?? null;
      radius = (body.radius || 5000).toString();
    }

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'lat and lng parameters are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const API_KEY = Deno.env.get('GEOAPIFY_API_KEY');
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Geoapify API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const params = new URLSearchParams({
      categories: 'religion.place_of_worship.islam',
      conditions: 'named',
      filter: `circle:${lng},${lat},${radius}`,
      bias: `proximity:${lng},${lat}`,
      limit: '50',
      apiKey: API_KEY,
    });

    const url = `https://api.geoapify.com/v2/places?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Geoapify API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const features: GeoapifyFeature[] = data.features || [];

    // Filter to mosque/islamic places
    const mosqueKeywords = /mosque|masjid|مسجد|mosquée|islam/i;
    const places = features
      .map(normalizePlace)
      .filter(p => {
        const cats = (data.features?.find((f: GeoapifyFeature) => f.properties.place_id === p.id)?.properties.categories || []).join(' ');
        return mosqueKeywords.test(p.name) || mosqueKeywords.test(p.address) || cats.includes('islam');
      });

    return new Response(
      JSON.stringify({ items: places }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
