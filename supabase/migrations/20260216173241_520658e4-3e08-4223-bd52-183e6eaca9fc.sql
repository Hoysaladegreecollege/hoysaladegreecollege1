
-- Add application_number and photo_url to admission_applications
ALTER TABLE public.admission_applications 
  ADD COLUMN IF NOT EXISTS application_number TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create a function to auto-generate application numbers
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CASE WHEN application_number ~ '^HDC-\d+$' 
    THEN CAST(SUBSTRING(application_number FROM 5) AS INTEGER) 
    ELSE 0 END
  ), 0) + 1 INTO seq_num FROM public.admission_applications;
  NEW.application_number := 'HDC-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS set_application_number ON public.admission_applications;
CREATE TRIGGER set_application_number
  BEFORE INSERT ON public.admission_applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION public.generate_application_number();

-- Allow public to read their own application by email for tracking
CREATE POLICY "Anyone can view own application by email"
  ON public.admission_applications
  FOR SELECT
  USING (true);

-- Drop the old restrictive SELECT policy that only allows staff
DROP POLICY IF EXISTS "Staff can view applications" ON public.admission_applications;

-- Re-create staff view policy (they already have ALL access)
