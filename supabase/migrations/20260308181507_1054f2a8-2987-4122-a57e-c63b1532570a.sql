
-- Add check constraints for email format and phone pattern
ALTER TABLE public.admission_applications
  ADD CONSTRAINT chk_admission_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT chk_admission_phone_format
    CHECK (phone ~ '^[0-9+\-() ]{7,20}$');

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT chk_contact_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
