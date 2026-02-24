
-- Fix 1: Replace overly permissive admission_applications SELECT policy with secure RPC
DROP POLICY IF EXISTS "Anyone can view own application by email" ON public.admission_applications;

-- Create secure lookup RPC that validates both app number AND email server-side
CREATE OR REPLACE FUNCTION public.get_application_status(
  _app_number TEXT,
  _email TEXT
)
RETURNS SETOF admission_applications
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT *
  FROM admission_applications
  WHERE application_number = _app_number
    AND LOWER(email) = LOWER(_email)
  LIMIT 1;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_application_status TO anon;
GRANT EXECUTE ON FUNCTION public.get_application_status TO authenticated;

-- Fix 2: Add staff SELECT policy so admins can still view applications
CREATE POLICY "Staff can view all applications"
  ON public.admission_applications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));
