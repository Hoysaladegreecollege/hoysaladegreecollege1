
-- Fix 1: Prevent privilege escalation in handle_new_user trigger
-- Only allow 'student' and 'teacher' roles from signup metadata
-- Admin and principal must be assigned by existing admin through dashboard
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_requested_role TEXT;
  assigned_role app_role;
BEGIN
  -- Only allow student/teacher from signup; admin/principal must be assigned by admin
  user_requested_role := NEW.raw_user_meta_data->>'role';
  
  IF user_requested_role IN ('student', 'teacher') THEN
    assigned_role := user_requested_role::app_role;
  ELSE
    assigned_role := 'student'::app_role;
  END IF;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  -- Auto-create student record
  IF assigned_role = 'student' THEN
    INSERT INTO public.students (user_id, roll_number, is_active)
    VALUES (NEW.id, 'STU-' || substr(NEW.id::text, 1, 8), true);
  END IF;
  
  -- Auto-create teacher record
  IF assigned_role = 'teacher' THEN
    INSERT INTO public.teachers (user_id, employee_id, is_active)
    VALUES (NEW.id, 'EMP-' || substr(NEW.id::text, 1, 8), true);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix 2: Add database constraints for input validation on critical tables
ALTER TABLE public.admission_applications
  ALTER COLUMN full_name TYPE VARCHAR(200),
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN phone TYPE VARCHAR(20),
  ALTER COLUMN address TYPE VARCHAR(1000),
  ALTER COLUMN course TYPE VARCHAR(100),
  ALTER COLUMN father_name TYPE VARCHAR(200),
  ALTER COLUMN mother_name TYPE VARCHAR(200),
  ALTER COLUMN previous_school TYPE VARCHAR(300),
  ALTER COLUMN percentage_12th TYPE VARCHAR(20),
  ALTER COLUMN review_notes TYPE VARCHAR(2000);

ALTER TABLE public.contact_submissions
  ALTER COLUMN name TYPE VARCHAR(200),
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN subject TYPE VARCHAR(300),
  ALTER COLUMN message TYPE VARCHAR(5000);

-- Fix 3: Restrict admin/principal role assignment at database level
-- Create a validation trigger to prevent unauthorized role escalation
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Block admin role assignment unless the user email matches the authorized admin
  IF NEW.role = 'admin' THEN
    IF NOT EXISTS (
      SELECT 1 FROM auth.users WHERE id = NEW.user_id AND email = 'pavanaofficial05@gmail.com'
    ) THEN
      RAISE EXCEPTION 'Admin role can only be assigned to the authorized administrator';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_role_before_insert
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();

CREATE TRIGGER validate_role_before_update
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();
