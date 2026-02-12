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
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import PrincipalDashboard from "./pages/dashboard/PrincipalDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
              <Route path="/student-absent" element={<StudentAbsent />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard redirect */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["student", "teacher", "principal", "admin"]}>
                <DashboardRedirect />
              </ProtectedRoute>
            } />

            {/* Student Dashboard */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout><StudentDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/*" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout><StudentDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Teacher Dashboard */}
            <Route path="/dashboard/teacher" element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <DashboardLayout><TeacherDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/teacher/*" element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <DashboardLayout><TeacherDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Principal Dashboard */}
            <Route path="/dashboard/principal" element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <DashboardLayout><PrincipalDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/principal/*" element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <DashboardLayout><PrincipalDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin Dashboard */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout><AdminDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/*" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout><AdminDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
