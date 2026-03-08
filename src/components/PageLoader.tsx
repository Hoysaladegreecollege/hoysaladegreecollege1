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
      const conn = (navigator as any).connection;
      const isSlow = conn && (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.saveData);
      setTimeout(() => setShowLogo(false), isSlow ? 2500 : 4000);
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
          {/* Aurora ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(ellipse, hsla(var(--gold), 0.06) 0%, hsla(var(--primary), 0.04) 40%, transparent 70%)",
                animation: "splash-aurora-drift 6s ease-in-out infinite",
              }}
            />
          </div>

          {/* Ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="splash-particle"
                style={{
                  left: `${10 + (i * 9) % 80}%`,
                  top: `${15 + (i * 13) % 70}%`,
                  animationDelay: `${i * 0.35}s`,
                  width: `${3 + (i % 4)}px`,
                  height: `${3 + (i % 4)}px`,
                }}
              />
            ))}
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(hsla(var(--gold), 0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 30%, transparent 70%)",
            }}
          />

          <div className="flex flex-col items-center gap-7 splash-content relative z-10">
            {/* Logo with conic glow ring */}
            <div className="relative">
              <div className="splash-glow-ring" />
              {/* Outer ambient glow */}
              <div className="absolute -inset-6 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsla(var(--gold), 0.12) 0%, transparent 70%)",
                  animation: "splash-ambient-pulse 3s ease-in-out infinite",
                }}
              />
              <div className="w-[88px] h-[88px] rounded-[20px] overflow-hidden shadow-2xl splash-logo relative z-10"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 20px 60px -15px rgba(0,0,0,0.8), 0 0 40px -10px hsla(var(--gold), 0.15)",
                  background: "rgba(255,255,255,0.95)",
                }}
              >
                <img src={collegeLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center splash-text">
              <p className="font-display text-[22px] font-bold tracking-tight"
                style={{ color: "rgba(255,255,255,0.92)" }}>
                Hoysala Degree College
              </p>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase mt-2"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                Right Choice For Better Future
              </p>
            </div>

            {/* Premium progress bar */}
            <div className="w-[180px] h-[3px] rounded-full overflow-hidden mt-1 splash-progress-track"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div className="h-full rounded-full splash-progress-bar" />
            </div>

            {/* Powered by text */}
            <p className="font-body text-[8px] tracking-[0.2em] uppercase mt-1"
              style={{
                color: "rgba(255,255,255,0.18)",
                animation: "splash-text-in 0.7s cubic-bezier(0.16,1,0.3,1) 1.2s both",
              }}
            >
              Loading Experience
            </p>
          </div>
        </div>
      )}

      {/* Route progress bar */}
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
