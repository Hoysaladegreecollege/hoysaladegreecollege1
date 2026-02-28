
-- Create a private bucket for admission photos
INSERT INTO storage.buckets (id, name, public) VALUES ('admission-photos', 'admission-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload admission photos (public form)
CREATE POLICY "Anyone can upload admission photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'admission-photos');

-- Only admin/principal can view admission photos
CREATE POLICY "Staff can view admission photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'admission-photos' AND
  (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'principal'::public.app_role))
);

-- Staff can delete admission photos
CREATE POLICY "Staff can delete admission photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'admission-photos' AND
  (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'principal'::public.app_role))
);
