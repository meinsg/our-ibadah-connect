import { Card } from "@/components/ui/card";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

const PrayerTimes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { location, loading: locationLoading, refetch: refetchLocation } = useLocation();
  const { prayerTimes, loading: prayerLoading, nextPrayer, timeToNext, refetch: refetchPrayer } = usePrayerTimes(
    location?.latitude,
    location?.longitude
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    refetchLocation();
    refetchPrayer();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const locationText = locationLoading 
    ? "Getting location..." 
    : location 
      ? `${location.city || 'Unknown City'}, ${location.country || 'Unknown Country'}`
      : "Location unavailable";

  return (
    <Card className="p-6 shadow-prayer bg-spiritual border-accent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground font-inter">Prayer Times</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={locationLoading || prayerLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${(locationLoading || prayerLoading) ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{locationText}</span>
      </div>

      <div className="space-y-3">
        {prayerTimes.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              prayer.isNext
                ? 'bg-gradient-spiritual text-primary-foreground shadow-soft'
                : 'bg-accent/50 text-foreground'
            }`}
          >
            <span className={`font-medium font-inter ${prayer.isNext ? 'font-semibold' : ''}`}>
              {prayer.name}
            </span>
            <span className={`font-inter ${prayer.isNext ? 'font-bold text-lg' : 'text-muted-foreground'}`}>
              {prayer.time}
            </span>
          </div>
        ))}
      </div>

      {nextPrayer && timeToNext && (
        <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
          <p className="text-center text-sm text-gold-foreground font-inter">
            Next prayer: <span className="font-semibold">{nextPrayer}</span> in {timeToNext}
          </p>
        </div>
      )}
    </Card>
  );
};

export default PrayerTimes;