import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, Cake, PartyPopper, Star, Sparkles } from "lucide-react";
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
          // Fire confetti
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F97316"] });
          setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } }), 600);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [student]);

  if (!isOpen) return null;

  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[250] flex items-end sm:items-center justify-center sm:p-4 animate-fade-in" onClick={() => setIsOpen(false)}>
      <div
        className="bg-card sm:rounded-3xl rounded-t-3xl border border-border w-full max-w-md shadow-2xl overflow-hidden animate-scale-bounce"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative header */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-secondary/80 p-8 pb-10 text-center overflow-hidden">
          {/* Floating decorations */}
          <div className="absolute top-3 left-6 animate-sparkle"><Star className="w-4 h-4 text-secondary/60" /></div>
          <div className="absolute top-8 right-8 animate-sparkle animation-delay-300"><Sparkles className="w-5 h-5 text-secondary/50" /></div>
          <div className="absolute bottom-4 left-10 animate-sparkle animation-delay-600"><Star className="w-3 h-3 text-secondary/40" /></div>
          <div className="absolute top-4 right-4 animate-float"><PartyPopper className="w-6 h-6 text-secondary/50" /></div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </button>

          {/* Cake icon */}
          <div className="w-20 h-20 rounded-full bg-primary-foreground/15 flex items-center justify-center mx-auto mb-4 animate-float border-2 border-primary-foreground/20">
            <Cake className="w-10 h-10 text-primary-foreground" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground leading-tight">
            Happy Birthday! 🎂
          </h2>
          <p className="font-display text-lg text-primary-foreground/80 mt-1 italic">
            Dear {firstName}
          </p>

          {/* Bottom wave */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 400 30" className="w-full" preserveAspectRatio="none">
              <path d="M0,30 Q100,0 200,15 T400,30 L400,30 L0,30 Z" fill="hsl(var(--card))" />
            </svg>
          </div>
        </div>

        {/* Message body */}
        <div className="px-6 pt-2 pb-4 text-center">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            On behalf of the entire <span className="font-semibold text-foreground">Hoysala Degree College</span> family
            and our <span className="font-semibold text-foreground">Principal</span>, we wish you a wonderful birthday
            filled with joy, success, and happiness.
          </p>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-3">
            May this special day bring you closer to your dreams and aspirations. 🌟
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-2 my-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <Sparkles className="w-4 h-4 text-secondary" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <p className="font-display text-xs text-muted-foreground italic">
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 transition-all duration-200 btn-magnetic"
          >
            Thank You! 🎉
          </button>
        </div>
      </div>
    </div>
  );
}
