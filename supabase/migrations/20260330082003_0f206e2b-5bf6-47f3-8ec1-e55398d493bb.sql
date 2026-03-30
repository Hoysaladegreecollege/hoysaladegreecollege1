
CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL DEFAULT 'other',
    file_name TEXT NOT NULL DEFAULT '',
    file_url TEXT NOT NULL DEFAULT '',
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage student documents"
ON public.student_documents FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Students can view own documents"
ON public.student_documents FOR SELECT
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));
