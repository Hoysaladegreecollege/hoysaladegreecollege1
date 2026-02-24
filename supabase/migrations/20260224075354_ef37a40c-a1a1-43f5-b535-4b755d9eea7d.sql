
-- Birthday settings table for admin to customize birthday wishes
CREATE TABLE public.birthday_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  principal_name text NOT NULL DEFAULT 'Sri Gopal H.R',
  wishes_message text NOT NULL DEFAULT 'On behalf of the entire Hoysala Degree College family and our Principal, we wish you a wonderful birthday filled with joy, success, and happiness. May this special day bring you closer to your dreams and aspirations.',
  quote text NOT NULL DEFAULT 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.birthday_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view birthday settings"
ON public.birthday_settings FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin/Principal can manage birthday settings"
ON public.birthday_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Insert default row
INSERT INTO public.birthday_settings (principal_name, wishes_message, quote) VALUES (
  'Sri Gopal H.R',
  'On behalf of the entire Hoysala Degree College family and our Principal, we wish you a wonderful birthday filled with joy, success, and happiness. May this special day bring you closer to your dreams and aspirations.',
  'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.'
);

-- Gallery images table for admin to upload gallery images
CREATE TABLE public.gallery_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'Campus',
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  posted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gallery images"
ON public.gallery_images FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin/Principal can manage gallery images"
ON public.gallery_images FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));
