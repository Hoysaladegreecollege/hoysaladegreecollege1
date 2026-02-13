
-- Admission applications table
CREATE TABLE public.admission_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date,
  gender text,
  course text NOT NULL,
  father_name text,
  mother_name text,
  address text,
  previous_school text,
  percentage_12th text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid,
  review_notes text
);

ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (public form)
CREATE POLICY "Anyone can submit application"
ON public.admission_applications FOR INSERT
WITH CHECK (true);

-- Only admin/principal can view applications
CREATE POLICY "Staff can view applications"
ON public.admission_applications FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Only admin/principal can update applications
CREATE POLICY "Staff can update applications"
ON public.admission_applications FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));
