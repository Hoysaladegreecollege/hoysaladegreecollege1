
-- Exams table for countdown timer
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id),
  semester INTEGER DEFAULT 1,
  exam_date DATE NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'internal',
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view exams" ON public.exams FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);
CREATE POLICY "Staff can manage exams" ON public.exams FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Direct messages table for student-teacher messaging
CREATE TABLE public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  parent_message_id UUID REFERENCES public.direct_messages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.direct_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Authenticated can send messages" ON public.direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver can mark as read" ON public.direct_messages FOR UPDATE USING (auth.uid() = receiver_id);
CREATE POLICY "Sender can delete own messages" ON public.direct_messages FOR DELETE USING (auth.uid() = sender_id);
