import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, Cake, Star, Sparkles, Heart, Gift } from "lucide-react";
import confetti from "canvas-confetti";

export default function BirthdayPopup() {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: student } = useQuery({
    queryKey: ["student-birthday-check", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("date_of_birth")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user && role === "student",
  });

  const { data: profile } = useQuery({
    queryKey: ["student-birthday-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user && role === "student",
  });

  const { data: birthdaySettings } = useQuery({
    queryKey: ["birthday-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("birthday_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user && role === "student",
  });

  useEffect(() => {
    if (!student?.date_of_birth) return;
    const today = new Date();
    const dob = new Date(student.date_of_birth);
    if (today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate()) {
      const shown = sessionStorage.getItem("birthday-popup-shown");
      if (!shown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("birthday-popup-shown", "true");
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F97316"] });
          setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } }), 600);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [student]);

  if (!isOpen) return null;

  const firstName = profile?.full_name?.split(" ")[0] || "Student";
  const principalName = birthdaySettings?.principal_name || "Sri Gopal H.R";
  const wishesMessage = birthdaySettings?.wishes_message || "On behalf of the entire Hoysala Degree College family and our Principal, we wish you a wonderful birthday filled with joy, success, and happiness. May this special day bring you closer to your dreams and aspirations.";
  const quote = birthdaySettings?.quote || "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.";

  return (
    <div
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center sm:p-4 animate-fade-in"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden animate-scale-bounce sm:rounded-[2rem] rounded-t-[2rem]"
        style={{
          background: "linear-gradient(180deg, hsl(230,12%,6%) 0%, hsl(228,10%,8%) 100%)",
          boxShadow: "0 32px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium header */}
        <div className="relative pt-10 pb-14 px-6 text-center overflow-hidden">
          {/* Radial glow */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "radial-gradient(circle at 50% 40%, hsl(var(--gold)), transparent 65%)" }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors duration-200 border border-white/[0.06]"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>

          {/* Floating decorations */}
          <div className="absolute top-6 left-8 animate-sparkle"><Star className="w-3.5 h-3.5 text-yellow-400/40" /></div>
          <div className="absolute top-12 right-12 animate-sparkle animation-delay-300"><Sparkles className="w-4 h-4 text-yellow-400/30" /></div>
          <div className="absolute bottom-10 left-12 animate-float"><Gift className="w-4 h-4 text-purple-400/30" /></div>
          <div className="absolute bottom-8 right-10 animate-sparkle animation-delay-600"><Star className="w-3 h-3 text-pink-400/30" /></div>

          {/* Cake icon */}
          <div className="relative mx-auto mb-5 w-[88px] h-[88px]">
            {/* Outer ring glow */}
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.15), transparent 70%)" }}
            />
            <div
              className="w-full h-full rounded-full flex items-center justify-center border border-white/[0.08]"
              style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(168,85,247,0.08))" }}
            >
              <Cake className="w-10 h-10 text-yellow-400/90" />
            </div>
          </div>

          <p className="font-body text-[11px] uppercase tracking-[0.25em] text-white/30 mb-2 font-medium">
            🎂 Celebrating You 🎂
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
            Happy Birthday!
          </h2>
          <p className="font-display text-lg text-white/50 mt-2 font-medium">
            Dear <span className="text-yellow-400/80">{firstName}</span>
          </p>

          {/* Wave separator */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 400 24" className="w-full" preserveAspectRatio="none">
              <path d="M0,24 Q100,0 200,12 T400,24 L400,24 L0,24 Z" fill="hsl(228,10%,8%)" />
            </svg>
          </div>
        </div>

        {/* Message body */}
        <div className="px-7 sm:px-8 pt-1 pb-3 text-center">
          <p className="font-body text-[13px] text-white/45 leading-[1.8]">
            {wishesMessage.includes("{principal}")
              ? wishesMessage.replace("{principal}", principalName)
              : <>On behalf of the entire <span className="font-semibold text-white/70">Hoysala Degree College</span> family and our <span className="font-semibold text-white/70">Principal {principalName}</span>, {wishesMessage.replace(/On behalf of the entire Hoysala Degree College family and our Principal, /i, "").replace(/on behalf of.*?principal,?\s*/i, "")}</>
            }
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400/50" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>

          {/* Quote */}
          <p className="font-display text-xs text-white/30 italic leading-relaxed max-w-xs mx-auto">
            "{quote}"
          </p>
        </div>

        {/* Footer */}
        <div className="px-7 sm:px-8 pt-3 pb-7">
          {/* Love note */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <Heart className="w-3 h-3 text-red-400/60 fill-red-400/60" />
            <span className="font-body text-[10px] text-white/25 uppercase tracking-widest">With love from HDC family</span>
            <Heart className="w-3 h-3 text-red-400/60 fill-red-400/60" />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="group relative w-full py-4 rounded-2xl font-body text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(var(--gold) / 0.9), hsl(42, 70%, 42%))",
              boxShadow: "0 8px 30px hsl(var(--gold) / 0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Shimmer */}
            <span className="absolute inset-0 overflow-hidden rounded-2xl">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </span>
            <span className="relative flex items-center justify-center gap-2">
              Thank You! <span className="text-base">🎉</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
