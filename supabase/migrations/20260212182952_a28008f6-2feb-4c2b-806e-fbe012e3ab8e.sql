
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'principal', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  hod_name TEXT DEFAULT '',
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  duration TEXT DEFAULT '3 Years',
  eligibility TEXT DEFAULT '',
  fee TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  roll_number TEXT NOT NULL UNIQUE,
  course_id UUID REFERENCES public.courses(id),
  semester INTEGER DEFAULT 1,
  admission_year INTEGER DEFAULT EXTRACT(YEAR FROM now()),
  date_of_birth DATE,
  address TEXT DEFAULT '',
  parent_phone TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  employee_id TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id),
  qualification TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  subjects TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late')),
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, subject, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Marks table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'internal' CHECK (exam_type IN ('internal', 'final', 'assignment')),
  max_marks INTEGER NOT NULL DEFAULT 100,
  obtained_marks INTEGER NOT NULL DEFAULT 0,
  semester INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

-- Notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'General',
  is_pinned BOOLEAN DEFAULT false,
  posted_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_date DATE,
  category TEXT DEFAULT 'General',
  image_url TEXT DEFAULT '',
  posted_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Top rank students (managed by principal)
CREATE TABLE public.top_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  rank INTEGER NOT NULL,
  year TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  posted_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.top_students ENABLE ROW LEVEL SECURITY;

-- Student absent notes (for teacher absent page)
CREATE TABLE public.absent_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT NOT NULL,
  remarks TEXT DEFAULT '',
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.absent_notes ENABLE ROW LEVEL SECURITY;

-- Study materials
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id),
  file_url TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  -- Default role: student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============== RLS POLICIES ==============

-- Profiles: users can read own, admins/principals can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all profiles" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: only viewable by self, manageable by admin/principal
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Principal can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'principal'));

-- Departments: public read, admin/principal write
CREATE POLICY "Anyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Admin/Principal can manage departments" ON public.departments
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')
  );

-- Courses: public read, admin/principal write
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Admin/Principal can manage courses" ON public.courses
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')
  );

-- Students: self read, staff read all, admin/principal/teacher manage
CREATE POLICY "Students can view own record" ON public.students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all students" ON public.students
  FOR SELECT USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Staff can manage students" ON public.students
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Teachers: self read, admin/principal manage
CREATE POLICY "Teachers can view own record" ON public.teachers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all teachers" ON public.teachers
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')
  );

CREATE POLICY "Admin can manage teachers" ON public.teachers
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')
  );

-- Attendance: student reads own, teacher/admin manage
CREATE POLICY "Students can view own attendance" ON public.attendance
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Staff can manage attendance" ON public.attendance
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Marks: student reads own, staff manage
CREATE POLICY "Students can view own marks" ON public.marks
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Staff can manage marks" ON public.marks
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Notices: public read, staff write
CREATE POLICY "Anyone can view active notices" ON public.notices
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage notices" ON public.notices
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Events: public read, principal/admin write
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Principal/Admin can manage events" ON public.events
  FOR ALL USING (
    public.has_role(auth.uid(), 'principal') OR public.has_role(auth.uid(), 'admin')
  );

-- Top students: public read, principal write
CREATE POLICY "Anyone can view top students" ON public.top_students
  FOR SELECT USING (is_active = true);

CREATE POLICY "Principal can manage top students" ON public.top_students
  FOR ALL USING (public.has_role(auth.uid(), 'principal'));

-- Absent notes: teacher manage
CREATE POLICY "Staff can manage absent notes" ON public.absent_notes
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Students can view own absent notes" ON public.absent_notes
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- Study materials: authenticated read, teacher/admin write
CREATE POLICY "Authenticated can view materials" ON public.study_materials
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage materials" ON public.study_materials
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') OR
    public.has_role(auth.uid(), 'principal') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Insert seed data for departments and courses
INSERT INTO public.departments (name, code, hod_name, description) VALUES
  ('Computer Applications', 'CA', 'Dr. Meena Sharma', 'Department of Computer Applications offering BCA program'),
  ('Commerce', 'COM', 'Prof. Suresh Babu', 'Department of Commerce offering BCom program'),
  ('Business Administration', 'BA', 'Dr. Priya Nair', 'Department of Business Administration offering BBA program');

INSERT INTO public.courses (name, code, department_id, duration, eligibility, fee, overview)
SELECT 'BCA', 'BCA', id, '3 Years (6 Semesters)', '10+2 with Mathematics/Computer Science, min 45%', '₹35,000 / Year', 'Bachelor of Computer Applications'
FROM public.departments WHERE code = 'CA';

INSERT INTO public.courses (name, code, department_id, duration, eligibility, fee, overview)
SELECT 'BCom', 'BCOM', id, '3 Years (6 Semesters)', '10+2 in any stream, min 40%', '₹25,000 / Year', 'Bachelor of Commerce'
FROM public.departments WHERE code = 'COM';

INSERT INTO public.courses (name, code, department_id, duration, eligibility, fee, overview)
SELECT 'BBA', 'BBA', id, '3 Years (6 Semesters)', '10+2 in any stream, min 40%', '₹30,000 / Year', 'Bachelor of Business Administration'
FROM public.departments WHERE code = 'BA';
