-- Allow students to view teacher profiles for messaging
CREATE POLICY "Students can view teacher profiles" ON public.profiles
FOR SELECT TO authenticated
USING (
  user_id IN (SELECT t.user_id FROM public.teachers t WHERE t.is_active = true)
  AND public.has_role(auth.uid(), 'student'::app_role)
);