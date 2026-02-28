import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { GraduationCap, Eye, EyeOff, Sparkles, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { validatePassword, PASSWORD_REQUIREMENTS } from "@/lib/password-validation";

type Role = "student" | "teacher" | "principal" | "admin";

const roles: { value: Role; label: string; icon: string; color: string }[] = [
  { value: "student", label: "Student", icon: "🎓", color: "from-blue-500/20 to-blue-600/10" },
  { value: "teacher", label: "Teacher", icon: "📚", color: "from-green-500/20 to-green-600/10" },
  { value: "principal", label: "Principal", icon: "🏛️", color: "from-purple-500/20 to-purple-600/10" },
  { value: "admin", label: "Admin", icon: "⚙️", color: "from-amber-500/20 to-amber-600/10" },
];

export default function Login() {
  const [searchParams] = useSearchParams();
  const isSignupMode = searchParams.get("mode") === "signup";
  const [mode, setMode] = useState<"login" | "signup">(isSignupMode ? "signup" : "login");
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { signIn, signUp, role: currentUserRole, user } = useAuth();
  const navigate = useNavigate();

  const canSignup = isSignupMode && currentUserRole === "admin";

  useEffect(() => {
    if (user && currentUserRole && !isSignupMode) {
      const path = currentUserRole === "admin" ? "/dashboard/admin"
        : currentUserRole === "principal" ? "/dashboard/principal"
        : currentUserRole === "teacher" ? "/dashboard/teacher"
        : "/dashboard/student";
      navigate(path, { replace: true });
    }
  }, [user, currentUserRole, isSignupMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    if (mode === "signup") {
      const pwCheck = validatePassword(password);
      if (!pwCheck.valid) { toast.error(pwCheck.message); return; }
    }
    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) { toast.error(error.message); setLoading(false); }
      else toast.success("Signed in successfully!");
    } else {
      if (!canSignup) { toast.error("Only admins can create new accounts"); setLoading(false); return; }
      if (!fullName) { toast.error("Please enter the full name"); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName, role);
      if (error) toast.error(error.message);
      else toast.success("Account created! User can sign in after email verification.");
      setLoading(false);
    }
  };

  const inputBase = "w-full border-2 rounded-2xl px-4 py-3.5 font-body text-sm bg-background/60 focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/50";
  const inputClass = (name: string) => `${inputBase} ${focused === name ? "border-secondary/60 ring-4 ring-secondary/10 bg-background" : "border-border/50 hover:border-border"}`;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SEOHead title="Login" description="Sign in to Hoysala Degree College portal. Access student, teacher, principal, and admin dashboards." canonical="/login" noIndex />
      {/* Animated Background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, hsl(217 72% 14%), hsl(217 72% 20%), hsl(217 60% 18%), hsl(217 72% 12%))",
      }} />
      {/* Gold orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-float" style={{ background: "radial-gradient(circle, hsla(42,87%,55%,0.8), transparent 70%)", animationDelay: "0s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-8 animate-float" style={{ background: "radial-gradient(circle, hsla(42,87%,55%,0.6), transparent 70%)", animationDelay: "1.5s" }} />
      <div className="absolute top-3/4 left-1/3 w-32 h-32 rounded-full opacity-5 animate-float" style={{ background: "radial-gradient(circle, hsla(42,87%,55%,0.5), transparent 70%)", animationDelay: "3s" }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-3" style={{ backgroundImage: "linear-gradient(hsla(42,87%,55%,0.05) 1px, transparent 1px), linear-gradient(90deg, hsla(42,87%,55%,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="relative bg-card/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-navy-dark flex items-center justify-center shadow-2xl shadow-primary/30 border border-secondary/20">
                  <GraduationCap className="w-10 h-10 text-secondary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {canSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-1.5">
                {canSignup ? "Register a new user account" : "Hoysala Degree College Portal"}
              </p>
            </div>

            {/* Role Selection (signup mode) */}
            {canSignup && (
              <div className="mb-6">
                <label className="font-body text-xs font-bold text-foreground block mb-3 uppercase tracking-wider">Select Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {roles.map((r) => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all duration-300 font-body text-xs hover:scale-105 ${
                        role === r.value
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-lg shadow-primary/10"
                          : "border-border/50 text-muted-foreground hover:border-border"
                      }`}>
                      <div className="text-xl mb-1">{r.icon}</div>{r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {canSignup && (
                <div>
                  <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className={`${inputClass("fullName")} pl-11`}
                      placeholder="Enter full name"
                      onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass("email")} pl-11`}
                    placeholder="you@example.com"
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass("password")} pl-11 pr-12`}
                    placeholder="••••••••" minLength={8}
                    onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full rounded-2xl font-body font-bold py-6 text-base relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group"
                  type="submit"
                  disabled={loading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {canSignup ? "Create Account" : "Sign In to Portal"}
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>

            <div className="text-center mt-6">
              <Link to="/" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center font-body text-xs text-white/30 mt-6">
          Hoysala Degree College · Affiliated to Bangalore University
        </p>
      </div>
    </div>
  );
}
