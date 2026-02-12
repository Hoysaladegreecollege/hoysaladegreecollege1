import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, Award, Megaphone, Image, BookOpen, Settings, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Students", value: "350", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Faculty Members", value: "18", icon: GraduationCap, color: "bg-secondary/10 text-secondary" },
  { label: "Active Courses", value: "3", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { label: "Placement Rate", value: "90%", icon: TrendingUp, color: "bg-secondary/10 text-secondary" },
];

const actions = [
  { icon: Award, label: "Top Students", desc: "Update homepage top rank students" },
  { icon: Image, label: "Events & Gallery", desc: "Post new events and upload photos" },
  { icon: Megaphone, label: "Notices", desc: "Publish announcements" },
  { icon: BookOpen, label: "Courses & Fees", desc: "Update course fees and details" },
  { icon: GraduationCap, label: "Departments", desc: "Manage departments" },
  { icon: Settings, label: "Website Settings", desc: "Enable/disable sections" },
];

export default function PrincipalDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome, {profile?.full_name || "Principal"} 🏛️
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Full administrative control of the college website</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Management</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((a) => (
            <div key={a.label} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <a.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-body text-sm font-semibold text-foreground">{a.label}</h4>
              <p className="font-body text-xs text-muted-foreground mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
