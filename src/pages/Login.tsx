import { useState } from "react";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { signIn, signUp, role: currentUserRole } = useAuth();
  const navigate = useNavigate();

  // Only admins can access signup mode
  const canSignup = isSignupMode && currentUserRole === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } else {
      if (!canSignup) {
        toast.error("Only admins can create new accounts");
        setLoading(false);
        return;
      }
      if (!fullName) {
        toast.error("Please enter the full name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName, role);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! The user can now sign in after email verification.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
            <GraduationCap className="w-9 h-9 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Hoysala Degree College</h2>
          <p className="font-body text-sm opacity-70 leading-relaxed">
            Access your personalized dashboard to manage academic activities, view attendance, marks, and stay updated with college announcements.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-display text-lg font-bold text-primary">Hoysala Degree College</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {canSignup ? "Create New Account" : "Welcome Back"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {canSignup ? "Admin: Register a new user account" : "Sign in to your account"}
            </p>
          </div>

          {/* Role Selection (signup only) */}
          {canSignup && (
            <div className="mb-6">
              <label className="font-body text-sm font-medium text-foreground block mb-2">Select Role</label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-lg border text-center transition-all font-body text-xs ${
                      role === r.value
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="text-xl mb-1">{r.icon}</div>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {canSignup && (
              <div>
                <label className="font-body text-sm font-medium text-foreground block mb-1">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter full name"
                />
              </div>
            )}
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2.5 pr-10 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full font-body bg-primary text-primary-foreground" type="submit" disabled={loading}>
              {loading ? "Please wait..." : canSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* No signup link for regular users */}
          <div className="text-center mt-4">
            <Link to="/" className="font-body text-xs text-muted-foreground hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
