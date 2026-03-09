import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// Use the lightweight uploaded logo (same as HTML splash) for instant loading
const collegeLogo = "/lovable-uploads/bacc5b2d-3f25-473a-a2ee-a0d75a0cb7e3.png";

const SPLASH_DURATION = 3800;

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const isInitial = !sessionStorage.getItem("hdc-loaded");
    if (isInitial) {
      sessionStorage.setItem("hdc-loaded", "1");
      setShowLogo(true);
      setTimeout(() => setFadeOut(true), SPLASH_DURATION - 600);
      setTimeout(() => setShowLogo(false), SPLASH_DURATION);
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
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center flex-col transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: "#070810" }}
        >
          {/* Ambient glow orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07]"
              style={{
                background: "radial-gradient(circle, hsl(40 80% 55%), transparent 70%)",
                top: "10%",
                left: "15%",
                animation: "splash-orb-float 6s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
              style={{
                background: "radial-gradient(circle, hsl(40 70% 60%), transparent 70%)",
                bottom: "15%",
                right: "10%",
                animation: "splash-orb-float 7s ease-in-out infinite reverse",
              }}
            />
            <div
              className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04]"
              style={{
                background: "radial-gradient(circle, hsl(220 40% 50%), transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "splash-orb-pulse 4s ease-in-out infinite",
              }}
            />
          </div>

          {/* Particle ring */}
          <div className="absolute" style={{ animation: "splash-ring-spin 20s linear infinite" }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `hsl(${38 + i * 3} ${70 + i * 2}% ${55 + i * 3}%)`,
                  opacity: 0.3 + (i * 0.05),
                  top: `${Math.sin((i / 12) * Math.PI * 2) * 120}px`,
                  left: `${Math.cos((i / 12) * Math.PI * 2) * 120}px`,
                  animation: `splash-particle-twinkle ${1.5 + (i * 0.2)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Logo container with glow */}
          <div className="relative" style={{ animation: "splash-logo-entrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-0"
              style={{
                background: "linear-gradient(135deg, hsl(40 80% 55% / 0.4), hsl(40 60% 40% / 0.2))",
                animation: "splash-glow-pulse 2.5s ease-in-out 0.8s infinite",
                transform: "scale(1.5)",
              }}
            />
            <div
              className="relative w-[88px] h-[88px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(245,240,230,0.95))",
                boxShadow: "0 20px 60px -15px rgba(198, 167, 94, 0.3), 0 0 40px -10px rgba(198, 167, 94, 0.15)",
              }}
            >
              <img
                src={collegeLogo}
                alt="Hoysala Degree College"
                className="w-full h-full object-contain p-1"
                style={{ animation: "splash-logo-breathe 3s ease-in-out 1s infinite" }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mt-7 relative z-10">
            <p
              className="font-display text-[22px] font-bold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #F5E6C8 0%, #C6A75E 40%, #E8D5A3 70%, #C6A75E 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "splash-title-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both, splash-shimmer 3s linear 1.5s infinite",
              }}
            >
              Hoysala Degree College
            </p>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mt-2 font-medium"
              style={{
                color: "rgba(198, 167, 94, 0.45)",
                animation: "splash-subtitle-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both",
              }}
            >
              Right Choice For Better Future
            </p>
          </div>

          {/* Progress bar */}
          <div
            className="mt-10 relative overflow-hidden rounded-full"
            style={{
              width: "180px",
              height: "3px",
              background: "rgba(255,255,255,0.04)",
              animation: "splash-bar-entrance 0.6s ease-out 0.9s both",
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(40 80% 50%), hsl(38 90% 60%), hsl(40 80% 50%))",
                backgroundSize: "200% 100%",
                animation: `splash-bar-fill ${SPLASH_DURATION - 800}ms cubic-bezier(0.4, 0, 0.2, 1) 1s forwards, splash-bar-shimmer 1.5s linear infinite`,
                width: "0%",
                boxShadow: "0 0 12px hsl(40 80% 50% / 0.5), 0 0 4px hsl(40 80% 50% / 0.3)",
              }}
            />
          </div>

          {/* Bottom subtle branding */}
          <p
            className="absolute bottom-8 text-[9px] tracking-[0.2em] uppercase font-medium"
            style={{
              color: "rgba(255,255,255,0.08)",
              animation: "splash-subtitle-entrance 0.8s ease-out 1.2s both",
            }}
          >
            Est. Since 2004
          </p>
        </div>
      )}

      {loading && !showLogo && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="h-[2.5px] rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(40 80% 50%), hsl(38 90% 60%), hsl(40 80% 50%))",
              backgroundSize: "200% 100%",
              animation: "splash-bar-shimmer 1.5s linear infinite",
              boxShadow: "0 0 8px hsl(40 80% 50% / 0.4)",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes splash-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes splash-orb-pulse {
          0%, 100% { opacity: 0.04; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.08; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes splash-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes splash-particle-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.8); }
        }
        @keyframes splash-logo-entrance {
          from { opacity: 0; transform: scale(0.6) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splash-logo-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes splash-glow-pulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes splash-title-entrance {
          from { opacity: 0; transform: translateY(15px); letter-spacing: 0.1em; }
          to { opacity: 1; transform: translateY(0); letter-spacing: 0.05em; }
        }
        @keyframes splash-subtitle-entrance {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-shimmer {
          to { background-position: 200% center; }
        }
        @keyframes splash-bar-entrance {
          from { opacity: 0; width: 0; }
          to { opacity: 1; width: 180px; }
        }
        @keyframes splash-bar-fill {
          to { width: 100%; }
        }
        @keyframes splash-bar-shimmer {
          from { background-position: 0% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
