import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Muslim-majority countries by ISO 3166-1 alpha-2 code
const MUSLIM_MAJORITY_COUNTRIES = new Set([
  'AF','AL','AZ','BH','BD','BN','BF','TD','KM','DJ','EG','GM','GN','ID',
  'IR','IQ','JO','KZ','KW','KG','LB','LY','MY','MV','ML','MR','MA','NE',
  'NG','OM','PK','PS','QA','SA','SN','SL','SO','SD','SY','TJ','TN','TR',
  'TM','AE','UZ','YE'
]);

interface GeoapifyFeature {
  properties: {
    place_id: string;
    name?: string;
    formatted?: string;
    street?: string;
    city?: string;
    country?: string;
    country_code?: string;
    lat: number;
    lon: number;
    categories?: string[];
    datasource?: {
      raw?: {
        phone?: string;
        'contact:phone'?: string;
        cuisine?: string;
      };
    };
    contact?: {
      phone?: string;
    };
  };
}

function normalizePlace(feature: GeoapifyFeature, isMuslimRegion: boolean) {
  const p = feature.properties;
  const raw = p.datasource?.raw || {};
  const phone = raw.phone || raw['contact:phone'] || p.contact?.phone || null;

  return {
    id: p.place_id,
    name: p.name || 'Restaurant',
    address: p.formatted || [p.street, p.city, p.country].filter(Boolean).join(', '),
    lat: p.lat,
    lng: p.lon,
    rating: null,
    user_ratings_total: null,
    open_now: null,
    types: ['restaurant', ...(isMuslimRegion ? [] : ['halal'])],
    photo_ref: null,
    phone,
    cuisine: raw.cuisine || null,
  };
}

async function detectCountryCode(lat: string, lng: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&type=country&apiKey=${apiKey}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.features?.[0]?.properties?.country_code?.toUpperCase() || null;
  } catch {
    return null;
  }
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

    // Detect country
    const countryCode = await detectCountryCode(lat, lng, API_KEY);
    const isMuslimRegion = countryCode ? MUSLIM_MAJORITY_COUNTRIES.has(countryCode) : false;

    // Conditional query: Muslim-majority → all restaurants; else → halal filter
    const params = new URLSearchParams({
      categories: 'catering.restaurant,catering.fast_food,catering.cafe',
      filter: `circle:${lng},${lat},${radius}`,
      bias: `proximity:${lng},${lat}`,
      limit: '50',
      apiKey: API_KEY,
    });

    if (!isMuslimRegion) {
      params.set('conditions', 'named,halal');
    } else {
      params.set('conditions', 'named');
    }

    const url = `https://api.geoapify.com/v2/places?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Geoapify API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const features: GeoapifyFeature[] = data.features || [];
    const places = features.map(f => normalizePlace(f, isMuslimRegion));

    // If non-Muslim region and no halal results, do a fallback general search
    let generalPlaces: any[] = [];
    if (!isMuslimRegion && places.length === 0) {
      const fallbackParams = new URLSearchParams({
        categories: 'catering.restaurant,catering.fast_food',
        conditions: 'named',
        filter: `circle:${lng},${lat},${radius}`,
        bias: `proximity:${lng},${lat}`,
        limit: '20',
        apiKey: API_KEY,
      });
      const fallbackUrl = `https://api.geoapify.com/v2/places?${fallbackParams}`;
      const fallbackResp = await fetch(fallbackUrl);
      if (fallbackResp.ok) {
        const fallbackData = await fallbackResp.json();
        generalPlaces = (fallbackData.features || []).map((f: GeoapifyFeature) => ({
          ...normalizePlace(f, false),
          types: ['restaurant', 'unverified'],
        }));
      }
    }

    return new Response(
      JSON.stringify({
        items: places,
        generalItems: generalPlaces,
        isMuslimRegion,
        countryCode,
      }),
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
