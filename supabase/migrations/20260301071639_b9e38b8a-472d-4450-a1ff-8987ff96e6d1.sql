
-- Fix: Allow handle_new_user trigger to assign principal and admin roles too
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_requested_role TEXT;
  assigned_role app_role;
BEGIN
  user_requested_role := NEW.raw_user_meta_data->>'role';
  
  -- Allow all valid roles from metadata
  IF user_requested_role IN ('student', 'teacher', 'principal', 'admin') THEN
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
$function$;
