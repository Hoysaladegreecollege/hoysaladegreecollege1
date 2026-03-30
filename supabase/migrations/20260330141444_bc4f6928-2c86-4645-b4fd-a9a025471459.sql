
-- 1. Drop the overly permissive "Students can view active students" policy
DROP POLICY IF EXISTS "Students can view active students" ON public.students;

-- 2. Create a safe view for student peer lookups (messaging feature)
CREATE OR REPLACE VIEW public.student_peers AS
SELECT s.id, s.user_id, s.roll_number, s.course_id, s.semester, s.year_level, s.is_active,
       p.full_name, p.avatar_url
FROM public.students s
JOIN public.profiles p ON p.user_id = s.user_id
WHERE s.is_active = true;

-- 3. Restrict principal role management - prevent escalation to admin
DROP POLICY IF EXISTS "Principal can manage roles" ON public.user_roles;

CREATE POLICY "Principal can manage non-admin roles"
  ON public.user_roles
  FOR ALL
  TO public
  USING (
    has_role(auth.uid(), 'principal'::app_role)
    AND role != 'admin'::app_role
  )
  WITH CHECK (
    has_role(auth.uid(), 'principal'::app_role)
    AND role != 'admin'::app_role
  );
