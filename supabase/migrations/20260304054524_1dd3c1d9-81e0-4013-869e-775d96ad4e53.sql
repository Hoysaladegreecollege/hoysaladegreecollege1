
-- Create semester_fees table for per-semester fee structure
CREATE TABLE public.semester_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  fee_amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE,
  remarks TEXT,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, semester)
);

-- Enable RLS
ALTER TABLE public.semester_fees ENABLE ROW LEVEL SECURITY;

-- Admin/teacher can manage semester fees
CREATE POLICY "Admins can manage semester fees"
ON public.semester_fees
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'principal')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'principal')
  )
);

-- Students can view their own semester fees
CREATE POLICY "Students can view own semester fees"
ON public.semester_fees
FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);
