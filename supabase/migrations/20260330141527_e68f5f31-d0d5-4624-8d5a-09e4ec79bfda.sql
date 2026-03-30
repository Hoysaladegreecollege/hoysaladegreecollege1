
-- Drop the view approach - use RPC instead
DROP VIEW IF EXISTS public.student_peers;

-- Create a secure function to get peer student list (safe columns only)
CREATE OR REPLACE FUNCTION public.get_student_peers(_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  roll_number text,
  course_id uuid,
  semester integer,
  year_level integer,
  full_name text,
  avatar_url text,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.user_id, s.roll_number, s.course_id, s.semester, s.year_level,
         p.full_name, p.avatar_url, p.email
  FROM public.students s
  JOIN public.profiles p ON p.user_id = s.user_id
  WHERE s.is_active = true
    AND s.user_id != _user_id;
$$;
