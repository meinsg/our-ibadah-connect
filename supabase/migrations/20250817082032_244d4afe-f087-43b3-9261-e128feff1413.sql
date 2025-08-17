-- Create prayer logs table for tracking user prayers
CREATE TABLE public.prayer_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer TEXT NOT NULL CHECK (prayer IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  status TEXT NOT NULL CHECK (status IN ('on_time', 'delayed', 'qada')),
  delay_minutes INTEGER CHECK (delay_minutes >= 0 AND delay_minutes <= 600),
  location_type TEXT NOT NULL CHECK (location_type IN ('home', 'masjid')),
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  geohash5 TEXT NOT NULL, -- 5-character geohash for privacy (~few km precision)
  timezone TEXT NOT NULL DEFAULT 'UTC',
  planned_time TIMESTAMP WITH TIME ZONE,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_iso DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prayer_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prayer_logs
CREATE POLICY "Users can view their own prayer logs" 
ON public.prayer_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer logs" 
ON public.prayer_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer logs" 
ON public.prayer_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer logs" 
ON public.prayer_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_prayer_logs_user_id ON public.prayer_logs(user_id);
CREATE INDEX idx_prayer_logs_date_iso ON public.prayer_logs(date_iso);
CREATE INDEX idx_prayer_logs_geohash5 ON public.prayer_logs(geohash5);
CREATE INDEX idx_prayer_logs_logged_at ON public.prayer_logs(logged_at);

-- Function to calculate geohash (simplified version for 5-char precision)
CREATE OR REPLACE FUNCTION public.calculate_geohash5(lat NUMERIC, lng NUMERIC)
RETURNS TEXT AS $$
DECLARE
  base32 TEXT := '0123456789bcdefghjkmnpqrstuvwxyz';
  lat_range NUMERIC[] := ARRAY[-90.0, 90.0];
  lng_range NUMERIC[] := ARRAY[-180.0, 180.0];
  geohash TEXT := '';
  bit_count INTEGER := 0;
  current_bits INTEGER := 0;
  is_lng BOOLEAN := TRUE;
  mid NUMERIC;
  i INTEGER;
BEGIN
  FOR i IN 1..25 LOOP -- 5 chars * 5 bits each = 25 bits
    IF is_lng THEN
      mid := (lng_range[1] + lng_range[2]) / 2;
      IF lng >= mid THEN
        current_bits := (current_bits << 1) | 1;
        lng_range[1] := mid;
      ELSE
        current_bits := current_bits << 1;
        lng_range[2] := mid;
      END IF;
    ELSE
      mid := (lat_range[1] + lat_range[2]) / 2;
      IF lat >= mid THEN
        current_bits := (current_bits << 1) | 1;
        lat_range[1] := mid;
      ELSE
        current_bits := current_bits << 1;
        lat_range[2] := mid;
      END IF;
    END IF;
    
    is_lng := NOT is_lng;
    bit_count := bit_count + 1;
    
    IF bit_count = 5 THEN
      geohash := geohash || substr(base32, current_bits + 1, 1);
      current_bits := 0;
      bit_count := 0;
    END IF;
  END LOOP;
  
  RETURN geohash;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function to auto-calculate geohash
CREATE OR REPLACE FUNCTION public.update_prayer_log_geohash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.geohash5 := public.calculate_geohash5(NEW.latitude, NEW.longitude);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate geohash on insert/update
CREATE TRIGGER trigger_update_prayer_log_geohash
  BEFORE INSERT OR UPDATE ON public.prayer_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_prayer_log_geohash();