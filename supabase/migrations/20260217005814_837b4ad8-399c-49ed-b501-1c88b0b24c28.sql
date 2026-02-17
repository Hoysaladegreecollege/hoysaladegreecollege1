
-- Add fee tracking columns to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS total_fee numeric DEFAULT 0;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS fee_paid numeric DEFAULT 0;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS fee_due_date date DEFAULT NULL;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS fee_remarks text DEFAULT '';
