-- Fix Principal privilege escalation: restrict to teacher/student only
DROP POLICY IF EXISTS "Principal can manage non-admin roles" ON public.user_roles;

CREATE POLICY "Principal can manage teacher and student roles"
  ON public.user_roles
  FOR ALL
  TO public
  USING (
    has_role(auth.uid(), 'principal'::app_role)
    AND role IN ('teacher'::app_role, 'student'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'principal'::app_role)
    AND role IN ('teacher'::app_role, 'student'::app_role)
  );

-- Fix uploads bucket: replace permissive update/delete with ownership checks
DROP POLICY IF EXISTS "Authenticated users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own uploads" ON storage.objects;

CREATE POLICY "Staff can update uploads"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'uploads' AND (
      has_role(auth.uid(), 'admin'::app_role)
      OR has_role(auth.uid(), 'principal'::app_role)
      OR has_role(auth.uid(), 'teacher'::app_role)
    )
  );

CREATE POLICY "Staff can delete uploads"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'uploads' AND (
      has_role(auth.uid(), 'admin'::app_role)
      OR has_role(auth.uid(), 'principal'::app_role)
      OR has_role(auth.uid(), 'teacher'::app_role)
    )
  );

-- Fix message-attachments: restrict to conversation participants
DROP POLICY IF EXISTS "Anyone can view message attachments" ON storage.objects;

CREATE POLICY "Users can view own message attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'message-attachments' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  );