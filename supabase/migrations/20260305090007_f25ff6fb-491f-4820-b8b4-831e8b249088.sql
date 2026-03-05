CREATE TABLE public.admission_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code text NOT NULL UNIQUE,
  total_seats integer NOT NULL DEFAULT 60,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admission_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seats" ON public.admission_seats FOR SELECT USING (true);
CREATE POLICY "Admin can manage seats" ON public.admission_seats FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.admission_seats (course_code, total_seats) VALUES
  ('BCA', 60),
  ('BCOM', 120),
  ('BCOM_PROF', 60),
  ('BBA', 60);