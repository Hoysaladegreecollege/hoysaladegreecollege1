-- Fix activity_logs INSERT policy: bind user_id to authenticated user to prevent audit trail forgery
DROP POLICY IF EXISTS "Staff can insert activity logs" ON public.activity_logs;

CREATE POLICY "Staff can insert activity logs"
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (has_role(auth.uid(), 'admin'::app_role) OR
     has_role(auth.uid(), 'principal'::app_role) OR
     has_role(auth.uid(), 'teacher'::app_role))
    AND auth.uid() = user_id
  );