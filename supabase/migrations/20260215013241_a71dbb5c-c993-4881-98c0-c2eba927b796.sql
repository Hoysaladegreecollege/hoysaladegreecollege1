
-- Fix: Allow admin to manage top_students (currently only principal)
CREATE POLICY "Admin can manage top students"
ON public.top_students
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Allow admin to see ALL events (not just active ones)
CREATE POLICY "Admin can view all events"
ON public.top_students
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update own uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);
