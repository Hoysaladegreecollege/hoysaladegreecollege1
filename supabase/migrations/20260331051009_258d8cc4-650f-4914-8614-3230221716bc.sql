
CREATE TABLE public.study_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  streak integer NOT NULL DEFAULT 0,
  last_date date NOT NULL DEFAULT CURRENT_DATE,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak" ON public.study_streaks
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak" ON public.study_streaks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON public.study_streaks
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
