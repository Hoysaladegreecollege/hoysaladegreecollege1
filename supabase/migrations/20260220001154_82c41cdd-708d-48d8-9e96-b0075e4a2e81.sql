
CREATE TABLE IF NOT EXISTS public.faculty_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  qualification text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  subjects text[] DEFAULT '{}',
  photo_url text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  posted_by uuid
);

ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active faculty"
ON public.faculty_members FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin can manage faculty"
ON public.faculty_members FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Principal can manage faculty"
ON public.faculty_members FOR ALL
USING (has_role(auth.uid(), 'principal'::app_role));
