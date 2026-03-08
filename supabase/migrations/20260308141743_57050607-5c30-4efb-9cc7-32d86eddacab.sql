
-- Feedback/Complaints system
CREATE TABLE public.feedback_complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_response TEXT,
  responded_by UUID,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_complaints ENABLE ROW LEVEL SECURITY;

-- Students can insert their own feedback
CREATE POLICY "Users can submit feedback" ON public.feedback_complaints
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Students can view their own feedback
CREATE POLICY "Users can view own feedback" ON public.feedback_complaints
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Staff can view all feedback
CREATE POLICY "Staff can view all feedback" ON public.feedback_complaints
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Staff can update feedback (respond)
CREATE POLICY "Staff can update feedback" ON public.feedback_complaints
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Activity log table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view activity logs" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Staff can insert logs
CREATE POLICY "Staff can insert activity logs" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Trigger to update updated_at on feedback
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback_complaints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
