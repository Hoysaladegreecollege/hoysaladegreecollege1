
-- Fix 1: Restrict UPDATE/DELETE on uploads bucket to file owners only
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

CREATE POLICY "Users can update own files in uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads' AND auth.uid() = owner);

CREATE POLICY "Users can delete own files in uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads' AND auth.uid() = owner);

-- Fix 2: Replace race-prone application number generation with a sequence
CREATE SEQUENCE IF NOT EXISTS public.admission_app_seq;

-- Set sequence to current max to avoid conflicts
DO $$
DECLARE
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CASE WHEN application_number ~ '^HDC-\d+$'
    THEN CAST(SUBSTRING(application_number FROM 5) AS INTEGER)
    ELSE 0 END
  ), 0) INTO max_num FROM public.admission_applications;
  
  IF max_num > 0 THEN
    PERFORM setval('public.admission_app_seq', max_num);
  END IF;
END $$;

-- Replace the trigger function with sequence-based version
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.application_number := 'HDC-' || LPAD(nextval('public.admission_app_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
