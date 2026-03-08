
CREATE TABLE public.fee_management_pin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid NULL
);

ALTER TABLE public.fee_management_pin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage fee pin"
  ON public.fee_management_pin
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
