import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const text = url.searchParams.get("text");
    const type = url.searchParams.get("type") || "autocomplete"; // autocomplete | search

    if (!text || text.length < 2) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEOAPIFY_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEOAPIFY_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const endpoint = type === "search"
      ? `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&limit=1&apiKey=${apiKey}`
      : `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=5&type=city&apiKey=${apiKey}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Geoapify returned ${response.status}`);
    }

    const data = await response.json();

    const results = (data.features || []).map((f: any) => ({
      formatted: f.properties.formatted,
      city: f.properties.city || f.properties.name,
      country: f.properties.country,
      lat: f.properties.lat,
      lon: f.properties.lon,
    }));

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
