
-- Create pending admin requests table
CREATE TABLE public.pending_admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  otp_code TEXT,
  otp_expires_at TIMESTAMPTZ,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejected_by UUID,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pending_admin_requests ENABLE ROW LEVEL SECURITY;

-- Only admins can view pending requests
CREATE POLICY "Admins can view admin requests"
ON public.pending_admin_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can create requests
CREATE POLICY "Admins can create admin requests"
ON public.pending_admin_requests
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update requests (approve/reject)
CREATE POLICY "Admins can update admin requests"
ON public.pending_admin_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete requests
CREATE POLICY "Admins can delete admin requests"
ON public.pending_admin_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update the validate_role_assignment function to allow admin if an approved request exists
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.role = 'admin' THEN
    -- Allow if user email is the original super admin
    IF EXISTS (
      SELECT 1 FROM auth.users WHERE id = NEW.user_id AND email = 'pavanaofficial05@gmail.com'
    ) THEN
      RETURN NEW;
    END IF;

    -- Allow if there is an approved pending_admin_request for this email
    IF EXISTS (
      SELECT 1 FROM public.pending_admin_requests par
      JOIN auth.users au ON au.id = NEW.user_id
      WHERE par.email = au.email
        AND par.status = 'approved'
    ) THEN
      RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Admin role requires an approved admin request';
  END IF;
  
  RETURN NEW;
END;
$function$;
