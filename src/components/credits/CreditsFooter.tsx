import { Heart, Star, Coffee } from "lucide-react";

export function CreditsFooter() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-border" />
        <Coffee className="w-4 h-4 text-muted-foreground/50 animate-[creditsFloat_3s_ease-in-out_infinite]" />
        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-border" />
      </div>
      <div className="group/footer inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-xl border border-border/30 text-muted-foreground text-xs sm:text-sm font-body shadow-lg cursor-default hover:border-secondary/20 hover:shadow-[0_8px_30px_-10px_hsl(var(--secondary)/0.15)] hover:-translate-y-1 transition-all duration-500">
        Made with <Heart className="w-3.5 h-3.5 text-red-500 animate-[creditsPulseGlow_2s_ease-in-out_infinite] group-hover/footer:scale-125 transition-transform duration-300" /> by Pavan A
        <span className="text-border">•</span>
        <Star className="w-3.5 h-3.5 text-secondary group-hover/footer:rotate-[72deg] transition-transform duration-500" /> 2024–2025
      </div>
    </div>
  );
}
