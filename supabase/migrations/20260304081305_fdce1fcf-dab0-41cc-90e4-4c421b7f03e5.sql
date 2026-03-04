-- Add highlights column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT '{}'::text[];

-- Drop the unique constraint on course code to allow flexibility
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_code_key;
