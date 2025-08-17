import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClipboardList, MapPin, Home, Clock, AlertCircle } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type PrayerStatus = 'on_time' | 'delayed' | 'qada';
type LocationType = 'home' | 'masjid';

interface PrayerLog {
  prayer: string;
  status: PrayerStatus;
  delayMinutes?: number;
  locationType: LocationType;
}

const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

// Simplified geohash calculation for 5-character precision
const calculateGeohash5 = (lat: number, lng: number): string => {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let latRange = [-90.0, 90.0];
  let lngRange = [-180.0, 180.0];
  let geohash = '';
  let bitCount = 0;
  let currentBits = 0;
  let isLng = true;

  for (let i = 0; i < 25; i++) { // 5 chars * 5 bits each = 25 bits
    let mid: number;
    if (isLng) {
      mid = (lngRange[0] + lngRange[1]) / 2;
      if (lng >= mid) {
        currentBits = (currentBits << 1) | 1;
        lngRange[0] = mid;
      } else {
        currentBits = currentBits << 1;
        lngRange[1] = mid;
      }
    } else {
      mid = (latRange[0] + latRange[1]) / 2;
      if (lat >= mid) {
        currentBits = (currentBits << 1) | 1;
        latRange[0] = mid;
      } else {
        currentBits = currentBits << 1;
        latRange[1] = mid;
      }
    }

    isLng = !isLng;
    bitCount++;

    if (bitCount === 5) {
      geohash += base32[currentBits];
      currentBits = 0;
      bitCount = 0;
    }
  }

  return geohash;
};

const PrayerTracker = () => {
  const { user } = useAuth();
  const { location } = useLocation();
  const { toast } = useToast();
  const [logs, setLogs] = useState<Record<string, PrayerLog>>(
    prayers.reduce((acc, prayer) => ({
      ...acc,
      [prayer]: { prayer, status: 'on_time', locationType: 'home' }
    }), {})
  );
  const [saving, setSaving] = useState(false);

  const updateLog = (prayer: string, field: keyof PrayerLog, value: any) => {
    setLogs(prev => ({
      ...prev,
      [prayer]: { ...prev[prayer], [field]: value }
    }));
  };

  const handleSaveAll = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please allow location access to save prayer logs.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    let success = 0;
    let failures = 0;

    for (const prayerLog of Object.values(logs)) {
      try {
        // Calculate geohash5 for privacy
        const geohash5 = calculateGeohash5(location.latitude, location.longitude);
        
        const { error } = await supabase
          .from('prayer_logs')
          .insert({
            user_id: user?.id || null,
            prayer: prayerLog.prayer,
            status: prayerLog.status,
            delay_minutes: prayerLog.status === 'delayed' ? prayerLog.delayMinutes : null,
            location_type: prayerLog.locationType,
            latitude: location.latitude,
            longitude: location.longitude,
            geohash5,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
          });

        if (error) throw error;
        success++;
      } catch (error) {
        console.error('Failed to save prayer log:', error);
        failures++;
      }
    }

    setSaving(false);
    
    if (success > 0) {
      toast({
        title: "Prayers Logged",
        description: `Successfully saved ${success} prayer${success > 1 ? 's' : ''}${failures > 0 ? `, ${failures} failed` : ''}.`,
      });
    } else {
      toast({
        title: "Save Failed", 
        description: "Failed to save prayer logs. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-card border-accent">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Prayer Tracker</h2>
        <Badge variant="secondary">Private</Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Log today's obligatory prayers. Choose whether you prayed in time, delayed, or qada, and where.
      </p>

      {!user && (
        <div className="mb-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gold-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Privacy: Stored anonymously for guests. Sign in for personal analytics.</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {prayers.map((prayer) => (
          <Card key={prayer} className="p-4 bg-accent/30">
            <h3 className="font-medium text-foreground mb-3 capitalize">{prayer}</h3>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Status</Label>
                <RadioGroup
                  value={logs[prayer].status}
                  onValueChange={(value) => updateLog(prayer, 'status', value as PrayerStatus)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="on_time" id={`${prayer}-on-time`} />
                    <Label htmlFor={`${prayer}-on-time`} className="text-sm">In time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delayed" id={`${prayer}-delayed`} />
                    <Label htmlFor={`${prayer}-delayed`} className="text-sm">Delayed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="qada" id={`${prayer}-qada`} />
                    <Label htmlFor={`${prayer}-qada`} className="text-sm">Qada</Label>
                  </div>
                </RadioGroup>
              </div>

              {logs[prayer].status === 'delayed' && (
                <div>
                  <Label className="text-sm font-medium mb-1 block">Delayed by (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="600"
                    value={logs[prayer].delayMinutes || 15}
                    onChange={(e) => updateLog(prayer, 'delayMinutes', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">Location</Label>
                <RadioGroup
                  value={logs[prayer].locationType}
                  onValueChange={(value) => updateLog(prayer, 'locationType', value as LocationType)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id={`${prayer}-home`} />
                    <Label htmlFor={`${prayer}-home`} className="text-sm flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Home
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masjid" id={`${prayer}-masjid`} />
                    <Label htmlFor={`${prayer}-masjid`} className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Masjid
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>
            {location 
              ? `${location.city || 'Unknown'}, ${location.country || 'Unknown'}`
              : 'Location required'
            }
          </span>
        </div>
        
        <Button 
          onClick={handleSaveAll}
          disabled={saving || !location}
          className="gap-2"
        >
          <Clock className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Today\'s Prayers'}
        </Button>
      </div>
    </Card>
  );
};

export default PrayerTracker;