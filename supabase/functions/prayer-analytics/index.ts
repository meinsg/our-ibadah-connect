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

    const url = new URL(req.url)
    const days = Math.max(7, Math.min(365, Number(url.searchParams.get('days')) || 30))
    const aggregateType = url.searchParams.get('type') || 'personal'
    const latitude = url.searchParams.get('latitude')
    const longitude = url.searchParams.get('longitude')

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && aggregateType === 'personal') {
      return new Response(
        JSON.stringify({ error: 'Authentication required for personal analytics' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    if (aggregateType === 'personal') {
      // Personal analytics
      const { data: logs, error } = await supabase
        .from('prayer_logs')
        .select('*')
        .eq('user_id', user!.id)
        .gte('logged_at', startDate.toISOString())
        .order('logged_at', { ascending: true })

      if (error) {
        console.error('Query error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch analytics' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Process personal analytics
      const byDay: Record<string, any> = {}
      const perPrayer = {
        fajr: { on_time: 0, delayed: 0, qada: 0 },
        dhuhr: { on_time: 0, delayed: 0, qada: 0 },
        asr: { on_time: 0, delayed: 0, qada: 0 },
        maghrib: { on_time: 0, delayed: 0, qada: 0 },
        isha: { on_time: 0, delayed: 0, qada: 0 }
      }

      logs?.forEach(log => {
        const dateKey = log.date_iso
        if (!byDay[dateKey]) {
          byDay[dateKey] = {
            date: dateKey,
            counts: { on_time: 0, delayed: 0, qada: 0 }
          }
        }
        byDay[dateKey].counts[log.status]++
        perPrayer[log.prayer as keyof typeof perPrayer][log.status as keyof typeof perPrayer.fajr]++
      })

      const series = Object.values(byDay).sort((a: any, b: any) => a.date.localeCompare(b.date))
      const overall = {
        total: logs?.length || 0,
        on_time: logs?.filter(l => l.status === 'on_time').length || 0,
        delayed: logs?.filter(l => l.status === 'delayed').length || 0,
        qada: logs?.filter(l => l.status === 'qada').length || 0,
        avgDelayMin: Math.round(
          (logs?.filter(l => l.delay_minutes).reduce((sum, l) => sum + (l.delay_minutes || 0), 0) || 0) /
          (logs?.filter(l => l.delay_minutes).length || 1)
        ),
        location: {
          home: logs?.filter(l => l.location_type === 'home').length || 0,
          masjid: logs?.filter(l => l.location_type === 'masjid').length || 0
        }
      }

      return new Response(
        JSON.stringify({ 
          days, 
          series, 
          overall, 
          perPrayerSummary: perPrayer,
          type: 'personal'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (aggregateType === 'aggregate' && latitude && longitude) {
      // Local area aggregate with k-anonymity
      const geohash5 = calculateGeohash5(parseFloat(latitude), parseFloat(longitude))
      
      const { data: logs, error } = await supabase
        .from('prayer_logs')
        .select('status, delay_minutes, prayer')
        .eq('geohash5', geohash5)
        .gte('logged_at', startDate.toISOString())

      if (error) {
        console.error('Aggregate query error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch aggregate data' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const k = logs?.length || 0
      
      // K-anonymity: only show if k >= 20
      if (k < 20) {
        return new Response(
          JSON.stringify({ 
            ok: true, 
            note: 'Not enough local data to show aggregate (k<20).', 
            k,
            type: 'aggregate'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const aggregate = {
        k,
        on_time: logs?.filter(l => l.status === 'on_time').length || 0,
        delayed: logs?.filter(l => l.status === 'delayed').length || 0,
        qada: logs?.filter(l => l.status === 'qada').length || 0,
        avgDelayMin: Math.round(
          (logs?.filter(l => l.delay_minutes).reduce((sum, l) => sum + (l.delay_minutes || 0), 0) || 0) /
          (logs?.filter(l => l.delay_minutes).length || 1)
        ),
        perPrayer: {} as Record<string, any>
      }

      // Per-prayer breakdown
      const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
      prayers.forEach(prayer => {
        const prayerLogs = logs?.filter(l => l.prayer === prayer) || []
        aggregate.perPrayer[prayer] = {
          on_time: prayerLogs.filter(l => l.status === 'on_time').length,
          delayed: prayerLogs.filter(l => l.status === 'delayed').length,
          qada: prayerLogs.filter(l => l.status === 'qada').length
        }
      })

      return new Response(
        JSON.stringify({ ...aggregate, type: 'aggregate' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request parameters' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate analytics' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Simplified geohash calculation for 5-character precision
function calculateGeohash5(lat: number, lng: number): string {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
  let latRange = [-90.0, 90.0]
  let lngRange = [-180.0, 180.0]
  let geohash = ''
  let bitCount = 0
  let currentBits = 0
  let isLng = true

  for (let i = 0; i < 25; i++) { // 5 chars * 5 bits each = 25 bits
    let mid: number
    if (isLng) {
      mid = (lngRange[0] + lngRange[1]) / 2
      if (lng >= mid) {
        currentBits = (currentBits << 1) | 1
        lngRange[0] = mid
      } else {
        currentBits = currentBits << 1
        lngRange[1] = mid
      }
    } else {
      mid = (latRange[0] + latRange[1]) / 2
      if (lat >= mid) {
        currentBits = (currentBits << 1) | 1
        latRange[0] = mid
      } else {
        currentBits = currentBits << 1
        latRange[1] = mid
      }
    }

    isLng = !isLng
    bitCount++

    if (bitCount === 5) {
      geohash += base32[currentBits]
      currentBits = 0
      bitCount = 0
    }
  }

  return geohash
}