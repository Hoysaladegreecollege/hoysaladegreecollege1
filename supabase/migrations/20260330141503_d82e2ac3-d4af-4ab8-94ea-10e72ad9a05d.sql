
-- Fix the view to use SECURITY INVOKER (default, but explicit)
DROP VIEW IF EXISTS public.student_peers;

CREATE VIEW public.student_peers
WITH (security_invoker = true)
AS
SELECT s.id, s.user_id, s.roll_number, s.course_id, s.semester, s.year_level, s.is_active,
       p.full_name, p.avatar_url
FROM public.students s
JOIN public.profiles p ON p.user_id = s.user_id
WHERE s.is_active = true;
