-- CRITICAL FIX: Prevent students from modifying sensitive fields
-- The current "Students can update own avatar" policy allows UPDATE on ALL columns.
-- We add a trigger that reverts protected fields when a non-staff user tries to modify them.

CREATE OR REPLACE FUNCTION public.protect_student_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the user is staff (admin/principal/teacher), allow all changes
  IF has_role(auth.uid(), 'admin'::app_role)
     OR has_role(auth.uid(), 'principal'::app_role)
     OR has_role(auth.uid(), 'teacher'::app_role) THEN
    RETURN NEW;
  END IF;

  -- For students: only allow changes to safe fields (avatar_url, phone, address, parent_phone, father_name, mother_name, date_of_birth)
  -- Revert all protected fields to their OLD values
  NEW.roll_number := OLD.roll_number;
  NEW.course_id := OLD.course_id;
  NEW.semester := OLD.semester;
  NEW.admission_year := OLD.admission_year;
  NEW.is_active := OLD.is_active;
  NEW.total_fee := OLD.total_fee;
  NEW.fee_paid := OLD.fee_paid;
  NEW.fee_due_date := OLD.fee_due_date;
  NEW.fee_remarks := OLD.fee_remarks;
  NEW.year_level := OLD.year_level;
  NEW.academic_year_id := OLD.academic_year_id;
  NEW.aadhaar_number := OLD.aadhaar_number;
  NEW.nationality := OLD.nationality;
  NEW.religion := OLD.religion;
  NEW.caste := OLD.caste;
  NEW.category := OLD.category;
  NEW.blood_group := OLD.blood_group;
  NEW.gender := OLD.gender;
  NEW.user_id := OLD.user_id;
  NEW.created_at := OLD.created_at;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_student_fields
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_student_fields();
