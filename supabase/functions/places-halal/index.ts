import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function normalizePlace(el: OverpassElement) {
  const lat = el.lat ?? el.center?.lat ?? 0;
  const lon = el.lon ?? el.center?.lon ?? 0;
  const tags = el.tags || {};
  return {
    id: `osm-${el.id}`,
    name: tags.name || tags['name:en'] || tags['name:ar'] || 'Halal Restaurant',
    address: [tags['addr:street'], tags['addr:city'], tags['addr:country']].filter(Boolean).join(', ') || tags.address || '',
    lat,
    lng: lon,
    rating: null,
    user_ratings_total: null,
    open_now: null,
    types: ['restaurant', 'halal'],
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

    // Overpass QL: find restaurants/food places tagged halal
    const query = `
      [out:json][timeout:25];
      (
        nwr["cuisine"~"halal",i](around:${radius},${lat},${lng});
        nwr["diet:halal"="yes"](around:${radius},${lat},${lng});
        nwr["name"~"halal",i]["amenity"~"restaurant|fast_food|cafe"](around:${radius},${lat},${lng});
      );
      out center body;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    const elements: OverpassElement[] = data.elements || [];

    const seen = new Set<number>();
    const unique = elements.filter(el => {
      if (seen.has(el.id)) return false;
      seen.add(el.id);
      return true;
    });

    const places = unique.map(normalizePlace).filter(p => p.lat !== 0 && p.lng !== 0);

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
