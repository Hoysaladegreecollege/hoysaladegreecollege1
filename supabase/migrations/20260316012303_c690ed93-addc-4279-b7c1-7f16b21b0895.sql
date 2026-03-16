CREATE TABLE public.passkeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  credential_id text NOT NULL UNIQUE,
  public_key text NOT NULL,
  counter bigint NOT NULL DEFAULT 0,
  transports text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  name text DEFAULT 'My Passkey'
);

ALTER TABLE public.passkeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own passkeys" ON public.passkeys
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passkeys" ON public.passkeys
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own passkeys" ON public.passkeys
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON public.passkeys
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);