import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, User, BookOpen, Calendar, FileText,
  Bell, Clock, LogOut, GraduationCap, Users, Upload,
  BarChart3, Settings, Award, Image, Megaphone, Shield,
  UserCog, Menu, X, Mail, Trophy, UserCheck,
  DollarSign, Book, ArrowUpCircle, Cake, ImagePlus, ChevronLeft, ExternalLink,
  BellRing, Monitor, Armchair, Download, MessageSquare, Activity, ClipboardList
} from "lucide-react";
import collegeLogo from "@/assets/college-logo-optimized.webp";
import { useState, useEffect } from "react";
import PageLoader from "./PageLoader";
import DarkModeToggle from "./DarkModeToggle";
import ScrollToTop from "./ScrollToTop";
import NotificationBadge from "./NotificationBadge";
import NotificationCenter from "./NotificationCenter";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface NavItem { label: string; path: string; icon: React.ElementType; }

const studentNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
  { label: "My Profile", path: "/dashboard/student/profile", icon: User },
  { label: "Attendance", path: "/dashboard/student/attendance", icon: Clock },
  { label: "Marks", path: "/dashboard/student/marks", icon: BarChart3 },
  { label: "Fee Details", path: "/dashboard/student/fees", icon: DollarSign },
  { label: "Timetable", path: "/dashboard/student/timetable", icon: Calendar },
  { label: "Notices", path: "/dashboard/student/notices", icon: Bell },
  { label: "Announcements", path: "/dashboard/student/announcements", icon: Megaphone },
  { label: "Materials", path: "/dashboard/student/materials", icon: BookOpen },
  
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "Students", path: "/dashboard/teacher/students", icon: Users },
  { label: "Attendance", path: "/dashboard/teacher/attendance", icon: Clock },
  { label: "Attendance Overview", path: "/dashboard/teacher/attendance-overview", icon: UserCheck },
  { label: "Marks", path: "/dashboard/teacher/marks", icon: BarChart3 },
  { label: "Timetable", path: "/dashboard/teacher/timetable", icon: Calendar },
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
  { label: "Courses", path: "/dashboard/admin/courses", icon: BookOpen },
  { label: "Departments & Seats", path: "/dashboard/admin/departments", icon: Monitor },
  { label: "Absent Report", path: "/dashboard/admin/absent-report", icon: Clock },
  { label: "Attendance Overview", path: "/dashboard/admin/attendance-overview", icon: UserCheck },
  { label: "Applications", path: "/dashboard/admin/applications", icon: FileText },
  { label: "Messages", path: "/dashboard/admin/contacts", icon: Mail },
  { label: "Users", path: "/dashboard/admin/users", icon: Users },
  { label: "Faculty", path: "/dashboard/admin/faculty", icon: UserCheck },
  { label: "Fee Management", path: "/dashboard/admin/fees", icon: DollarSign },
  { label: "Top Rankers", path: "/dashboard/admin/top-rankers", icon: Trophy },
  { label: "Timetable", path: "/dashboard/admin/timetable", icon: Calendar },
  { label: "Exams", path: "/dashboard/admin/exams", icon: ClipboardList },
  { label: "Events", path: "/dashboard/admin/events", icon: Image },
  { label: "Banners & Papers", path: "/dashboard/admin/banners", icon: Book },
  { label: "Gallery", path: "/dashboard/admin/gallery", icon: ImagePlus },
  { label: "Birthday Wishes", path: "/dashboard/admin/birthday-settings", icon: Cake },
  { label: "Roles", path: "/dashboard/admin/roles", icon: Shield },
  { label: "Reports & Export", path: "/dashboard/admin/reports", icon: Download },
  { label: "Alumni", path: "/dashboard/admin/alumni", icon: GraduationCap },
  { label: "Settings", path: "/dashboard/admin/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSubscribed, isSupported, subscribe, isLoading: pushLoading } = usePushNotifications();
  const [pushBannerDismissed, setPushBannerDismissed] = useState(() => {
    return localStorage.getItem('hdc_push_banner_dismissed') === '1';
  });

  const navItems = role === "student" ? studentNav
    : role === "teacher" ? teacherNav
    : role === "principal" ? principalNav
    : adminNav;

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  const handleLogout = async () => { await signOut(); navigate("/"); };

  const currentPage = navItems.find(item => location.pathname === item.path)?.label || roleLabel + " Dashboard";

  return (
    <div className="min-h-screen flex bg-muted/30 dark:bg-background">
      <ScrollToTop />
      <PageLoader />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        {/* Layered premium background */}
        <div className="absolute inset-0 bg-[hsl(228,18%,6%)] dark:bg-[hsl(228,14%,4.5%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(42,60%,55%,0.03)] via-transparent to-[hsl(42,60%,55%,0.02)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(42,75%,55%,0.3)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/[0.04]" />

        {/* Logo & branding */}
        <div className="relative px-5 pt-6 pb-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-[hsl(42,75%,55%,0.2)] shadow-[0_0_15px_hsl(42,75%,55%,0.1)]">
                  <img src={collegeLogo} alt="Logo" className="w-full h-full object-contain bg-white/95" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-[hsl(42,75%,55%,0.08)] blur-md -z-10" />
              </div>
              <div>
                <p className="font-body text-[13px] font-semibold text-white/95 leading-tight tracking-[-0.01em]">Hoysala College</p>
                <p className="font-body text-[10px] text-[hsl(42,75%,55%,0.6)] mt-0.5 uppercase tracking-[0.1em] font-medium">{roleLabel} Portal</p>
              </div>
            </div>
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Separator with gold accent */}
          <div className="mt-5 h-px bg-gradient-to-r from-[hsl(42,75%,55%,0.15)] via-white/[0.06] to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <div className="space-y-0.5">
            {navItems.map((item, index) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-body text-[13px] transition-all duration-250 opacity-0 animate-fade-in ${
                    active
                      ? "text-white font-medium"
                      : "text-white/45 hover:text-white/80"
                  }`}
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Active background with ambient glow */}
                  {active && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-white/[0.07] border border-white/[0.06]" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[hsl(42,75%,55%)] shadow-[0_0_8px_hsl(42,75%,55%,0.5)]" />
                      <div className="absolute inset-0 rounded-xl bg-[hsl(42,75%,55%,0.03)]" />
                    </>
                  )}

                  {/* Hover background */}
                  {!active && (
                    <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-250" />
                  )}

                  <item.icon className={`relative w-4 h-4 shrink-0 transition-all duration-250 ${
                    active
                      ? "text-[hsl(42,75%,55%)] drop-shadow-[0_0_6px_hsl(42,75%,55%,0.4)]"
                      : "text-white/30 group-hover:text-white/60"
                  }`} />
                  <span className="relative truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer: user info + sign out */}
        <div className="relative px-3 py-4 shrink-0">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />

          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(42,75%,55%,0.2)] to-[hsl(42,75%,55%,0.05)] flex items-center justify-center ring-1 ring-white/[0.08]">
                <User className="w-3.5 h-3.5 text-[hsl(42,75%,55%,0.7)]" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-[12px] font-medium text-white/85 truncate">{profile?.full_name || "User"}</p>
              <p className="font-body text-[10px] text-white/30 truncate">{profile?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl font-body text-[12px] text-white/35 hover:bg-[hsl(0,60%,50%,0.08)] hover:text-[hsl(0,70%,70%)] transition-all duration-250"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:text-[hsl(0,70%,65%)] transition-colors duration-250" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
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
            {isSupported && !isSubscribed && (
              <button
                onClick={subscribe}
                disabled={pushLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-body text-[12px] font-semibold"
                title="Enable push notifications"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{pushLoading ? 'Enabling...' : 'Enable Alerts'}</span>
              </button>
            )}
            {isSubscribed && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-body font-semibold" title="Push notifications enabled">
                <BellRing className="w-3 h-3" /> On
              </span>
            )}
            <NotificationCenter />
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

        {isSupported && !isSubscribed && !pushBannerDismissed && role === 'student' && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
            <BellRing className="w-5 h-5 text-primary shrink-0" />
            <p className="font-body text-xs text-foreground flex-1">
              <span className="font-semibold">Enable Push Notifications</span> — Get instant alerts for attendance, marks, and announcements even when the browser is closed.
            </p>
            <button onClick={subscribe} disabled={pushLoading}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0">
              {pushLoading ? 'Enabling...' : 'Enable'}
            </button>
            <button onClick={() => { setPushBannerDismissed(true); localStorage.setItem('hdc_push_banner_dismissed', '1'); }}
              className="p-1 rounded hover:bg-muted transition-colors shrink-0">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
