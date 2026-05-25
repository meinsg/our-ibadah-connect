-- Consent category enum
CREATE TYPE public.consent_category AS ENUM (
  'account_service',
  'analytics',
  'marketing',
  'personalization',
  'cookies'
);

CREATE TYPE public.consent_status AS ENUM ('granted', 'denied', 'withdrawn');

CREATE TABLE public.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id text,
  category public.consent_category NOT NULL,
  status public.consent_status NOT NULL,
  consent_version text NOT NULL,
  consent_text text NOT NULL,
  source text NOT NULL DEFAULT 'settings',
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_consent_records_user_id ON public.consent_records(user_id);
CREATE INDEX idx_consent_records_category ON public.consent_records(category);
CREATE INDEX idx_consent_records_created_at ON public.consent_records(created_at DESC);

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Users can view their own consent records
CREATE POLICY "Users view own consent records"
ON public.consent_records FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own consent records
CREATE POLICY "Users insert own consent records"
ON public.consent_records FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all consent records
CREATE POLICY "Admins view all consent records"
ON public.consent_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
  )
);

-- No update / delete policies => immutable audit log

-- Helper function: get current consent status per category for a user
CREATE OR REPLACE FUNCTION public.get_current_consents(_user_id uuid)
RETURNS TABLE(category public.consent_category, status public.consent_status, consent_version text, updated_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT ON (category)
    category, status, consent_version, created_at AS updated_at
  FROM public.consent_records
  WHERE user_id = _user_id
  ORDER BY category, created_at DESC;
$$;