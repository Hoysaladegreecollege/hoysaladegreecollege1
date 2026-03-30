-- Create the student-documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users (staff) to upload to student-documents
CREATE POLICY "Staff can upload student documents storage"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'student-documents'
  AND (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'principal', 'teacher'))
  )
);

-- Allow authenticated users (staff + own students) to read/download from student-documents
CREATE POLICY "Staff and students can read student documents storage"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'principal', 'teacher'))
    OR auth.uid() IN (
      SELECT s.user_id FROM public.students s
      WHERE s.id::text = (storage.foldername(name))[1]
    )
  )
);

-- Allow staff to delete from student-documents
CREATE POLICY "Staff can delete student documents storage"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'student-documents'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'principal', 'teacher'))
);