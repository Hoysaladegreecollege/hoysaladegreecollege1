import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Eye, EyeOff, Sparkles, Lock, Mail, User, ArrowLeft, Shield, GraduationCap } from "lucide-react";
import collegeLogo from "@/assets/college-logo.png";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { validatePassword, PASSWORD_REQUIREMENTS } from "@/lib/password-validation";

type Role = "student" | "teacher" | "principal" | "admin";

const roles: { value: Role; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "teacher", label: "Teacher", icon: "📚" },
  { value: "principal", label: "Principal", icon: "🏛️" },
  { value: "admin", label: "Admin", icon: "⚙️" },
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
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  // Password strength meter
  useEffect(() => {
    if (!password) { setPasswordStrength(0); return; }
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

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

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-destructive";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SEOHead title="Login" description="Sign in to Hoysala Degree College portal. Access student, teacher, principal, and admin dashboards." canonical="/login" noIndex />

      {/* Deep graphite background */}
      <div className="absolute inset-0 bg-[#0E1016]" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsl(42 87% 55%), transparent 70%)" }} />

      {/* Micro grid pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(hsla(42,87%,55%,0.15) 1px, transparent 1px), linear-gradient(90deg, hsla(42,87%,55%,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Floating ambient dots */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute rounded-full animate-float"
          style={{
            width: `${6 + i * 3}px`, height: `${6 + i * 3}px`,
            left: `${20 + i * 20}%`, top: `${25 + (i % 2) * 40}%`,
            background: `hsla(42, 87%, 55%, ${0.08 + i * 0.02})`,
            animationDelay: `${i * 1.2}s`,
            filter: "blur(1px)",
          }} />
      ))}

      <div className="relative z-10 w-full max-w-[420px] mx-4 login-card-enter">
        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, hsla(228, 10%, 10%, 0.95), hsla(228, 10%, 7%, 0.98))",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px hsla(42, 87%, 55%, 0.08), inset 0 1px 0 hsla(0,0%,100%,0.04)",
            backdropFilter: "blur(40px)",
          }}>

          {/* Top gold accent line */}
          <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent 10%, hsl(42 87% 55% / 0.5) 50%, transparent 90%)" }} />

          <div className="px-8 pt-10 pb-8 sm:px-10">
            {/* Logo section */}
            <div className="text-center mb-9">
              <div className="relative inline-flex items-center justify-center mb-5">
                {/* Glow ring */}
                <div className="absolute -inset-3 rounded-[1.25rem] opacity-20"
                  style={{ background: "conic-gradient(from 180deg, hsl(42 87% 55%), hsl(42 60% 35%), hsl(42 87% 55%))" }} />
                <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden border border-white/[0.08]"
                  style={{ boxShadow: "0 8px 32px rgba(198, 167, 94, 0.15)" }}>
                  <img src={collegeLogo} alt="Hoysala Degree College Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <h1 className="font-display text-[22px] font-bold text-white tracking-tight">
                {canSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="font-body text-[13px] text-white/40 mt-2 tracking-wide">
                {canSignup ? "Register a new user account" : "Sign in to your college portal"}
              </p>
            </div>

            {/* Role Selection (signup mode) */}
            {canSignup && (
              <div className="mb-7">
                <label className="font-body text-[10px] font-semibold text-white/50 block mb-3 uppercase tracking-[0.15em]">Select Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {roles.map((r) => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`p-3 rounded-2xl border text-center transition-all duration-300 font-body text-[11px] hover:scale-[1.03] ${
                        role === r.value
                          ? "border-secondary/40 bg-secondary/10 text-secondary font-bold"
                          : "border-white/[0.06] text-white/40 hover:border-white/10 hover:text-white/60"
                      }`}>
                      <div className="text-lg mb-1">{r.icon}</div>{r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {canSignup && (
                <div>
                  <label className="font-body text-[10px] font-semibold text-white/50 block mb-2.5 uppercase tracking-[0.15em]">Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] transition-colors duration-300 ${focused === "fullName" ? "text-secondary" : "text-white/20"}`} />
                    <input
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className={`w-full rounded-xl px-4 py-3.5 pl-11 font-body text-[13px] text-white bg-white/[0.04] border transition-all duration-300 placeholder:text-white/15 focus:outline-none ${
                        focused === "fullName" ? "border-secondary/40 ring-2 ring-secondary/10 bg-white/[0.06]" : "border-white/[0.06] hover:border-white/10"
                      }`}
                      placeholder="Enter full name"
                      onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-body text-[10px] font-semibold text-white/50 block mb-2.5 uppercase tracking-[0.15em]">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] transition-colors duration-300 ${focused === "email" ? "text-secondary" : "text-white/20"}`} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3.5 pl-11 font-body text-[13px] text-white bg-white/[0.04] border transition-all duration-300 placeholder:text-white/15 focus:outline-none ${
                      focused === "email" ? "border-secondary/40 ring-2 ring-secondary/10 bg-white/[0.06]" : "border-white/[0.06] hover:border-white/10"
                    }`}
                    placeholder="you@example.com"
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-[10px] font-semibold text-white/50 block mb-2.5 uppercase tracking-[0.15em]">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] transition-colors duration-300 ${focused === "password" ? "text-secondary" : "text-white/20"}`} />
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3.5 pl-11 pr-12 font-body text-[13px] text-white bg-white/[0.04] border transition-all duration-300 placeholder:text-white/15 focus:outline-none ${
                      focused === "password" ? "border-secondary/40 ring-2 ring-secondary/10 bg-white/[0.06]" : "border-white/[0.06] hover:border-white/10"
                    }`}
                    placeholder="••••••••" minLength={8}
                    onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-1 rounded-lg">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }} />
                    </div>
                    <span className={`font-body text-[10px] font-medium ${
                      passwordStrength <= 25 ? "text-destructive" :
                      passwordStrength <= 50 ? "text-orange-400" :
                      passwordStrength <= 75 ? "text-amber-400" : "text-emerald-400"
                    }`}>{getStrengthLabel()}</span>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <Button
                  className="w-full rounded-xl font-body font-semibold py-6 text-[14px] relative overflow-hidden transition-all duration-300 group border-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(42 87% 50%), hsl(42 70% 42%))",
                    boxShadow: loading ? "none" : "0 8px 24px hsla(42, 87%, 55%, 0.2), inset 0 1px 0 hsla(0,0%,100%,0.15)",
                    color: "#0E1016",
                  }}
                  type="submit"
                  disabled={loading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"
                    style={{ transition: "transform 0.7s ease, opacity 0.3s ease" }} />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0E1016]/20 border-t-[#0E1016] rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        {canSignup ? "Create Account" : "Sign In"}
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-7 pt-6 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-white/20">
                <Shield className="w-3 h-3" />
                <span className="font-body text-[10px]">Encrypted</span>
              </div>
              <div className="w-px h-3 bg-white/[0.06]" />
              <div className="flex items-center gap-1.5 text-white/20">
                <Lock className="w-3 h-3" />
                <span className="font-body text-[10px]">Secure Login</span>
              </div>
              <div className="w-px h-3 bg-white/[0.06]" />
              <div className="flex items-center gap-1.5 text-white/20">
                <GraduationCap className="w-3 h-3" />
                <span className="font-body text-[10px]">BU Affiliated</span>
              </div>
            </div>

            {/* Back link */}
            <div className="text-center mt-5">
              <Link to="/" className="font-body text-[11px] text-white/25 hover:text-secondary/70 transition-colors inline-flex items-center gap-1.5 group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center font-body text-[10px] text-white/15 mt-6 tracking-wide">
          Hoysala Degree College · Affiliated to Bangalore University
        </p>
      </div>

      <style>{`
        .login-card-enter {
          animation: loginCardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes loginCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
