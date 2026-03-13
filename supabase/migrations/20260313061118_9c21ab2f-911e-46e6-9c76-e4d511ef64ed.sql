-- Allow students to view other student profiles (for peer messaging)
CREATE POLICY "Students can view student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'student'::app_role)
  AND user_id IN (SELECT s.user_id FROM students s WHERE s.is_active = true)
);

-- Allow students to view active student records (for peer messaging contact list)
CREATE POLICY "Students can view active students"
ON public.students
FOR SELECT
TO authenticated
USING (is_active = true AND has_role(auth.uid(), 'student'::app_role));