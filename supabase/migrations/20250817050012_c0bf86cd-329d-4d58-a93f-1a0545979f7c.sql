-- Check if user_id column exists and is nullable
-- First make the column NOT NULL if it's currently nullable
-- But first we need to handle any existing NULL values

-- Delete any records without user_id (orphaned records)
DELETE FROM public.prayer_times WHERE user_id IS NULL;

-- Make user_id required if it's currently nullable
DO $$ 
BEGIN
    -- Check if column is nullable and make it NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'prayer_times' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.prayer_times ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- Drop the existing public read policy if it exists
DROP POLICY IF EXISTS "Prayer times are readable by everyone" ON public.prayer_times;

-- Drop the old insert policy since we'll replace it
DROP POLICY IF EXISTS "Authenticated users can insert prayer times" ON public.prayer_times;

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

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_prayer_times_user_id ON public.prayer_times(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_times_user_date ON public.prayer_times(user_id, date);