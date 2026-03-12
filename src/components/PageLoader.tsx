import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const isInitial = !sessionStorage.getItem("hdc-loaded");
    if (isInitial) {
      sessionStorage.setItem("hdc-loaded", "1");
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 3200);
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
      {showSplash && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center flex-col gap-5" style={{ background: "#070810" }}>
          {/* Ambient gold glow orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsla(42,75%,55%,0.06) 0%, transparent 70%)", filter: "blur(40px)", animation: "splash-glow 3s ease-in-out infinite alternate" }} />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsla(220,80%,55%,0.04) 0%, transparent 70%)", filter: "blur(30px)", animation: "splash-glow 4s ease-in-out 1s infinite alternate" }} />

          {/* Orbital particle ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none" style={{ animation: "splash-orbit 8s linear infinite" }}>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <div key={deg} className="absolute w-1 h-1 rounded-full" style={{
                background: `hsla(42,75%,55%,${0.15 + (deg / 1000)})`,
                top: "50%", left: "50%",
                transform: `rotate(${deg}deg) translateX(88px)`,
                boxShadow: "0 0 6px hsla(42,75%,55%,0.3)",
              }} />
            ))}
          </div>

          {/* Floating dust motes */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full pointer-events-none" style={{
              width: `${1 + i * 0.3}px`, height: `${1 + i * 0.3}px`,
              background: `hsla(42,75%,55%,${0.08 + i * 0.02})`,
              top: `${20 + i * 12}%`, left: `${15 + i * 13}%`,
              animation: `splash-dust ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite alternate`,
            }} />
          ))}

          {/* Logo with scale-in */}
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden shadow-lg relative" style={{ background: "rgba(255,255,255,0.95)", animation: "splash-logo-in 0.8s cubic-bezier(0.16,1,0.3,1) forwards", boxShadow: "0 8px 40px rgba(0,0,0,0.3), 0 0 30px hsla(42,75%,55%,0.1)" }}>
            <img src="/lovable-uploads/bacc5b2d-3f25-473a-a2ee-a0d75a0cb7e3.png" alt="Logo" className="w-full h-full object-contain" fetchPriority="high" />
          </div>

          <div className="text-center" style={{ animation: "splash-text-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
            <p className="font-display text-xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
              Hoysala Degree College
            </p>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Right Choice For Better Future
            </p>
          </div>

          <div className="w-40 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)", animation: "splash-text-in 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(42,75%,55%), hsl(42,75%,65%))", animation: "rl-fill 2.5s ease-out forwards", width: "0%", boxShadow: "0 0 12px hsla(42,75%,55%,0.4)" }} />
          </div>

          <style>{`
            @keyframes splash-glow { 0% { opacity: 0.5; transform: scale(1); } 100% { opacity: 1; transform: scale(1.1); } }
            @keyframes splash-orbit { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
            @keyframes splash-dust { 0% { transform: translateY(0) translateX(0); opacity: 0.1; } 100% { transform: translateY(-20px) translateX(10px); opacity: 0.3; } }
            @keyframes splash-logo-in { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes splash-text-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}

      {loading && !showSplash && (
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
