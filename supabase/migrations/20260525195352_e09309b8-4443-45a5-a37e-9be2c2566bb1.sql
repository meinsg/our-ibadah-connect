ALTER TYPE public.consent_category ADD VALUE IF NOT EXISTS 'ad_storage';
ALTER TYPE public.consent_category ADD VALUE IF NOT EXISTS 'ad_user_data';
ALTER TYPE public.consent_category ADD VALUE IF NOT EXISTS 'ad_personalization';