-- Remove the old policy that allows public reading
DROP POLICY IF EXISTS "Authenticated users can insert prayer times" ON public.prayer_times;