-- Allow students to view active teachers (needed for messaging)
CREATE POLICY "Students can view active teachers"
ON public.teachers
FOR SELECT
TO authenticated
USING (is_active = true AND has_role(auth.uid(), 'student'::app_role));

-- Add file_url column to direct_messages for file sharing
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS file_url text DEFAULT NULL;
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS file_name text DEFAULT NULL;
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS file_type text DEFAULT NULL;

-- Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message attachments
CREATE POLICY "Authenticated users can upload message attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'message-attachments');

CREATE POLICY "Anyone can view message attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'message-attachments');

CREATE POLICY "Users can delete own message attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'message-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);