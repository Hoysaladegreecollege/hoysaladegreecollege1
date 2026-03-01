import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import collegeLogo from "@/assets/college-logo.png";

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Only show logo animation on initial load
    const isInitial = !sessionStorage.getItem("hdc-loaded");
    if (isInitial) {
      sessionStorage.setItem("hdc-loaded", "1");
      setShowLogo(true);
      setTimeout(() => setShowLogo(false), 2500);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    
    const t1 = setTimeout(() => setProgress(40), 50);
    const t2 = setTimeout(() => setProgress(70), 150);
    const t3 = setTimeout(() => setProgress(100), 300);
    const t4 = setTimeout(() => setLoading(false), 500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [location.pathname]);

  return (
    <>
      {/* Initial logo splash */}
      {showLogo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          style={{ animation: "logo-splash-out 0.5s cubic-bezier(0.16,1,0.3,1) 2s forwards" }}>
          <div className="flex flex-col items-center gap-4" style={{ animation: "logo-splash-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl"
              style={{ animation: "logo-spin-in 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
              <img src={collegeLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground animate-fade-in animation-delay-300">Hoysala Degree College</p>
              <p className="font-body text-[10px] text-muted-foreground animate-fade-in animation-delay-500 tracking-widest uppercase">Excellence in Education</p>
            </div>
            <div className="w-32 h-0.5 bg-muted rounded-full overflow-hidden mt-2 animate-fade-in animation-delay-400">
              <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                style={{ animation: "logo-progress 1.8s cubic-bezier(0.4,0,0.2,1) 0.3s forwards", width: "0%" }} />
            </div>
          </div>
        </div>
      )}

      {/* Route progress bar */}
      {loading && !showLogo && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="h-[3px] bg-gradient-to-r from-secondary via-primary to-secondary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}
