import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Phone, MapPin, Calendar, BookOpen, Hash, Camera, Upload, Sparkles, Shield, Fingerprint, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function StudentProfile() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);

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

  const handleRegisterPasskey = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("Passkeys are not supported on this device/browser");
      return;
    }
    try {
      setRegisteringPasskey(true);
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { toast.error("Not authenticated"); setRegisteringPasskey(false); return; }

      const optRes = await fetch(`https://${projectId}.supabase.co/functions/v1/passkey-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "get-options" }),
      });
      const optData = await optRes.json();
      if (optData.error) { toast.error(optData.error); setRegisteringPasskey(false); return; }

      const opts = optData.options;
      const clientRpId = window.location.hostname === "localhost" ? "localhost" : window.location.hostname;

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: Uint8Array.from(atob(opts.challenge.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)),
          rp: { name: opts.rp.name, id: clientRpId },
          user: {
            id: Uint8Array.from(atob(opts.user.id.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)),
            name: opts.user.name,
            displayName: opts.user.displayName,
          },
          pubKeyCredParams: opts.pubKeyCredParams,
          authenticatorSelection: opts.authenticatorSelection,
          timeout: opts.timeout,
          excludeCredentials: (opts.excludeCredentials || []).map((c: any) => ({
            id: Uint8Array.from(atob(c.id.replace(/-/g, "+").replace(/_/g, "/")), ch => ch.charCodeAt(0)),
            type: c.type,
          })),
        },
      }) as PublicKeyCredential;

      if (!credential) { toast.error("Registration cancelled"); setRegisteringPasskey(false); return; }

      const response = credential.response as AuthenticatorAttestationResponse;
      const rawId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const attestationObject = btoa(String.fromCharCode(...new Uint8Array(response.attestationObject))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

      const regRes = await fetch(`https://${projectId}.supabase.co/functions/v1/passkey-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: "register",
          credential: {
            id: credential.id,
            rawId,
            response: { attestationObject },
            type: credential.type,
            transports: (response as any).getTransports?.() || [],
            name: "My Passkey",
          },
        }),
      });
      const regData = await regRes.json();
      if (regData.error) { toast.error(regData.error); } else {
        toast.success("Passkey registered successfully!");
        refetchPasskeys();
      }
    } catch (err: any) {
      console.error("Passkey registration error:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Registration was cancelled");
      } else {
        toast.error(err?.message || "Passkey registration failed");
      }
    } finally {
      setRegisteringPasskey(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    const { error } = await supabase.from("passkeys").delete().eq("id", passkeyId);
    if (error) { toast.error("Failed to delete passkey"); } else {
      toast.success("Passkey removed");
      refetchPasskeys();
    }
  };

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
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.04]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{ background: "hsla(var(--gold), 0.08)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">My Profile</h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">View your personal details and update your profile photo</p>
          </div>
        </div>
      </div>

      {/* Profile Photo Card */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8 group/card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.full_name}
                className="w-32 h-32 rounded-3xl object-cover border-2 border-primary/20 shadow-[0_12px_40px_-10px_hsla(var(--primary),0.15)] transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 shadow-[0_12px_40px_-10px_hsla(var(--primary),0.15)]">
                <span className="font-display text-3xl font-bold text-primary">{initials}</span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-3xl bg-foreground/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary flex items-center justify-center border-2 border-card shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-display text-2xl font-bold text-foreground">{profile?.full_name || "Student"}</h3>
            <p className="font-body text-sm text-primary font-semibold mt-1">{student?.courses?.name || "No course assigned"}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              {student?.roll_number && (
                <span className="inline-flex items-center gap-1 font-body text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                  <Shield className="w-3 h-3" /> {student.roll_number}
                </span>
              )}
              <span className="font-body text-xs text-muted-foreground">{profile?.email}</span>
            </div>
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
                className="rounded-2xl font-body text-xs border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <><Upload className="w-3 h-3 mr-1.5" /> {avatarUrl ? "Change Photo" : "Upload Photo"}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <h3 className="font-body text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] mb-5">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.map((f, i) => (
            <div key={f.label} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/20 hover:border-border/40 hover:bg-muted/50 transition-all duration-300 group" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.1em]">{f.label}</p>
                <p className="font-body text-sm font-semibold text-foreground mt-0.5">{f.value || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passkey / Biometric Authentication */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center">
            <Fingerprint className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-body text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">Passkey / Biometric Login</h3>
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">Sign in with fingerprint, face, or screen lock</p>
          </div>
        </div>

        {passkeys && passkeys.length > 0 && (
          <div className="space-y-2 mb-4">
            {passkeys.map((pk: any) => (
              <div key={pk.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/20">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <span className="font-body text-sm text-foreground">{pk.name || "My Passkey"}</span>
                  <span className="font-body text-[10px] text-muted-foreground">
                    {new Date(pk.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDeletePasskey(pk.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl font-body text-xs border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          disabled={registeringPasskey}
          onClick={handleRegisterPasskey}
        >
          {registeringPasskey ? "Registering..." : (
            <><Fingerprint className="w-3 h-3 mr-1.5" /> Register Passkey</>
          )}
        </Button>
      </div>
    </div>
  );
}
