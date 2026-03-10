import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

const collegeLogo = "/lovable-uploads/bacc5b2d-3f25-473a-a2ee-a0d75a0cb7e3.png";
const SPLASH_DURATION = 4200;

// Generate deterministic particles for the orbital ring
const particles = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const radius = 100 + (i % 3) * 15;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    size: 1.5 + (i % 4) * 0.5,
    hue: 36 + i * 2,
    sat: 65 + (i % 5) * 5,
    light: 50 + (i % 6) * 3,
    delay: i * 0.12,
    duration: 1.8 + (i % 4) * 0.3,
  };
});

// Floating dust motes
const dustMotes = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  opacity: 0.05 + Math.random() * 0.1,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 3,
}));

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [phase, setPhase] = useState<"enter" | "active" | "exit">("enter");

  useEffect(() => {
    const isInitial = !sessionStorage.getItem("hdc-loaded");
    if (isInitial) {
      sessionStorage.setItem("hdc-loaded", "1");
      setShowSplash(true);
      setPhase("enter");
      setTimeout(() => setPhase("active"), 100);
      setTimeout(() => setPhase("exit"), SPLASH_DURATION - 700);
      setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    const t1 = setTimeout(() => setProgress(30), 40);
    const t2 = setTimeout(() => setProgress(60), 130);
    const t3 = setTimeout(() => setProgress(85), 280);
    const t4 = setTimeout(() => setProgress(100), 420);
    const t5 = setTimeout(() => setLoading(false), 550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [location.pathname]);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center flex-col overflow-hidden`}
          style={{
            background: "radial-gradient(ellipse at 50% 40%, #0C0E1A, #070810 70%)",
            opacity: phase === "exit" ? 0 : 1,
            transform: phase === "exit" ? "scale(1.03)" : "scale(1)",
            transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Floating dust motes */}
          <div className="absolute inset-0 pointer-events-none">
            {dustMotes.map((m, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  width: m.size,
                  height: m.size,
                  background: `hsla(40, 70%, 60%, ${m.opacity})`,
                  animation: `splash-dust-drift ${m.duration}s ease-in-out ${m.delay}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Ambient glow orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-[450px] h-[450px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsla(40,80%,55%,0.07), transparent 70%)",
                top: "5%",
                left: "10%",
                animation: "splash-orb-float 7s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-[380px] h-[380px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsla(40,65%,60%,0.05), transparent 70%)",
                bottom: "10%",
                right: "5%",
                animation: "splash-orb-float 9s ease-in-out infinite reverse",
              }}
            />
            <div
              className="absolute w-[280px] h-[280px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsla(220,40%,45%,0.04), transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "splash-core-pulse 3.5s ease-in-out infinite",
              }}
            />
          </div>

          {/* Orbital particle ring */}
          <div className="absolute" style={{ animation: "splash-ring-spin 25s linear infinite" }}>
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: `hsl(${p.hue} ${p.sat}% ${p.light}%)`,
                  top: p.y,
                  left: p.x,
                  opacity: 0,
                  animation: `splash-particle-appear 0.5s ease-out ${p.delay + 0.5}s forwards, splash-particle-glow ${p.duration}s ease-in-out ${p.delay + 1}s infinite`,
                  boxShadow: `0 0 ${p.size * 3}px hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0.4)`,
                }}
              />
            ))}
          </div>

          {/* Secondary ring - counter rotate */}
          <div className="absolute" style={{ animation: "splash-ring-spin 35s linear infinite reverse" }}>
            {[...Array(8)].map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 1,
                    height: 1,
                    background: `hsla(40, 50%, 60%, 0.15)`,
                    top: Math.sin(a) * 140,
                    left: Math.cos(a) * 140,
                    animation: `splash-particle-glow ${2 + i * 0.2}s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              );
            })}
          </div>

          {/* Logo assembly */}
          <div
            className="relative"
            style={{
              animation: "splash-logo-entrance 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-6 rounded-[26px]"
              style={{
                background: "radial-gradient(circle, hsla(40,80%,55%,0.2), transparent 70%)",
                filter: "blur(16px)",
                opacity: 0,
                animation: "splash-glow-breathe 3s ease-in-out 0.7s infinite",
              }}
            />

            {/* Rotating border accent */}
            <div
              className="absolute -inset-1 rounded-[22px] overflow-hidden"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, hsla(40,80%,60%,0.25), transparent, hsla(40,80%,60%,0.15), transparent)",
                animation: "splash-ring-spin 6s linear infinite",
                opacity: 0,
                animationDelay: "0.8s",
                animationFillMode: "forwards",
              }}
            >
              <div className="absolute inset-[1px] rounded-[21px] bg-[#070810]" />
            </div>

            {/* Logo card */}
            <div
              className="relative w-[92px] h-[92px] rounded-[20px] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(248,243,233,0.95))",
                boxShadow: `
                  0 24px 64px -16px rgba(198,167,94,0.28),
                  0 12px 32px -8px rgba(0,0,0,0.5),
                  inset 0 1px 0 rgba(255,255,255,0.7),
                  inset 0 -1px 0 rgba(0,0,0,0.05)
                `,
              }}
            >
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "splash-card-shimmer 3s ease-in-out 1.5s infinite",
                }}
              />
              <img
                src={collegeLogo}
                alt="Hoysala Degree College"
                className="w-full h-full object-contain p-1.5 relative z-0"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                style={{ animation: "splash-logo-breathe 3.5s ease-in-out 1s infinite" }}
              />
            </div>
          </div>

          {/* Title block */}
          <div className="text-center mt-8 relative z-10">
            <h1
              className="font-display text-[23px] font-bold tracking-wide m-0"
              style={{
                background: "linear-gradient(135deg, #F5E6C8 0%, #C6A75E 35%, #E8D5A3 65%, #C6A75E 100%)",
                backgroundSize: "300% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: 0,
                animation:
                  "splash-title-entrance 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s forwards, splash-text-shimmer 4s linear 2s infinite",
              }}
            >
              Hoysala Degree College
            </h1>
            <p
              className="text-[9px] tracking-[0.35em] uppercase mt-2 font-medium"
              style={{
                color: "rgba(198,167,94,0.4)",
                opacity: 0,
                animation: "splash-subtitle-entrance 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s forwards",
              }}
            >
              Right Choice For Better Future
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div
                className="h-[1px] w-8"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.25))",
                  opacity: 0,
                  animation: "splash-subtitle-entrance 0.5s ease-out 0.7s forwards",
                }}
              />
              <div
                className="w-1 h-1 rounded-full"
                style={{
                  background: "rgba(198,167,94,0.3)",
                  opacity: 0,
                  animation:
                    "splash-subtitle-entrance 0.5s ease-out 0.75s forwards, splash-particle-glow 2s ease-in-out 1.5s infinite",
                }}
              />
              <div
                className="h-[1px] w-8"
                style={{
                  background: "linear-gradient(90deg, rgba(198,167,94,0.25), transparent)",
                  opacity: 0,
                  animation: "splash-subtitle-entrance 0.5s ease-out 0.7s forwards",
                }}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="mt-10 relative overflow-hidden rounded-full"
            style={{
              width: "160px",
              height: "2px",
              background: "rgba(255,255,255,0.03)",
              opacity: 0,
              animation: "splash-subtitle-entrance 0.5s ease-out 0.85s forwards",
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, hsla(40,80%,50%,0.8), hsl(38,90%,60%), hsla(40,80%,50%,0.8))",
                backgroundSize: "200% 100%",
                animation: `splash-bar-fill ${SPLASH_DURATION - 1000}ms cubic-bezier(0.4,0,0.2,1) 1s forwards, splash-bar-shimmer 1.5s linear infinite`,
                width: "0%",
                boxShadow: "0 0 12px hsla(40,80%,55%,0.5), 0 0 4px hsla(40,80%,55%,0.3)",
              }}
            />
            {/* Progress glow tip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, hsla(40,85%,60%,0.6), transparent 70%)",
                filter: "blur(2px)",
                animation: `splash-bar-fill ${SPLASH_DURATION - 1000}ms cubic-bezier(0.4,0,0.2,1) 1s forwards`,
                left: "0%",
              }}
            />
          </div>

          {/* Bottom branding */}
          <p
            className="absolute bottom-7 text-[8px] tracking-[0.25em] uppercase font-medium"
            style={{
              color: "rgba(255,255,255,0.06)",
              opacity: 0,
              animation: "splash-subtitle-entrance 0.6s ease-out 1.1s forwards",
            }}
          >
            Est. Since 2019
          </p>
        </div>
      )}

      {/* Route transition progress bar */}
      {loading && !showSplash && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="h-[2px] rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(40,80%,50%), hsl(38,90%,60%), hsl(40,80%,50%))",
              backgroundSize: "200% 100%",
              animation: "splash-bar-shimmer 1.5s linear infinite",
              boxShadow: "0 0 8px hsla(40,80%,50%,0.4)",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes splash-dust-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: var(--tw-opacity, 0.08); }
          25% { transform: translate(10px, -8px) scale(1.3); }
          50% { transform: translate(-5px, -15px) scale(0.8); opacity: calc(var(--tw-opacity, 0.08) * 2); }
          75% { transform: translate(-12px, -5px) scale(1.1); }
        }
        @keyframes splash-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(25px, -18px) scale(1.08); }
          66% { transform: translate(-15px, 12px) scale(0.95); }
        }
        @keyframes splash-core-pulse {
          0%, 100% { opacity: 0.04; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes splash-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes splash-particle-appear {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 0.4; transform: scale(1); }
        }
        @keyframes splash-particle-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(2); }
        }
        @keyframes splash-logo-entrance {
          from { opacity: 0; transform: scale(0.4) translateY(24px); }
          60% { transform: scale(1.05) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splash-logo-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.025); }
        }
        @keyframes splash-glow-breathe {
          0%, 100% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes splash-card-shimmer {
          0%, 100% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
        }
        @keyframes splash-title-entrance {
          from { opacity: 0; transform: translateY(16px) scale(0.95); letter-spacing: 0.15em; }
          to { opacity: 1; transform: translateY(0) scale(1); letter-spacing: 0.05em; }
        }
        @keyframes splash-subtitle-entrance {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-text-shimmer {
          to { background-position: 300% center; }
        }
        @keyframes splash-bar-fill {
          to { width: 100%; left: auto; }
        }
        @keyframes splash-bar-shimmer {
          from { background-position: 0% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
