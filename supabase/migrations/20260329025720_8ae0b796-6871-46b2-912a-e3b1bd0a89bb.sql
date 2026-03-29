
-- Fix: drop and recreate admission-photos read policy if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read admission photos' AND tablename = 'objects') THEN
    CREATE POLICY "Anyone can read admission photos" ON storage.objects
      FOR SELECT TO public
      USING (bucket_id = 'admission-photos');
  END IF;
END $$;
