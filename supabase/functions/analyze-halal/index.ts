import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { names } = await req.json();

    if (!names || !Array.isArray(names) || names.length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Fallback: simple keyword heuristic if no AI key
      const results = names.map((name: string) => {
        const lower = name.toLowerCase();
        const halalKeywords = ['halal', 'zabihah', 'al-', 'al ', 'noor', 'madina', 'madinah', 'medina',
          'makkah', 'mecca', 'islamic', 'muslim', 'quran', 'sunnah', 'bismillah', 'barakah',
          'ummah', 'sultan', 'sheikh', 'imam', 'masjid', 'deen', 'taqwa', 'iman', 'jannah',
          'kebab', 'shawarma', 'biryani', 'tandoori', 'karahi', 'nihari'];
        const likely = halalKeywords.some(kw => lower.includes(kw));
        return { name, likelyHalal: likely, confidence: likely ? 'medium' : 'low' };
      });
      return new Response(
        JSON.stringify({ results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to analyze names
    const prompt = `Analyze these restaurant names and determine if each is likely a Halal restaurant based on the name alone. Consider cultural, linguistic, and religious indicators (Arabic names, Islamic references, South Asian cuisine names, Middle Eastern food terms, etc.).

Restaurant names:
${names.map((n: string, i: number) => `${i + 1}. ${n}`).join('\n')}

For each restaurant, respond with a JSON array of objects with: name, likelyHalal (boolean), confidence ("high", "medium", "low").`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a halal food expert. Analyze restaurant names and determine likelihood of being halal. Return ONLY a valid JSON array." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "classify_restaurants",
            description: "Classify restaurants by halal likelihood based on name",
            parameters: {
              type: "object",
              properties: {
                results: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      likelyHalal: { type: "boolean" },
                      confidence: { type: "string", enum: ["high", "medium", "low"] }
                    },
                    required: ["name", "likelyHalal", "confidence"],
                    additionalProperties: false
                  }
                }
              },
              required: ["results"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "classify_restaurants" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 402) {
        // Fallback to keyword heuristic on rate limit / no credits
        const results = names.map((name: string) => {
          const lower = name.toLowerCase();
          const likely = ['al-', 'al ', 'noor', 'madina', 'kebab', 'shawarma', 'halal', 'biryani'].some(kw => lower.includes(kw));
          return { name, likelyHalal: likely, confidence: likely ? 'medium' : 'low' };
        });
        return new Response(
          JSON.stringify({ results, fallback: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({ results: parsed.results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback
    return new Response(
      JSON.stringify({ results: names.map((n: string) => ({ name: n, likelyHalal: false, confidence: 'low' })) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("analyze-halal error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
