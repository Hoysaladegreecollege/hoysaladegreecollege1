import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, User, BookOpen, Calendar, FileText,
  Bell, Clock, LogOut, GraduationCap, Users, Upload,
  BarChart3, Settings, Award, Image, Megaphone, Shield,
  UserCog, Menu, X, Mail, Trophy, ChevronRight, Sparkles, UserCheck,
  DollarSign, Book, ArrowUpCircle, Cake, ImagePlus
} from "lucide-react";
import { useState } from "react";
import PageLoader from "./PageLoader";

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
  const roleEmoji = role === "admin" ? "⚙️" : role === "principal" ? "🏛️" : role === "teacher" ? "📚" : "🎓";

  const handleLogout = async () => { await signOut(); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-background">
      <PageLoader />
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[252px] sm:w-[266px] bg-primary text-primary-foreground transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col border-r border-primary-foreground/10 shadow-2xl`}>
        {/* Decorative sidebar glow */}
        <div className="absolute top-20 -right-10 w-20 h-40 bg-secondary/12 blur-3xl rounded-full" />
        
        <div className="p-4 sm:p-5 border-b border-primary-foreground/8 shrink-0 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="font-display text-xs sm:text-sm font-bold leading-tight">Hoysala College</p>
                <p className="text-[9px] sm:text-[10px] font-body opacity-40 mt-0.5 flex items-center gap-1">{roleLabel} Portal {roleEmoji}</p>
              </div>
            </div>
            <button className="lg:hidden p-1 rounded-lg hover:bg-primary-foreground/10 transition-colors" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 sm:px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-body text-[12px] sm:text-[13px] transition-all duration-300 group relative border ${
                  active
                    ? "bg-secondary text-secondary-foreground font-semibold shadow-lg shadow-secondary/20 border-secondary/30"
                    : "text-primary-foreground/75 border-transparent hover:bg-primary-foreground/8 hover:text-primary-foreground hover:border-primary-foreground/15"
                }`}>
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-secondary rounded-r-full" />}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${active ? "bg-secondary-foreground/10" : "bg-primary-foreground/5 group-hover:bg-primary-foreground/12"}`}>
                  <item.icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-all duration-300 ${active ? "" : "group-hover:scale-110 group-hover:text-secondary"}`} />
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 opacity-70 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 sm:p-4 border-t border-primary-foreground/8 shrink-0">
          <div className="flex items-center gap-2.5 mb-3 px-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[11px] sm:text-xs font-semibold truncate">{profile?.full_name || "User"}</p>
              <p className="font-body text-[9px] sm:text-[10px] opacity-30 truncate">{profile?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[12px] sm:text-[13px] font-body text-primary-foreground/50 hover:bg-destructive/20 hover:text-primary-foreground transition-all duration-300">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5 text-foreground" /></button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">{roleLabel} Dashboard <Sparkles className="w-4 h-4 text-secondary" /></h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-primary/8 text-primary border border-primary/15">Live</span>
              </div>
              <p className="font-body text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">Hoysala Degree College • Management Portal</p>
            </div>
          </div>
          <Link to="/" className="font-body text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-all duration-300 px-3 py-1.5 rounded-xl hover:bg-primary/5 flex items-center gap-1 border border-transparent hover:border-primary/15">
            ← Website
          </Link>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
