
-- Auto-create student record when a student role user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  -- Auto-create student record
  IF _role = 'student' THEN
    INSERT INTO public.students (user_id, roll_number, is_active)
    VALUES (NEW.id, 'STU-' || substr(NEW.id::text, 1, 8), true);
  END IF;
  
  -- Auto-create teacher record
  IF _role = 'teacher' THEN
    INSERT INTO public.teachers (user_id, employee_id, is_active)
    VALUES (NEW.id, 'EMP-' || substr(NEW.id::text, 1, 8), true);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Also create student/teacher records for existing users who are missing them
INSERT INTO public.students (user_id, roll_number, is_active)
SELECT ur.user_id, 'STU-' || substr(ur.user_id::text, 1, 8), true
FROM public.user_roles ur
WHERE ur.role = 'student'
AND NOT EXISTS (SELECT 1 FROM public.students s WHERE s.user_id = ur.user_id);

INSERT INTO public.teachers (user_id, employee_id, is_active)
SELECT ur.user_id, 'EMP-' || substr(ur.user_id::text, 1, 8), true
FROM public.user_roles ur
WHERE ur.role = 'teacher'
AND NOT EXISTS (SELECT 1 FROM public.teachers t WHERE t.user_id = ur.user_id);
