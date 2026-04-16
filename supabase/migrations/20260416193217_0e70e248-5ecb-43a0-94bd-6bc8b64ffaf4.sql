-- Demote current admin
UPDATE public.profiles
SET is_admin = false
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'sait_in@yahoo.com');

-- Auto-promote info@ouribadah.com when their profile is created
CREATE OR REPLACE FUNCTION public.auto_promote_primary_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = NEW.user_id AND email = 'info@ouribadah.com'
  ) THEN
    NEW.is_admin := true;
    NEW.subscription_tier := 'premium';
    NEW.subscription_status := 'active';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_promote_primary_admin_trigger ON public.profiles;
CREATE TRIGGER auto_promote_primary_admin_trigger
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_promote_primary_admin();

-- In case the profile already exists (edge case), promote it now
UPDATE public.profiles
SET is_admin = true, subscription_tier = 'premium', subscription_status = 'active'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'info@ouribadah.com');