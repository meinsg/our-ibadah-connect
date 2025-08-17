import { Card } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
}

const PrayerTimes = () => {
  const [location, setLocation] = useState("Getting location...");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock prayer times - in real app, this would come from an API
  const prayerTimes: PrayerTime[] = [
    { name: "Fajr", time: "05:30", isNext: false },
    { name: "Dhuhr", time: "12:45", isNext: true },
    { name: "Asr", time: "16:20", isNext: false },
    { name: "Maghrib", time: "18:45", isNext: false },
    { name: "Isha", time: "20:15", isNext: false },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mock location update
    setTimeout(() => {
      setLocation("Riyadh, Saudi Arabia");
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6 shadow-prayer bg-spiritual border-accent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground font-inter">Prayer Times</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
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

      {prayerTimes.some(p => p.isNext) && (
        <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
          <p className="text-center text-sm text-gold-foreground font-inter">
            Next prayer: <span className="font-semibold">Dhuhr</span> in 2h 30m
          </p>
        </div>
      )}
    </Card>
  );
};

export default PrayerTimes;