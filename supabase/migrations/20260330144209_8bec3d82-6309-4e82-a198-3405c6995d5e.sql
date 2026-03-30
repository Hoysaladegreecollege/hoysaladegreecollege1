-- CRITICAL: Fix handle_new_user trigger - currently allows principal/admin role via signup metadata
-- The comment says "Only allow student/teacher" but the code allows ALL roles including principal
-- The validate_role_assignment trigger blocks admin, but principal is unprotected!

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_requested_role TEXT;
  assigned_role app_role;
BEGIN
  user_requested_role := NEW.raw_user_meta_data->>'role';
  
  -- SECURITY: Only allow student and teacher roles from self-registration
  -- Admin and principal roles must be assigned by an existing admin through
  -- the staff creation workflow or admin approval process
  IF user_requested_role IN ('student', 'teacher') THEN
    assigned_role := user_requested_role::app_role;
  ELSE
    assigned_role := 'student'::app_role;
  END IF;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  -- Auto-create student record only for students
  IF assigned_role = 'student' THEN
    INSERT INTO public.students (user_id, roll_number, is_active)
    VALUES (NEW.id, 'STU-' || substr(NEW.id::text, 1, 8), true);
  END IF;
  
  -- Auto-create teacher record only for teachers
  IF assigned_role = 'teacher' THEN
    INSERT INTO public.teachers (user_id, employee_id, is_active)
    VALUES (NEW.id, 'EMP-' || substr(NEW.id::text, 1, 8), true);
  END IF;
  
  RETURN NEW;
END;
$$;