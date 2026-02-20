import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Admissions from "./pages/Admissions";
import Departments from "./pages/Departments";
import Faculty from "./pages/Faculty";
import Events from "./pages/Events";
import Notices from "./pages/Notices";
import Achievements from "./pages/Achievements";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Login from "./pages/Login";
import StudentAbsent from "./pages/StudentAbsent";
import NotFound from "./pages/NotFound";
import Management from "./pages/Management";
import Committees from "./pages/Committees";
import AddOnCourses from "./pages/AddOnCourses";
import ApplicationStatus from "./pages/ApplicationStatus";

// Student Dashboard
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentProfile from "./pages/dashboard/student/StudentProfile";
import StudentAttendance from "./pages/dashboard/student/StudentAttendance";
import StudentMarks from "./pages/dashboard/student/StudentMarks";
import StudentTimetable from "./pages/dashboard/student/StudentTimetable";
import StudentNotices from "./pages/dashboard/student/StudentNotices";
import StudentMaterials from "./pages/dashboard/student/StudentMaterials";
import StudentAnnouncements from "./pages/dashboard/student/StudentAnnouncements";

// Teacher Dashboard
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import TeacherStudents from "./pages/dashboard/teacher/TeacherStudents";
import TeacherAttendance from "./pages/dashboard/teacher/TeacherAttendance";
import TeacherMarks from "./pages/dashboard/teacher/TeacherMarks";
import TeacherAbsent from "./pages/dashboard/teacher/TeacherAbsent";
import TeacherMaterials from "./pages/dashboard/teacher/TeacherMaterials";
import TeacherNotices from "./pages/dashboard/teacher/TeacherNotices";
import TeacherTimetable from "./pages/dashboard/teacher/TeacherTimetable";

// Principal Dashboard
import PrincipalDashboard from "./pages/dashboard/PrincipalDashboard";
import PrincipalTopStudents from "./pages/dashboard/principal/PrincipalTopStudents";
import PrincipalEvents from "./pages/dashboard/principal/PrincipalEvents";
import PrincipalNotices from "./pages/dashboard/principal/PrincipalNotices";
import PrincipalCourses from "./pages/dashboard/principal/PrincipalCourses";
import PrincipalDepartments from "./pages/dashboard/principal/PrincipalDepartments";
import PrincipalTeachers from "./pages/dashboard/principal/PrincipalTeachers";
import PrincipalStudents from "./pages/dashboard/principal/PrincipalStudents";

// Admin Dashboard
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminUsers from "./pages/dashboard/admin/AdminUsers";
import AdminRoles from "./pages/dashboard/admin/AdminRoles";
import AdminSettings from "./pages/dashboard/admin/AdminSettings";
import AdminApplications from "./pages/dashboard/admin/AdminApplications";
import AdminContacts from "./pages/dashboard/admin/AdminContacts";
import AdminTopRankers from "./pages/dashboard/admin/AdminTopRankers";
import AdminTimetable from "./pages/dashboard/admin/AdminTimetable";
import AdminEvents from "./pages/dashboard/admin/AdminEvents";
import AdminFaculty from "./pages/dashboard/admin/AdminFaculty";
import AdminBannerAndPapers from "./pages/dashboard/admin/AdminBannerAndPapers";
import AdminFeeManagement from "./pages/dashboard/admin/AdminFeeManagement";
import PreviousYearPapers from "./pages/PreviousYearPapers";
import TeacherAnnouncements from "./pages/dashboard/teacher/TeacherAnnouncements";

const queryClient = new QueryClient();

const StudentRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["student"]}><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
);
const TeacherRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["teacher"]}><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
);
const PrincipalRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["principal"]}><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
);
const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["admin"]}><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public pages */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/events" element={<Events />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/management" element={<Management />} />
              <Route path="/committees" element={<Committees />} />
              <Route path="/addon-courses" element={<AddOnCourses />} />
              <Route path="/student-absent" element={<StudentAbsent />} />
              <Route path="/application-status" element={<ApplicationStatus />} />
              <Route path="/previous-year-papers" element={<PreviousYearPapers />} />
            </Route>

            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["student", "teacher", "principal", "admin"]}>
                <DashboardRedirect />
              </ProtectedRoute>
            } />

            {/* Student */}
            <Route path="/dashboard/student" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
            <Route path="/dashboard/student/profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
            <Route path="/dashboard/student/attendance" element={<StudentRoute><StudentAttendance /></StudentRoute>} />
            <Route path="/dashboard/student/marks" element={<StudentRoute><StudentMarks /></StudentRoute>} />
            <Route path="/dashboard/student/timetable" element={<StudentRoute><StudentTimetable /></StudentRoute>} />
            <Route path="/dashboard/student/notices" element={<StudentRoute><StudentNotices /></StudentRoute>} />
            <Route path="/dashboard/student/materials" element={<StudentRoute><StudentMaterials /></StudentRoute>} />
            <Route path="/dashboard/student/announcements" element={<StudentRoute><StudentAnnouncements /></StudentRoute>} />

            {/* Teacher */}
            <Route path="/dashboard/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
            <Route path="/dashboard/teacher/students" element={<TeacherRoute><TeacherStudents /></TeacherRoute>} />
            <Route path="/dashboard/teacher/attendance" element={<TeacherRoute><TeacherAttendance /></TeacherRoute>} />
            <Route path="/dashboard/teacher/marks" element={<TeacherRoute><TeacherMarks /></TeacherRoute>} />
            <Route path="/dashboard/teacher/absent" element={<TeacherRoute><TeacherAbsent /></TeacherRoute>} />
            <Route path="/dashboard/teacher/materials" element={<TeacherRoute><TeacherMaterials /></TeacherRoute>} />
            <Route path="/dashboard/teacher/notices" element={<TeacherRoute><TeacherNotices /></TeacherRoute>} />
            <Route path="/dashboard/teacher/timetable" element={<TeacherRoute><TeacherTimetable /></TeacherRoute>} />
            <Route path="/dashboard/teacher/announcements" element={<TeacherRoute><TeacherAnnouncements /></TeacherRoute>} />

            {/* Principal */}
            <Route path="/dashboard/principal" element={<PrincipalRoute><PrincipalDashboard /></PrincipalRoute>} />
            <Route path="/dashboard/principal/top-students" element={<PrincipalRoute><PrincipalTopStudents /></PrincipalRoute>} />
            <Route path="/dashboard/principal/events" element={<PrincipalRoute><PrincipalEvents /></PrincipalRoute>} />
            <Route path="/dashboard/principal/notices" element={<PrincipalRoute><PrincipalNotices /></PrincipalRoute>} />
            <Route path="/dashboard/principal/courses" element={<PrincipalRoute><PrincipalCourses /></PrincipalRoute>} />
            <Route path="/dashboard/principal/departments" element={<PrincipalRoute><PrincipalDepartments /></PrincipalRoute>} />
            <Route path="/dashboard/principal/teachers" element={<PrincipalRoute><PrincipalTeachers /></PrincipalRoute>} />
            <Route path="/dashboard/principal/students" element={<PrincipalRoute><PrincipalStudents /></PrincipalRoute>} />

            {/* Admin */}
            <Route path="/dashboard/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/dashboard/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/dashboard/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
            <Route path="/dashboard/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
            <Route path="/dashboard/admin/top-rankers" element={<AdminRoute><AdminTopRankers /></AdminRoute>} />
            <Route path="/dashboard/admin/timetable" element={<AdminRoute><AdminTimetable /></AdminRoute>} />
            <Route path="/dashboard/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="/dashboard/admin/faculty" element={<AdminRoute><AdminFaculty /></AdminRoute>} />
            <Route path="/dashboard/admin/banners" element={<AdminRoute><AdminBannerAndPapers /></AdminRoute>} />
            <Route path="/dashboard/admin/fees" element={<AdminRoute><AdminFeeManagement /></AdminRoute>} />
            <Route path="/dashboard/admin/roles" element={<AdminRoute><AdminRoles /></AdminRoute>} />
            <Route path="/dashboard/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
