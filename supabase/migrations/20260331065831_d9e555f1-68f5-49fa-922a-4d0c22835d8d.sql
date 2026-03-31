
CREATE TABLE public.fcm_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL,
  device_info text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own FCM tokens"
  ON public.fcm_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on fcm_tokens"
  ON public.fcm_tokens FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
