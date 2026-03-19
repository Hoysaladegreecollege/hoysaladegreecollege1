import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load public pages
const About = lazy(() => import("./pages/About"));
const Courses = lazy(() => import("./pages/Courses"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Apply = lazy(() => import("./pages/Apply"));
const Departments = lazy(() => import("./pages/Departments"));
const Faculty = lazy(() => import("./pages/Faculty"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Notices = lazy(() => import("./pages/Notices"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Contact = lazy(() => import("./pages/Contact"));
const Support = lazy(() => import("./pages/Support"));
const Login = lazy(() => import("./pages/Login"));
const StudentAbsent = lazy(() => import("./pages/StudentAbsent"));
const Management = lazy(() => import("./pages/Management"));
const Committees = lazy(() => import("./pages/Committees"));
const AddOnCourses = lazy(() => import("./pages/AddOnCourses"));
const ApplicationStatus = lazy(() => import("./pages/ApplicationStatus"));
const Gallery = lazy(() => import("./pages/Gallery"));
const PreviousYearPapers = lazy(() => import("./pages/PreviousYearPapers"));
const DownloadApp = lazy(() => import("./pages/Download"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Register = lazy(() => import("./pages/Register"));
const Credits = lazy(() => import("./pages/Credits"));
const Offers = lazy(() => import("./pages/Offers"));
const Placements = lazy(() => import("./pages/Placements"));
const CampusPage = lazy(() => import("./pages/Campus"));
const Alumni = lazy(() => import("./pages/Alumni"));
const PurchaseWebsite = lazy(() => import("./pages/PurchaseWebsite"));
...
              <Route path="/faculty" element={<SuspenseWrap><Faculty /></SuspenseWrap>} />
              <Route path="/events" element={<SuspenseWrap><Events /></SuspenseWrap>} />
              <Route path="/events/:eventId" element={<SuspenseWrap><EventDetail /></SuspenseWrap>} />
              <Route path="/notices" element={<SuspenseWrap><Notices /></SuspenseWrap>} />
...
              <Route path="/alumni" element={<SuspenseWrap><Alumni /></SuspenseWrap>} />
              <Route path="/purchase" element={<SuspenseWrap><PurchaseWebsite /></SuspenseWrap>} />
            </Route>

            <Route path="/login" element={<SuspenseWrap><Login /></SuspenseWrap>} />
            <Route path="/forgot-password" element={<SuspenseWrap><ForgotPassword /></SuspenseWrap>} />
            <Route path="/reset-password" element={<SuspenseWrap><ResetPassword /></SuspenseWrap>} />
            <Route path="/register" element={<SuspenseWrap><Register /></SuspenseWrap>} />

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
            <Route path="/dashboard/student/fees" element={<StudentRoute><StudentFees /></StudentRoute>} />
            <Route path="/dashboard/student/messages" element={<StudentRoute><StudentMessages /></StudentRoute>} />

            {/* Teacher */}
            <Route path="/dashboard/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
            <Route path="/dashboard/teacher/students" element={<TeacherRoute><TeacherStudents /></TeacherRoute>} />
            <Route path="/dashboard/teacher/attendance" element={<TeacherRoute><TeacherAttendance /></TeacherRoute>} />
            <Route path="/dashboard/teacher/attendance-overview" element={<TeacherRoute><TeacherAttendanceOverview /></TeacherRoute>} />
            <Route path="/dashboard/teacher/marks" element={<TeacherRoute><TeacherMarks /></TeacherRoute>} />
            <Route path="/dashboard/teacher/absent" element={<TeacherRoute><TeacherAttendanceOverview /></TeacherRoute>} />
            <Route path="/dashboard/teacher/materials" element={<TeacherRoute><TeacherMaterials /></TeacherRoute>} />
            <Route path="/dashboard/teacher/notices" element={<TeacherRoute><TeacherNotices /></TeacherRoute>} />
            <Route path="/dashboard/teacher/timetable" element={<TeacherRoute><TeacherTimetable /></TeacherRoute>} />
            <Route path="/dashboard/teacher/announcements" element={<TeacherRoute><TeacherAnnouncements /></TeacherRoute>} />
            <Route path="/dashboard/teacher/messages" element={<TeacherRoute><TeacherMessages /></TeacherRoute>} />

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
            <Route path="/dashboard/admin/post-notice" element={<AdminRoute><AdminPostNotice /></AdminRoute>} />
            <Route path="/dashboard/admin/semester-promotion" element={<AdminRoute><AdminSemesterPromotion /></AdminRoute>} />
            <Route path="/dashboard/admin/academic-years" element={<AdminRoute><AdminAcademicYear /></AdminRoute>} />
            <Route path="/dashboard/admin/absent-report" element={<AdminRoute><AdminAttendanceHub /></AdminRoute>} />
            <Route path="/dashboard/admin/attendance" element={<AdminRoute><AdminAttendanceHub /></AdminRoute>} />
            <Route path="/dashboard/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
            <Route path="/dashboard/admin/birthday-settings" element={<AdminRoute><AdminBirthdaySettings /></AdminRoute>} />
            <Route path="/dashboard/admin/add-staff" element={<AdminRoute><AdminAddStaff /></AdminRoute>} />
            <Route path="/dashboard/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
            <Route path="/dashboard/admin/attendance-overview" element={<AdminRoute><AdminAttendanceHub /></AdminRoute>} />
            <Route path="/dashboard/admin/approve-admins" element={<AdminRoute><AdminApproveAdmins /></AdminRoute>} />
            <Route path="/dashboard/admin/fees/:studentId" element={<AdminRoute><AdminStudentFeeDetail /></AdminRoute>} />
            <Route path="/dashboard/admin/seats" element={<AdminRoute><AdminDepartmentsAndSeats /></AdminRoute>} />
            <Route path="/dashboard/admin/departments" element={<AdminRoute><AdminDepartmentsAndSeats /></AdminRoute>} />
            <Route path="/dashboard/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/dashboard/admin/alumni" element={<AdminRoute><AdminAlumni /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
