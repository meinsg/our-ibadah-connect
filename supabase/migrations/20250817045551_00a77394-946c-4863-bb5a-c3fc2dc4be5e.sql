-- Add user_id column to prayer_times table for user association
ALTER TABLE public.prayer_times 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to be owned by a system user (or we could delete them)
-- For safety, we'll delete existing records since they don't have user association
DELETE FROM public.prayer_times;

-- Make user_id required for new records
ALTER TABLE public.prayer_times 
ALTER COLUMN user_id SET NOT NULL;

-- Drop the existing public read policy
DROP POLICY "Prayer times are readable by everyone" ON public.prayer_times;

-- Create new user-specific policies
CREATE POLICY "Users can view their own prayer times" 
ON public.prayer_times 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer times" 
ON public.prayer_times 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer times" 
ON public.prayer_times 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer times" 
ON public.prayer_times 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add index for better performance on user queries
CREATE INDEX idx_prayer_times_user_id ON public.prayer_times(user_id);
CREATE INDEX idx_prayer_times_user_date ON public.prayer_times(user_id, date);