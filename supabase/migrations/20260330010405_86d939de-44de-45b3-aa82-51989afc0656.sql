
-- Create student-documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for student-documents bucket
CREATE POLICY "Staff can upload student documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal') OR public.has_role(auth.uid(), 'teacher'))
);

CREATE POLICY "Staff can view student documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal') OR public.has_role(auth.uid(), 'teacher'))
);

CREATE POLICY "Staff can delete student documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-documents' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal'))
);

CREATE POLICY "Students can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.students WHERE user_id = auth.uid()
  )
);
