import { useState, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft, Phone, MapPin, Calendar, Users, GraduationCap, Sparkles, CheckCircle, ExternalLink } from "lucide-react";
import collegeLogo from "@/assets/college-logo-optimized.webp";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    phone: "", dateOfBirth: "", fatherName: "", motherName: "",
    parentPhone: "", address: "",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const validateStep1 = () => {
    if (!form.fullName.trim()) { toast.error("Please enter your full name"); return false; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { toast.error("Please enter a valid email"); return false; }
    if (!form.password || form.password.length < 6) { toast.error("Password must be at least 6 characters"); return false; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords don't match"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) { toast.error("Phone number is required"); return; }
    setLoading(true);
    try {
      const { error } = await signUp(form.email, form.password, form.fullName, "student");
      if (error) { toast.error(error.message); setLoading(false); return; }

      // Wait for trigger to create student record, then update with extra details
      await new Promise(r => setTimeout(r, 2500));

      // Try to find the user and update student details directly
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Update profile with phone
        await supabase.from("profiles").update({ phone: form.phone }).eq("user_id", session.user.id);
        
        // Update student record with family details
        const updateData: any = {
          phone: form.phone,
          father_name: form.fatherName || "",
          mother_name: form.motherName || "",
          parent_phone: form.parentPhone || "",
          address: form.address || "",
          date_of_birth: form.dateOfBirth || null,
        };
        await supabase.from("students").update(updateData).eq("user_id", session.user.id);
      } else {
        // Store extra info in localStorage to update after email verification
        localStorage.setItem("hdc_pending_student_info", JSON.stringify({
          phone: form.phone,
          dateOfBirth: form.dateOfBirth,
          fatherName: form.fatherName,
          motherName: form.motherName,
          parentPhone: form.parentPhone,
          address: form.address,
        }));
      }

      setShowSuccessDialog(true);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name: string) =>
    `w-full bg-transparent border ${focused === name ? "border-secondary/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]" : "border-border/30"} rounded-xl px-4 py-3 pl-11 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300`;

  const iconClass = (name: string) =>
    `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${focused === name ? "text-secondary scale-110" : "text-muted-foreground/40"}`;

  return (
    <>
      <SEOHead
        title="Student Registration | Hoysala Degree College"
        description="Register as a student at Hoysala Degree College portal"
      />
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(222 47% 8%) 0%, hsl(222 47% 5%) 50%, hsl(222 47% 10%) 100%)" }}>

        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, hsl(45 80% 55%), transparent 70%)", animation: "float 18s ease-in-out infinite" }} />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, hsl(45 80% 55%), transparent 70%)", animation: "float 22s ease-in-out infinite reverse" }} />
        </div>

        <div ref={cardRef} onMouseMove={handleMouseMove}
          className="relative w-full max-w-lg rounded-2xl border border-border/20 p-7 sm:p-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(222 30% 12% / 0.95), hsl(222 30% 9% / 0.98))",
            backdropFilter: "blur(60px)",
            boxShadow: "0 25px 80px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}>

          {/* Spotlight */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{ background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, hsl(45 80% 55% / 0.06), transparent 60%)` }} />

          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <img src={collegeLogo} alt="Hoysala Degree College" className="w-16 h-16 mx-auto mb-3 rounded-2xl shadow-lg" />
            <h1 className="font-display text-xl font-bold text-foreground">Student Registration</h1>
            <p className="font-body text-xs text-muted-foreground/60 mt-1">Create your student portal account</p>
            
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all duration-300 ${
                    step >= s ? "bg-secondary/20 text-secondary border border-secondary/40" : "bg-muted/10 text-muted-foreground/40 border border-border/20"
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 2 && <div className={`w-12 h-0.5 rounded-full transition-all duration-300 ${step > 1 ? "bg-secondary/40" : "bg-border/20"}`} />}
                </div>
              ))}
            </div>
            <p className="font-body text-[11px] text-muted-foreground/50 mt-2">
              {step === 1 ? "Step 1: Account Details" : "Step 2: Personal Information"}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-4 relative z-10">
              <div className="relative">
                <User className={iconClass("fullName")} />
                <input type="text" placeholder="Full Name *" value={form.fullName}
                  onChange={e => set("fullName", e.target.value)}
                  onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)}
                  className={inputClass("fullName")} />
              </div>
              <div className="relative">
                <Mail className={iconClass("email")} />
                <input type="email" placeholder="Email Address *" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  className={inputClass("email")} />
              </div>
              <div className="relative">
                <Lock className={iconClass("password")} />
                <input type={showPassword ? "text" : "password"} placeholder="Password * (min 6 chars)" value={form.password}
                  onChange={e => set("password", e.target.value)}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  className={inputClass("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-secondary/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className={iconClass("confirmPassword")} />
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password *" value={form.confirmPassword}
                  onChange={e => set("confirmPassword", e.target.value)}
                  onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused(null)}
                  className={inputClass("confirmPassword")} />
              </div>
              <Button type="button" onClick={() => { if (validateStep1()) setStep(2); }}
                className="w-full h-12 rounded-xl font-body font-semibold text-sm relative overflow-hidden group"
                style={{ background: "linear-gradient(135deg, hsl(45 80% 45%), hsl(45 80% 55%), hsl(40 85% 50%))" }}>
                <span className="relative z-10 text-background flex items-center gap-2">
                  Continue <Sparkles className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              <div className="relative">
                <Phone className={iconClass("phone")} />
                <input type="tel" placeholder="Phone Number *" value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                  className={inputClass("phone")} />
              </div>
              <div className="relative">
                <Calendar className={iconClass("dob")} />
                <input type="date" value={form.dateOfBirth}
                  onChange={e => set("dateOfBirth", e.target.value)}
                  onFocus={() => setFocused("dob")} onBlur={() => setFocused(null)}
                  className={`${inputClass("dob")} ${!form.dateOfBirth ? "text-muted-foreground/50" : ""}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Users className={iconClass("father")} />
                  <input type="text" placeholder="Father's Name" value={form.fatherName}
                    onChange={e => set("fatherName", e.target.value)}
                    onFocus={() => setFocused("father")} onBlur={() => setFocused(null)}
                    className={inputClass("father")} />
                </div>
                <div className="relative">
                  <Users className={iconClass("mother")} />
                  <input type="text" placeholder="Mother's Name" value={form.motherName}
                    onChange={e => set("motherName", e.target.value)}
                    onFocus={() => setFocused("mother")} onBlur={() => setFocused(null)}
                    className={inputClass("mother")} />
                </div>
              </div>
              <div className="relative">
                <Phone className={iconClass("parentPhone")} />
                <input type="tel" placeholder="Parent's Phone" value={form.parentPhone}
                  onChange={e => set("parentPhone", e.target.value)}
                  onFocus={() => setFocused("parentPhone")} onBlur={() => setFocused(null)}
                  className={inputClass("parentPhone")} />
              </div>
              <div className="relative">
                <MapPin className={iconClass("address")} />
                <textarea placeholder="Full Address" value={form.address} rows={2}
                  onChange={e => set("address", e.target.value)}
                  onFocus={() => setFocused("address")} onBlur={() => setFocused(null)}
                  className={`${inputClass("address")} resize-none pt-3`} />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl font-body text-sm border-border/30 bg-transparent text-muted-foreground hover:bg-muted/10">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="submit" disabled={loading}
                  className="flex-[2] h-12 rounded-xl font-body font-semibold text-sm relative overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, hsl(45 80% 45%), hsl(45 80% 55%), hsl(40 85% 50%))" }}>
                  <span className="relative z-10 text-background flex items-center gap-2">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Registering...</>
                    ) : (
                      <><GraduationCap className="w-4 h-4" /> Create Account</>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </div>
            </form>
          )}

          {/* Footer links */}
          <div className="text-center mt-5 relative z-10 space-y-2">
            <p className="font-body text-xs text-muted-foreground/40">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary/70 hover:text-secondary transition-colors font-semibold">Sign In</Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1.5 font-body text-[11px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Website
            </Link>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm border-border/30 bg-card p-0 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(222 30% 12%), hsl(222 30% 9%))" }}>
          <div className="p-8 text-center">
            {/* Animated tick */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-5 animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Account Successfully Created! 🎉</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Please check your email for a confirmation link and <strong className="text-foreground">verify your email</strong> for security reasons before signing in.
            </p>

            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-amber-400" />
                <p className="font-body text-xs font-semibold text-amber-400 uppercase tracking-wider">Check Your Email</p>
              </div>
              <p className="font-body text-xs text-muted-foreground">{form.email}</p>
            </div>

            <div className="space-y-3">
              <a href={`https://mail.google.com`} target="_blank" rel="noopener noreferrer">
                <Button className="w-full rounded-xl h-11 font-body font-semibold gap-2"
                  style={{ background: "linear-gradient(135deg, hsl(45 80% 45%), hsl(45 80% 55%))" }}>
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-background">Open Mail App</span>
                </Button>
              </a>
              <Button variant="outline" onClick={() => { setShowSuccessDialog(false); navigate("/login"); }}
                className="w-full rounded-xl h-11 font-body text-sm border-border/30 bg-transparent text-muted-foreground hover:bg-muted/10">
                Go to Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
      `}</style>
    </>
  );
}
