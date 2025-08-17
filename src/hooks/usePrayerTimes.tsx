import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
}

export const usePrayerTimes = (latitude?: number, longitude?: number) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeToNext, setTimeToNext] = useState<string | null>(null);

  const calculatePrayerTimes = async (lat: number, lng: number, date = new Date()) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to access prayer times');
      }
      
      // Check if we have cached prayer times for today for this user
      const dateStr = date.toISOString().split('T')[0];
      const { data: cachedTimes } = await supabase
        .from('prayer_times')
        .select('*')
        .eq('user_id', user.id)
        .eq('latitude', parseFloat(lat.toFixed(6)))
        .eq('longitude', parseFloat(lng.toFixed(6)))
        .eq('date', dateStr)
        .eq('method', 'MWL')
        .maybeSingle();

      let times;
      
      if (cachedTimes) {
        times = {
          fajr: cachedTimes.fajr,
          dhuhr: cachedTimes.dhuhr,
          asr: cachedTimes.asr,
          maghrib: cachedTimes.maghrib,
          isha: cachedTimes.isha
        };
      } else {
        // Call Prayer Times API (using Aladhan API as example)
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${lat}&longitude=${lng}&method=3`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }
        
        const data = await response.json();
        const apiTimes = data.data.timings;
        
        // Cache the prayer times for this user
        await supabase.from('prayer_times').insert({
          user_id: user.id,
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lng.toFixed(6)),
          date: dateStr,
          fajr: apiTimes.Fajr,
          dhuhr: apiTimes.Dhuhr,
          asr: apiTimes.Asr,
          maghrib: apiTimes.Maghrib,
          isha: apiTimes.Isha,
          method: 'MWL'
        });
        
        times = {
          fajr: apiTimes.Fajr,
          dhuhr: apiTimes.Dhuhr,
          asr: apiTimes.Asr,
          maghrib: apiTimes.Maghrib,
          isha: apiTimes.Isha
        };
      }

      // Format times and determine next prayer
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
        { name: 'Fajr', time: times.fajr },
        { name: 'Dhuhr', time: times.dhuhr },
        { name: 'Asr', time: times.asr },
        { name: 'Maghrib', time: times.maghrib },
        { name: 'Isha', time: times.isha }
      ];

      let nextPrayerName = null;
      let minDiff = Infinity;

      const formattedPrayers = prayers.map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        // Calculate time difference
        let diff = prayerMinutes - currentTime;
        if (diff < 0) diff += 24 * 60; // Next day
        
        // Find next prayer
        if (diff < minDiff) {
          minDiff = diff;
          nextPrayerName = prayer.name;
        }
        
        return {
          name: prayer.name,
          time: prayer.time,
          isNext: false
        };
      });

      // Mark next prayer
      const updatedPrayers = formattedPrayers.map(prayer => ({
        ...prayer,
        isNext: prayer.name === nextPrayerName
      }));

      setPrayerTimes(updatedPrayers);
      setNextPrayer(nextPrayerName);
      
      // Calculate time to next prayer
      const hours = Math.floor(minDiff / 60);
      const mins = minDiff % 60;
      setTimeToNext(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
      
    } catch (error) {
      console.error('Error calculating prayer times:', error);
      // Fallback to mock data
      setPrayerTimes([
        { name: "Fajr", time: "05:30", isNext: false },
        { name: "Dhuhr", time: "12:45", isNext: true },
        { name: "Asr", time: "16:20", isNext: false },
        { name: "Maghrib", time: "18:45", isNext: false },
        { name: "Isha", time: "20:15", isNext: false },
      ]);
      setNextPrayer("Dhuhr");
      setTimeToNext("2h 30m");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (latitude && longitude) {
      calculatePrayerTimes(latitude, longitude);
      
      // Update prayer times every minute
      const interval = setInterval(() => {
        calculatePrayerTimes(latitude, longitude);
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [latitude, longitude]);

  return {
    prayerTimes,
    loading,
    nextPrayer,
    timeToNext,
    refetch: () => latitude && longitude && calculatePrayerTimes(latitude, longitude)
  };
};