
-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view contact submissions" ON public.contact_submissions
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

CREATE POLICY "Staff can update contact submissions" ON public.contact_submissions
FOR UPDATE USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

CREATE POLICY "Admin can delete contact submissions" ON public.contact_submissions
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Timetable system
CREATE TABLE public.timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  course_id uuid REFERENCES public.courses(id),
  semester integer DEFAULT 1,
  day_of_week text NOT NULL,
  period text NOT NULL,
  subject text NOT NULL,
  teacher_name text DEFAULT '',
  room text DEFAULT '',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view timetables" ON public.timetables
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage timetables" ON public.timetables
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);
