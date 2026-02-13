import { Settings, Globe, Calendar, Shield, Database } from "lucide-react";

export default function AdminSettings() {
  const settings = [
    { label: "College Name", value: "Hoysala Degree College", icon: Globe },
    { label: "Academic Year", value: "2025-2026", icon: Calendar },
    { label: "Current Semester", value: "Even Semester", icon: Database },
    { label: "System Status", value: "Active", icon: Shield },
    { label: "College Code", value: "BU 26 (P21GEF0099)", icon: Settings },
    { label: "Affiliation", value: "Bangalore University", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" /> System Settings
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">View system configuration</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-base font-bold text-foreground mb-5">General Information</h3>
        <div className="space-y-3">
          {settings.map((s) => (
            <div key={s.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-body text-sm text-foreground">{s.label}</span>
              </div>
              <span className="font-body text-sm font-semibold text-primary">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
