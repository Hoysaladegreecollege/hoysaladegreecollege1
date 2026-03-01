-- Add semester column to fee_payments for semester-wise tracking
ALTER TABLE public.fee_payments ADD COLUMN semester integer DEFAULT NULL;
