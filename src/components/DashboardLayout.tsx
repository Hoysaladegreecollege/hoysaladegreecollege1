import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, User, BookOpen, Calendar, FileText,
  Bell, Clock, LogOut, GraduationCap, Users, Upload,
  BarChart3, Settings, Award, Image, Megaphone, Shield,
  UserCog, Menu, X, Mail, Trophy, UserCheck,
  DollarSign, Book, ArrowUpCircle, Cake, ImagePlus, ChevronLeft, ExternalLink
} from "lucide-react";
import { useState } from "react";
import PageLoader from "./PageLoader";
import DarkModeToggle from "./DarkModeToggle";
import ScrollToTop from "./ScrollToTop";

interface NavItem { label: string; path: string; icon: React.ElementType; }

const studentNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
  { label: "My Profile", path: "/dashboard/student/profile", icon: User },
  { label: "Attendance", path: "/dashboard/student/attendance", icon: Clock },
  { label: "Marks", path: "/dashboard/student/marks", icon: BarChart3 },
  { label: "Timetable", path: "/dashboard/student/timetable", icon: Calendar },
  { label: "Notices", path: "/dashboard/student/notices", icon: Bell },
  { label: "Announcements", path: "/dashboard/student/announcements", icon: Megaphone },
  { label: "Materials", path: "/dashboard/student/materials", icon: BookOpen },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "Students", path: "/dashboard/teacher/students", icon: Users },
  { label: "Attendance", path: "/dashboard/teacher/attendance", icon: Clock },
  { label: "Marks", path: "/dashboard/teacher/marks", icon: BarChart3 },
  { label: "Timetable", path: "/dashboard/teacher/timetable", icon: Calendar },
  { label: "Absent Notes", path: "/dashboard/teacher/absent", icon: Bell },
  { label: "Materials", path: "/dashboard/teacher/materials", icon: Upload },
  { label: "Announcements", path: "/dashboard/teacher/announcements", icon: Megaphone },
  { label: "Notices", path: "/dashboard/teacher/notices", icon: Bell },
];

const principalNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard/principal", icon: LayoutDashboard },
  { label: "Top Students", path: "/dashboard/principal/top-students", icon: Award },
  { label: "Events", path: "/dashboard/principal/events", icon: Image },
  { label: "Notices", path: "/dashboard/principal/notices", icon: Megaphone },
  { label: "Courses", path: "/dashboard/principal/courses", icon: BookOpen },
  { label: "Departments", path: "/dashboard/principal/departments", icon: GraduationCap },
  { label: "Teachers", path: "/dashboard/principal/teachers", icon: Users },
  { label: "Students", path: "/dashboard/principal/students", icon: UserCog },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Post Notice", path: "/dashboard/admin/post-notice", icon: Megaphone },
  { label: "Semester Promotion", path: "/dashboard/admin/semester-promotion", icon: ArrowUpCircle },
  { label: "Academic Years", path: "/dashboard/admin/academic-years", icon: Calendar },
  { label: "Absent Report", path: "/dashboard/admin/absent-report", icon: Clock },
  { label: "Applications", path: "/dashboard/admin/applications", icon: FileText },
  { label: "Messages", path: "/dashboard/admin/contacts", icon: Mail },
  { label: "Users", path: "/dashboard/admin/users", icon: Users },
  { label: "Faculty", path: "/dashboard/admin/faculty", icon: UserCheck },
  { label: "Fee Management", path: "/dashboard/admin/fees", icon: DollarSign },
  { label: "Top Rankers", path: "/dashboard/admin/top-rankers", icon: Trophy },
  { label: "Timetable", path: "/dashboard/admin/timetable", icon: Calendar },
  { label: "Events", path: "/dashboard/admin/events", icon: Image },
  { label: "Banners & Papers", path: "/dashboard/admin/banners", icon: Book },
  { label: "Gallery", path: "/dashboard/admin/gallery", icon: ImagePlus },
  { label: "Birthday Wishes", path: "/dashboard/admin/birthday-settings", icon: Cake },
  { label: "Roles", path: "/dashboard/admin/roles", icon: Shield },
  { label: "Settings", path: "/dashboard/admin/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = role === "student" ? studentNav
    : role === "teacher" ? teacherNav
    : role === "principal" ? principalNav
    : adminNav;

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  const handleLogout = async () => { await signOut(); navigate("/"); };

  // Find current page title
  const currentPage = navItems.find(item => location.pathname === item.path)?.label || roleLabel + " Dashboard";

  return (
    <div className="min-h-screen flex bg-muted/30 dark:bg-background">
      <ScrollToTop />
      <PageLoader />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — Apple dark style */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] bg-[hsl(220,20%,10%)] dark:bg-[hsl(0,0%,7%)] text-white/90 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        {/* Brand */}
        <div className="px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <p className="font-body text-[13px] font-semibold text-white/90 leading-tight">Hoysala College</p>
                <p className="font-body text-[10px] text-white/35 mt-0.5">{roleLabel} Portal</p>
              </div>
            </div>
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-[13px] transition-all duration-200 ${
                  active
                    ? "bg-white/12 text-white font-medium"
                    : "text-white/50 hover:bg-white/6 hover:text-white/80"
                }`}
              >
                <item.icon className={`w-[16px] h-[16px] shrink-0 ${active ? "text-white/90" : "text-white/40"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/8 shrink-0">
          <div className="flex items-center gap-2.5 px-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-white/60" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-[12px] font-medium text-white/80 truncate">{profile?.full_name || "User"}</p>
              <p className="font-body text-[10px] text-white/30 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg font-body text-[12px] text-white/40 hover:bg-white/6 hover:text-white/70 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header — clean minimal */}
        <header className="bg-card/80 dark:bg-card/60 backdrop-blur-lg border-b border-border/60 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-muted transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-foreground/70" />
            </button>
            <div>
              <h1 className="font-body text-[15px] sm:text-base font-semibold text-foreground tracking-[-0.01em]">{currentPage}</h1>
              <p className="font-body text-[11px] text-muted-foreground hidden sm:block">Hoysala Degree College</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Link
              to="/"
              className="font-body text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-muted flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Website</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
