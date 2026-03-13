CREATE POLICY "Teachers can view active teachers"
ON public.teachers FOR SELECT
TO authenticated
USING (is_active = true AND has_role(auth.uid(), 'teacher'::app_role));