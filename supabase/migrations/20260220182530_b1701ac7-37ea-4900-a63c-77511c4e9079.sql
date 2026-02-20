
-- ============================================================
-- ACADEMIC ARCHITECTURE RESTRUCTURE
-- ============================================================

-- 1. Create academic_years table for managing academic sessions
CREATE TABLE IF NOT EXISTS public.academic_years (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,         -- e.g. "2025-2026"
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ensure only one academic year is marked current
CREATE UNIQUE INDEX IF NOT EXISTS academic_years_current_unique 
  ON public.academic_years (is_current) WHERE (is_current = true);

-- Enable RLS
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view academic years"
  ON public.academic_years FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin/Principal can manage academic years"
  ON public.academic_years FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Seed default academic year
INSERT INTO public.academic_years (label, is_current)
VALUES ('2025-2026', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. Add year_level (1/2/3) to students table
-- year_level is derived from semester but stored explicitly for
-- fast filtering without computation
-- ============================================================
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS year_level integer DEFAULT 1 CHECK (year_level BETWEEN 1 AND 3);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS academic_year_id uuid REFERENCES public.academic_years(id);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_name text DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_name text DEFAULT '';

-- Back-fill year_level from existing semester values
UPDATE public.students
SET year_level = CASE
  WHEN semester IN (1, 2) THEN 1
  WHEN semester IN (3, 4) THEN 2
  WHEN semester IN (5, 6) THEN 3
  ELSE 1
END
WHERE year_level IS NULL OR year_level = 1;

-- Set academic_year_id for existing students to the current year
UPDATE public.students s
SET academic_year_id = (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1)
WHERE academic_year_id IS NULL;

-- ============================================================
-- 3. Add year_level & course_id to attendance table
-- This enables proper isolation per course and year
-- ============================================================
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS year_level integer DEFAULT 1 CHECK (year_level BETWEEN 1 AND 3);
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id);

-- Back-fill attendance with year_level from students table
UPDATE public.attendance a
SET year_level = s.year_level,
    course_id  = s.course_id
FROM public.students s
WHERE a.student_id = s.id
  AND a.year_level IS NULL;

-- ============================================================
-- 4. Add indexes for fast course+year filtering
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_students_course_year ON public.students(course_id, year_level);
CREATE INDEX IF NOT EXISTS idx_students_year_level ON public.students(year_level);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_course_year ON public.attendance(course_id, year_level);

-- ============================================================
-- 5. Marks: add year_level for consistent filtering
-- ============================================================
ALTER TABLE public.marks ADD COLUMN IF NOT EXISTS year_level integer DEFAULT 1 CHECK (year_level BETWEEN 1 AND 3);
ALTER TABLE public.marks ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id);

-- Back-fill marks with year_level from students table
UPDATE public.marks m
SET year_level = s.year_level,
    course_id  = s.course_id
FROM public.students s
WHERE m.student_id = s.id
  AND m.year_level IS NULL;

CREATE INDEX IF NOT EXISTS idx_marks_student_year ON public.marks(student_id, year_level);
