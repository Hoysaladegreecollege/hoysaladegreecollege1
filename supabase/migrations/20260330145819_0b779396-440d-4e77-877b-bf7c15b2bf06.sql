-- FIX: Restrict teacher access to sensitive student data
-- Create a SECURITY DEFINER function that returns only non-sensitive fields for teachers
-- Teachers don't need: aadhaar_number, caste, religion, total_fee, fee_paid, fee_due_date, fee_remarks

CREATE OR REPLACE FUNCTION public.get_students_for_teacher()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  roll_number text,
  course_id uuid,
  semester integer,
  admission_year integer,
  date_of_birth date,
  is_active boolean,
  created_at timestamptz,
  year_level integer,
  academic_year_id uuid,
  phone text,
  address text,
  parent_phone text,
  avatar_url text,
  father_name text,
  mother_name text,
  gender text,
  nationality text,
  category text,
  blood_group text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.user_id, s.roll_number, s.course_id, s.semester, s.admission_year,
         s.date_of_birth, s.is_active, s.created_at, s.year_level, s.academic_year_id,
         s.phone, s.address, s.parent_phone, s.avatar_url, s.father_name, s.mother_name,
         s.gender, s.nationality, s.category, s.blood_group
  FROM public.students s
  WHERE has_role(auth.uid(), 'teacher'::app_role);
$$;

-- FIX: Add Realtime authorization for direct_messages
-- Restrict Realtime subscriptions so users only receive their own messages
-- Note: Supabase Realtime respects RLS policies on the source table when using postgres_changes.
-- The existing RLS policy "Users can view own messages" already restricts SELECT to sender/receiver.
-- Realtime postgres_changes subscriptions inherit these RLS policies automatically.
-- No additional migration needed for Realtime - the RLS on direct_messages already protects it.
