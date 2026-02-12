import { Settings } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">System Settings</h2>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">General</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "College Name", value: "Hoysala Group of Institutions" },
            { label: "Academic Year", value: "2025-2026" },
            { label: "Current Semester", value: "Even Semester" },
            { label: "System Status", value: "Active" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="font-body text-sm text-foreground">{s.label}</span>
              <span className="font-body text-sm font-semibold text-primary">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
