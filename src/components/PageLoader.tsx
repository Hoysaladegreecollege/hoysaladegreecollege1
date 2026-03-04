import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import collegeLogo from "@/assets/college-logo.png";

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const isInitial = !sessionStorage.getItem("hdc-loaded");
    if (isInitial) {
      sessionStorage.setItem("hdc-loaded", "1");
      setShowLogo(true);
      // Shorter splash on slow connections (detected via Network Information API)
      const conn = (navigator as any).connection;
      const isSlow = conn && (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.saveData);
      setTimeout(() => setShowLogo(false), isSlow ? 2000 : 3500);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    const t1 = setTimeout(() => setProgress(35), 50);
    const t2 = setTimeout(() => setProgress(65), 150);
    const t3 = setTimeout(() => setProgress(90), 300);
    const t4 = setTimeout(() => setProgress(100), 450);
    const t5 = setTimeout(() => setLoading(false), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [location.pathname]);

  return (
    <>
      {/* Ultra Premium Splash Screen */}
      {showLogo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center splash-screen">
          {/* Ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="splash-particle"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.3}s`,
                  width: `${4 + i * 2}px`,
                  height: `${4 + i * 2}px`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-5 splash-content">
            {/* Logo with glow ring */}
            <div className="relative">
              <div className="splash-glow-ring" />
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl splash-logo relative z-10 border border-white/10">
                <img src={collegeLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center splash-text">
              <p className="font-display text-xl font-bold text-foreground tracking-tight">
                Hoysala Degree College
              </p>
              <p className="font-body text-[10px] text-muted-foreground tracking-[0.25em] uppercase mt-1.5">
                Right Choice For Better Future
              </p>
            </div>

            {/* Premium progress bar */}
            <div className="w-40 h-[3px] bg-muted/40 rounded-full overflow-hidden mt-3 splash-progress-track">
              <div className="h-full rounded-full splash-progress-bar" />
            </div>
          </div>
        </div>
      )}

      {/* Route progress bar - premium shimmer */}
      {loading && !showLogo && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="h-[2.5px] route-progress-bar transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}
