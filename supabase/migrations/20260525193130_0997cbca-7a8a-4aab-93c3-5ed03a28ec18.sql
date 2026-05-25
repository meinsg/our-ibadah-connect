ALTER TABLE public.consent_records
ADD COLUMN IF NOT EXISTS region text;

CREATE INDEX IF NOT EXISTS idx_consent_records_region ON public.consent_records(region);