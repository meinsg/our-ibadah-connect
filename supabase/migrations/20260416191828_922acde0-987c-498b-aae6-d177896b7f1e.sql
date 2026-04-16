UPDATE public.profiles
SET subscription_tier = 'premium',
    subscription_status = 'active',
    is_admin = true
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'sait_in@yahoo.com');