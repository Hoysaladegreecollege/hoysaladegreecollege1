CREATE TABLE public.alumni_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  batch_year TEXT NOT NULL,
  course TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  story TEXT NOT NULL,
  linkedin_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alumni_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view alumni stories" 
ON public.alumni_stories 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage alumni stories" 
ON public.alumni_stories 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'principal')
);

CREATE TRIGGER update_alumni_stories_updated_at
BEFORE UPDATE ON public.alumni_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
