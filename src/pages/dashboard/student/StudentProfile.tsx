import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User, Phone, MapPin, Calendar, BookOpen, Hash, Camera, Upload, Sparkles,
  Shield, Fingerprint, Trash2, Edit3, Save, X, FileText, Download,
  Heart, Globe, Users, CreditCard, Droplets, Award, GraduationCap
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAadhaar } from "@/lib/format-aadhaar";

const base64UrlToUint8Array = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

export default function StudentProfile() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

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

  const { data: attendance } = useQuery({
    queryKey: ["student-attendance-stats", user?.id],
    queryFn: async () => {
      if (!student?.id) return null;
      const { data } = await supabase.from("attendance").select("status").eq("student_id", student.id);
      if (!data || data.length === 0) return null;
      const total = data.length;
      const present = data.filter(a => a.status === "present").length;
      return { total, present, percentage: Math.round((present / total) * 100) };
    },
    enabled: !!student?.id,
  });

  const { data: passkeys, refetch: refetchPasskeys } = useQuery({
    queryKey: ["passkeys", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("passkeys")
        .select("id, name, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["student-documents", student?.id],
    queryFn: async () => {
      const { data } = await (supabase as any).from("student_documents").select("*").eq("student_id", student!.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!student?.id,
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

  const updateProfileMutation = useMutation({
    mutationFn: async (form: Record<string, string>) => {
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: form.full_name || "",
        phone: form.phone || "",
      }).eq("user_id", user!.id);
      if (profileError) throw profileError;
      const studentUpdate: any = {
        phone: form.phone || "",
        parent_phone: form.parent_phone || "",
        address: form.address || "",
        date_of_birth: form.date_of_birth || null,
        father_name: form.father_name || "",
        mother_name: form.mother_name || "",
      };
      const { error: studentError } = await supabase.from("students").update(studentUpdate).eq("user_id", user!.id);
      if (studentError) throw studentError;
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["student-record", user?.id] });
      setEditing(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const startEditing = () => {
    setEditForm({
      full_name: profile?.full_name || "",
      phone: (student as any)?.phone || profile?.phone || "",
      parent_phone: student?.parent_phone || "",
      address: student?.address || "",
      date_of_birth: student?.date_of_birth || "",
      father_name: student?.father_name || "",
      mother_name: student?.mother_name || "",
    });
    setEditing(true);
  };

  const handleRegisterPasskey = async () => {
    if (!window.PublicKeyCredential) { toast.error("Passkeys are not supported on this device/browser"); return; }
    try {
      setRegisteringPasskey(true);
      const { data: optionsData, error: optionsError } = await supabase.functions.invoke("passkey-register", { body: { action: "get-options" } });
      if (optionsError || optionsData?.error) { toast.error(optionsError?.message || optionsData?.error || "Failed to load passkey options"); return; }
      const opts = optionsData.options;
      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge: base64UrlToUint8Array(opts.challenge),
          rp: { name: opts.rp.name, id: window.location.hostname },
          user: { id: base64UrlToUint8Array(opts.user.id), name: opts.user.name, displayName: opts.user.displayName },
          pubKeyCredParams: opts.pubKeyCredParams,
          authenticatorSelection: opts.authenticatorSelection,
          timeout: opts.timeout,
          excludeCredentials: (opts.excludeCredentials || []).map((c: any) => ({ id: base64UrlToUint8Array(c.id), type: c.type })),
        },
      })) as PublicKeyCredential;
      if (!credential) { toast.error("Registration cancelled"); return; }
      const response = credential.response as AuthenticatorAttestationResponse;
      const { data: registerData, error: registerError } = await supabase.functions.invoke("passkey-register", {
        body: {
          action: "register",
          credential: {
            id: credential.id, rawId: arrayBufferToBase64Url(credential.rawId),
            response: { attestationObject: arrayBufferToBase64Url(response.attestationObject) },
            type: credential.type, transports: (response as any).getTransports?.() || [], name: "My Passkey",
          },
        },
      });
      if (registerError || registerData?.error) { toast.error(registerError?.message || registerData?.error || "Passkey registration failed"); return; }
      toast.success("Passkey registered successfully!");
      refetchPasskeys();
    } catch (err: any) {
      console.error("Passkey registration error:", err);
      if (err?.name === "NotAllowedError") toast.error("Registration was cancelled or timed out");
      else if (err?.name === "InvalidStateError") toast.error("This passkey is already registered on this device");
      else if (err?.name === "SecurityError") toast.error("Security error — passkeys require HTTPS");
      else toast.error(err?.message || "Passkey registration failed");
    } finally { setRegisteringPasskey(false); }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    const { error } = await supabase.from("passkeys").delete().eq("id", passkeyId);
    if (error) { toast.error("Failed to delete passkey"); return; }
    toast.success("Passkey removed");
    refetchPasskeys();
  };

  const avatarUrl = (student as any)?.avatar_url;
  const initials = (profile?.full_name || "S").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const feeStatus = (student?.total_fee || 0) > 0
    ? ((student?.fee_paid || 0) >= (student?.total_fee || 0) ? "Paid" : "Pending")
    : "N/A";

  const academicFields = [
    { icon: Hash, label: "Roll Number", value: student?.roll_number },
    { icon: BookOpen, label: "Course", value: student?.courses?.name },
    { icon: GraduationCap, label: "Semester", value: student?.semester ? `Semester ${student.semester}` : "-" },
    { icon: Calendar, label: "Admission Year", value: student?.admission_year },
    { icon: Award, label: "Year Level", value: student?.year_level ? `${student.year_level}${["st","nd","rd"][student.year_level-1]||"th"} Year` : "-" },
  ];

  const personalFields = [
    { icon: Calendar, label: "Date of Birth", value: student?.date_of_birth, editKey: "date_of_birth", type: "date" },
    { icon: User, label: "Gender", value: (student as any)?.gender || "-" },
    { icon: Droplets, label: "Blood Group", value: (student as any)?.blood_group || "-" },
    { icon: Globe, label: "Nationality", value: (student as any)?.nationality || "-" },
    { icon: Heart, label: "Religion", value: (student as any)?.religion || "-" },
    { icon: Users, label: "Category", value: (student as any)?.category || "-" },
    { icon: Users, label: "Caste", value: (student as any)?.caste || "-" },
  ];

  const contactFields = [
    { icon: Phone, label: "Phone", value: (student as any)?.phone || profile?.phone || "-", editKey: "phone" },
    { icon: Phone, label: "Parent Phone", value: student?.parent_phone || "-", editKey: "parent_phone" },
    { icon: User, label: "Father's Name", value: student?.father_name || "-", editKey: "father_name" },
    { icon: User, label: "Mother's Name", value: student?.mother_name || "-", editKey: "mother_name" },
    { icon: MapPin, label: "Address", value: student?.address || "-", editKey: "address" },
  ];

  const identityFields = [
    { icon: CreditCard, label: "Aadhaar No.", value: formatAadhaar((student as any)?.aadhaar_number) },
  ];

  const sectionColors = [
    { accent: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/10", iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
    { accent: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/10", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { accent: "from-amber-500/10 to-amber-500/5", border: "border-amber-500/10", iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
    { accent: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/10", iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
  ];

  const renderField = (f: any, sectionColor: any, canEdit = false) => (
    <div key={f.label} className={`flex items-start gap-3 p-4 rounded-[1.25rem] bg-gradient-to-br ${sectionColor.accent} border ${sectionColor.border} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
      <div className={`w-10 h-10 rounded-xl ${sectionColor.iconBg} flex items-center justify-center shrink-0`}>
        <f.icon className={`w-4.5 h-4.5 ${sectionColor.iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-semibold">{f.label}</p>
        {editing && canEdit && f.editKey ? (
          <Input
            type={f.type || "text"}
            value={editForm[f.editKey] || ""}
            onChange={(e) => setEditForm(prev => ({ ...prev, [f.editKey!]: e.target.value }))}
            className="h-8 text-sm rounded-xl mt-1 bg-background/80"
          />
        ) : (
          <p className="font-body text-sm font-semibold text-foreground mt-0.5 break-words">{f.value || "-"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/40">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-card to-secondary/10" />
        {/* Ambient glow orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-5 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]" />
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Avatar with glow ring */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/30 to-secondary/20 blur-xl scale-110 opacity-60" />
              {avatarUrl ? (
                <img src={avatarUrl} alt={profile?.full_name} className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-[2rem] object-cover border-4 border-card shadow-2xl" />
              ) : (
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-[2rem] bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center border-4 border-card shadow-2xl">
                  <span className="font-display text-5xl font-bold text-primary">{initials}</span>
                </div>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 rounded-[2rem] bg-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                <Camera className="w-10 h-10 text-white drop-shadow-lg" />
              </button>
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center border-4 border-card shadow-lg">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{profile?.full_name || "Student"}</h2>
              <p className="font-body text-base text-primary font-semibold mt-1">{student?.courses?.name || "No course assigned"}</p>
              {student?.roll_number && <p className="font-body text-xs text-muted-foreground mt-0.5">Roll No: {student.roll_number}</p>}

              {/* Quick Stat Pills */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5 justify-center sm:justify-start">
                {attendance && (
                  <div className={`px-4 py-2 rounded-2xl border backdrop-blur-md font-body text-xs font-semibold ${
                    attendance.percentage >= 75
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                      : "bg-destructive/10 border-destructive/20 text-destructive"
                  }`}>
                    📊 Attendance: {attendance.percentage}%
                  </div>
                )}
                <div className={`px-4 py-2 rounded-2xl border backdrop-blur-md font-body text-xs font-semibold ${
                  feeStatus === "Paid"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    : feeStatus === "Pending"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                    : "bg-muted border-border text-muted-foreground"
                }`}>
                  💰 Fee: {feeStatus}
                </div>
                {student?.semester && (
                  <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md font-body text-xs font-semibold text-primary">
                    📚 Semester {student.semester}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2 justify-center sm:justify-start">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAvatarMutation.mutate(file);
                }} />
                <Button variant="outline" size="sm" className="rounded-2xl font-body text-xs backdrop-blur-sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? "Uploading..." : <><Upload className="w-3 h-3 mr-1.5" /> {avatarUrl ? "Change Photo" : "Upload Photo"}</>}
                </Button>
                {!editing ? (
                  <Button variant="outline" size="sm" className="rounded-2xl font-body text-xs backdrop-blur-sm" onClick={startEditing}>
                    <Edit3 className="w-3 h-3 mr-1.5" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button size="sm" className="rounded-2xl font-body text-xs" disabled={updateProfileMutation.isPending} onClick={() => updateProfileMutation.mutate(editForm)}>
                      <Save className="w-3 h-3 mr-1.5" /> {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-2xl font-body text-xs" onClick={() => setEditing(false)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Sections ── */}
      {[
        { title: "Academic Details", icon: GraduationCap, fields: academicFields, colorIdx: 0, editable: false },
        { title: "Personal Details", icon: User, fields: personalFields, colorIdx: 1, editable: true },
        { title: "Contact Details", icon: Phone, fields: contactFields, colorIdx: 2, editable: true },
        { title: "Identity", icon: CreditCard, fields: identityFields, colorIdx: 3, editable: false },
      ].map((section, sIdx) => (
        <div
          key={section.title}
          className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/40 rounded-[2rem] p-6 sm:p-8 animate-fade-in"
          style={{ animationDelay: `${(sIdx + 1) * 100}ms` }}
        >
          {/* Section shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl ${sectionColors[section.colorIdx].iconBg} flex items-center justify-center`}>
                <section.icon className={`w-5 h-5 ${sectionColors[section.colorIdx].iconColor}`} />
              </div>
              <h3 className="font-body text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">{section.title}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {section.fields.map(f => renderField(f, sectionColors[section.colorIdx], section.editable))}
            </div>
          </div>
        </div>
      ))}

      {/* ── Documents Section ── */}
      <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/40 rounded-[2rem] p-6 sm:p-8 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-body text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">My Documents</h3>
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">Documents uploaded by the college</p>
          </div>
        </div>
        {documents.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-[1.25rem] bg-gradient-to-br from-rose-500/5 to-rose-500/[0.02] border border-rose-500/10 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{doc.file_name}</p>
                    <p className="font-body text-[10px] text-muted-foreground">
                      {doc.document_type?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())} · {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-body text-xs shrink-0 ml-2" onClick={async () => {
                  try {
                    const { data, error } = await supabase.storage.from("student-documents").download(doc.file_url);
                    if (error) throw error;
                    const url = URL.createObjectURL(data);
                    const a = document.createElement("a");
                    a.href = url; a.download = doc.file_name; a.click();
                    URL.revokeObjectURL(url);
                  } catch (e: any) { toast.error("Download failed: " + e.message); }
                }}>
                  <Download className="w-3 h-3 mr-1.5" /> Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-sm text-muted-foreground/60">No documents uploaded yet.</p>
        )}
      </div>

      {/* ── Passkey / Security Section ── */}
      <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/40 rounded-[2rem] p-6 sm:p-8 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="font-body text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">Security & Passkeys</h3>
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">Sign in with fingerprint, face, or screen lock</p>
          </div>
        </div>

        {passkeys && passkeys.length > 0 && (
          <div className="space-y-2 mb-4">
            {passkeys.map((pk: any) => (
              <div key={pk.id} className="flex items-center justify-between p-4 rounded-[1.25rem] bg-gradient-to-br from-cyan-500/5 to-cyan-500/[0.02] border border-cyan-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <span className="font-body text-sm font-semibold text-foreground">{pk.name || "My Passkey"}</span>
                    <p className="font-body text-[10px] text-muted-foreground">{new Date(pk.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => handleDeletePasskey(pk.id)} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" className="rounded-2xl font-body text-xs" disabled={registeringPasskey} onClick={handleRegisterPasskey}>
          {registeringPasskey ? "Registering..." : <><Fingerprint className="w-3 h-3 mr-1.5" /> Register Passkey</>}
        </Button>
        <p className="font-body text-[10px] text-muted-foreground/60 mt-3 leading-relaxed">
          ⚠️ Passkeys are bound to the domain where registered. A passkey created here (<span className="font-semibold text-muted-foreground/80">{window.location.hostname}</span>) will only work on this same domain.
        </p>
      </div>
    </div>
  );
}
