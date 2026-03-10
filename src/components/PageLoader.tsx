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
      setTimeout(() => setShowLogo(false), 3000);
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
      {showLogo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center flex-col gap-5" style={{ background: "#070810" }}>
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden shadow-lg" style={{ background: "rgba(255,255,255,0.95)" }}>
            <img src={collegeLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
              Hoysala Degree College
            </p>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Right Choice For Better Future
            </p>
          </div>
          <div className="w-40 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ animation: "rl-fill 2.5s ease-out forwards", width: "0%" }} />
          </div>
        </div>
      )}

      {loading && !showLogo && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="h-[2.5px] bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}
