import { Heart, Star, Coffee, Hexagon } from "lucide-react";

export function CreditsFooter() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center space-y-5">
      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-secondary/30" />
        <div className="relative">
          <Hexagon className="w-4 h-4 text-secondary/30" />
          <div className="absolute inset-0 blur-sm bg-secondary/10 rounded-full" />
        </div>
        <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-secondary/30" />
      </div>

      {/* Main footer badge */}
      <div className="group/footer inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-card/50 backdrop-blur-xl border border-border/30 text-muted-foreground text-xs sm:text-sm font-body shadow-lg cursor-default hover:border-secondary/25 transition-all duration-500">
        Made with <Heart className="w-3.5 h-3.5 text-red-500" /> by Pavan A
        <span className="text-secondary/30">|</span>
        <Star className="w-3.5 h-3.5 text-secondary" /> 2024–2025
      </div>

      {/* System footer */}
      <div className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.3em] uppercase">
        [ END_OF_CREDITS // HOYSALA_SYS v2.5 ]
      </div>
    </div>
  );
}
