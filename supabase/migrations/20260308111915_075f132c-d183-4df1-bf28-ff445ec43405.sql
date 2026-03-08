CREATE TABLE public.library_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  category TEXT NOT NULL,
  total_copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view library books" 
ON public.library_books 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage library books" 
ON public.library_books 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'principal') OR 
  has_role(auth.uid(), 'teacher')
);

CREATE TRIGGER update_library_books_updated_at
BEFORE UPDATE ON public.library_books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.library_books (title, author, isbn, category, total_copies, available_copies) VALUES
('Corporate Accounting', 'S.N. Maheshwari', '978-8125920845', 'Commerce', 15, 12),
('Financial Management', 'I.M. Pandey', '978-9325982291', 'Commerce', 20, 15),
('Data Structures using C', 'Reema Thareja', '978-0198099307', 'Computer Science', 25, 8),
('Software Engineering', 'Ian Sommerville', '978-0133943030', 'Computer Science', 10, 5),
('Principles of Management', 'Philip Kotler', '978-0134527604', 'Management', 30, 22),
('Business Statistics', 'S.P. Gupta', '978-9351610120', 'Management', 12, 10);
