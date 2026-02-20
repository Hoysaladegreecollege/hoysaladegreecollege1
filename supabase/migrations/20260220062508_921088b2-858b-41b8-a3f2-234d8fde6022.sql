
-- Create popup_banners table for admin CMS
CREATE TABLE IF NOT EXISTS public.popup_banners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text,
  link_url text,
  is_active boolean DEFAULT true,
  posted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.popup_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" ON public.popup_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage banners" ON public.popup_banners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create previous_year_papers table
CREATE TABLE IF NOT EXISTS public.previous_year_papers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  course text NOT NULL,
  subject text NOT NULL,
  year text NOT NULL,
  semester integer,
  file_url text,
  posted_by uuid,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.previous_year_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active papers" ON public.previous_year_papers FOR SELECT USING (is_active = true);
CREATE POLICY "Admin/Principal can manage papers" ON public.previous_year_papers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Create announcements table for real-time teacher-to-student announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  course_id uuid REFERENCES public.courses(id),
  semester integer,
  posted_by uuid,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view announcements" ON public.announcements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers/Admin/Principal can manage announcements" ON public.announcements FOR ALL USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Create fee_payments table for fee management
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id),
  amount numeric NOT NULL DEFAULT 0,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text DEFAULT 'Cash',
  receipt_number text,
  remarks text,
  recorded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage fee payments" ON public.fee_payments FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role)
);
CREATE POLICY "Students can view own fee payments" ON public.fee_payments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
