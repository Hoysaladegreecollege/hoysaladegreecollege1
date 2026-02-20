import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Phone, MapPin, Calendar, BookOpen, Hash, Camera, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function StudentProfile() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const path = `avatars/${user!.id}-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, file, { upsert: true });
      if (uploadErr) throw new Error("Upload failed: " + uploadErr.message);
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      const avatar_url = urlData.publicUrl;
      const { error } = await supabase.from("students").update({ avatar_url }).eq("user_id", user!.id);
      if (error) throw error;
      return avatar_url;
    },
    onSuccess: () => {
      toast.success("Profile photo updated!");
      queryClient.invalidateQueries({ queryKey: ["student-record", user?.id] });
      setUploading(false);
    },
    onError: (e: any) => { toast.error(e.message); setUploading(false); },
  });

  const fields = [
    { icon: User, label: "Full Name", value: profile?.full_name },
    { icon: Hash, label: "Roll Number", value: student?.roll_number },
    { icon: BookOpen, label: "Course", value: student?.courses?.name },
    { icon: Calendar, label: "Semester", value: student?.semester ? `Semester ${student.semester}` : "-" },
    { icon: Calendar, label: "Admission Year", value: student?.admission_year },
    { icon: Calendar, label: "Date of Birth", value: student?.date_of_birth },
    { icon: Phone, label: "Phone", value: (student as any)?.phone || profile?.phone || "-" },
    { icon: Phone, label: "Parent Phone", value: student?.parent_phone || "-" },
    { icon: MapPin, label: "Address", value: student?.address || "-" },
  ];

  const avatarUrl = (student as any)?.avatar_url;
  const initials = (profile?.full_name || "S").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> My Profile
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">View your personal details and update your profile photo</p>
      </div>

      {/* Profile Photo */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.full_name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-secondary/30 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-navy-dark flex items-center justify-center border-4 border-secondary/30 shadow-xl">
                <span className="font-display text-3xl font-bold text-primary-foreground">{initials}</span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-display text-xl font-bold text-foreground">{profile?.full_name || "Student"}</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">{student?.courses?.name || "No course assigned"} • {student?.roll_number}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{profile?.email}</p>
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAvatarMutation.mutate(file);
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-body text-xs"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <><Upload className="w-3 h-3 mr-1" /> {avatarUrl ? "Change Photo" : "Upload Photo"}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Personal Information</h3>
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
