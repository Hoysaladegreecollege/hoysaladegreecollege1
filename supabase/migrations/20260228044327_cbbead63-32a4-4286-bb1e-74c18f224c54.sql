-- Allow students to update their own avatar_url
CREATE POLICY "Students can update own avatar"
ON public.students
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);