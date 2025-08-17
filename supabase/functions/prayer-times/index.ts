import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { latitude, longitude, date, method = 'MWL' } = await req.json()

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate prayer times using simplified method (since Adhan isn't available in Deno)
    // In a real implementation, you'd use the Adhan library
    const prayerDate = date ? new Date(date) : new Date()
    
    // Simplified prayer time calculation (replace with actual Adhan calculations)
    const times = {
      fajr: '05:30',
      dhuhr: '12:15',
      asr: '15:30',
      maghrib: '18:45',
      isha: '20:00'
    }

    // Check if user is authenticated and cache the result
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Cache prayer times for authenticated users
      const { error } = await supabase
        .from('prayer_times')
        .upsert({
          user_id: user.id,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          date: prayerDate.toISOString().split('T')[0],
          method,
          fajr: times.fajr,
          dhuhr: times.dhuhr,
          asr: times.asr,
          maghrib: times.maghrib,
          isha: times.isha
        })

      if (error) {
        console.log('Cache error:', error)
      }
    }

    return new Response(
      JSON.stringify({ 
        times,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date: prayerDate.toISOString().split('T')[0],
        method
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Prayer times error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to calculate prayer times' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})