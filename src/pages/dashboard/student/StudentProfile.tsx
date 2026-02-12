import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { User, Phone, MapPin, Calendar, BookOpen, Hash } from "lucide-react";

export default function StudentProfile() {
  const { user, profile } = useAuth();

  const { data: student } = useQuery({
    queryKey: ["student-record", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("*, courses(name, code)")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const fields = [
    { icon: User, label: "Full Name", value: profile?.full_name },
    { icon: Hash, label: "Roll Number", value: student?.roll_number },
    { icon: BookOpen, label: "Course", value: student?.courses?.name },
    { icon: Calendar, label: "Semester", value: student?.semester ? `Semester ${student.semester}` : "-" },
    { icon: Calendar, label: "Admission Year", value: student?.admission_year },
    { icon: Calendar, label: "Date of Birth", value: student?.date_of_birth },
    { icon: Phone, label: "Phone", value: profile?.phone || "-" },
    { icon: Phone, label: "Parent Phone", value: student?.parent_phone || "-" },
    { icon: MapPin, label: "Address", value: student?.address || "-" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">My Profile</h2>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <f.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-body text-xs text-muted-foreground">{f.label}</p>
                <p className="font-body text-sm font-medium text-foreground">{f.value || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
