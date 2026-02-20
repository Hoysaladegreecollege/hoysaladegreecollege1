-- Add phone column to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS phone text DEFAULT '';

-- Add avatar_url to students table for profile photos
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS avatar_url text DEFAULT '';
