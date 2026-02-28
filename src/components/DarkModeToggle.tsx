import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function DarkModeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    if (saved === "light") return false;
    return true;
  });

  const [transitioning, setTransitioning] = useState(false);

  const applyTheme = useCallback((isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  useEffect(() => {
    applyTheme(dark);
  }, [dark, applyTheme]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    setTransitioning(true);
    setTimeout(() => {
      setDark(prev => !prev);
      setTimeout(() => setTransitioning(false), 400);
    }, 50);
  };

  return (
    <>
      {/* Theme transition overlay */}
      {transitioning && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            animation: "theme-flash 0.5s ease-out forwards",
          }}
        />
      )}
      <button
        onClick={toggle}
        className={`relative w-[52px] h-[28px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group ${className}`}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          background: dark
            ? "linear-gradient(135deg, hsl(230,18%,14%), hsl(230,16%,18%))"
            : "linear-gradient(135deg, hsl(42,60%,88%), hsl(42,50%,82%))",
          boxShadow: dark
            ? "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 12px rgba(198,167,94,0.06)"
            : "0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 12px rgba(250,200,80,0.1)",
          border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Ambient glow behind knob */}
        <span
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: dark ? "calc(100% - 26px)" : "2px",
            background: dark
              ? "hsl(var(--gold) / 0.2)"
              : "hsl(42, 90%, 60% / 0.3)",
          }}
        />

        {/* Sun icon — left side */}
        <Sun
          className="absolute left-[6px] top-1/2 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: 12,
            height: 12,
            opacity: dark ? 0.3 : 1,
            color: dark ? "hsl(var(--muted-foreground))" : "hsl(42, 90%, 50%)",
            transform: `translateY(-50%) rotate(${dark ? "-90deg" : "0deg"}) scale(${dark ? 0.8 : 1})`,
          }}
        />

        {/* Moon icon — right side */}
        <Moon
          className="absolute right-[6px] top-1/2 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: 12,
            height: 12,
            opacity: dark ? 1 : 0.3,
            color: dark ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
            transform: `translateY(-50%) rotate(${dark ? "0deg" : "90deg"}) scale(${dark ? 1 : 0.8})`,
          }}
        />

        {/* Sliding knob */}
        <span
          className="absolute top-[3px] block w-[22px] h-[22px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-active:scale-95"
          style={{
            left: dark ? "calc(100% - 25px)" : "3px",
            background: dark
              ? "linear-gradient(145deg, hsl(230,14%,22%), hsl(230,12%,26%))"
              : "linear-gradient(145deg, #fff, #f8f4ec)",
            boxShadow: dark
              ? "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 6px hsl(var(--gold) / 0.12)"
              : "0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 6px rgba(250,200,80,0.15)",
            border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {/* Knob inner dot */}
          <span
            className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: dark
                ? "hsl(var(--gold) / 0.5)"
                : "hsl(42, 80%, 55% / 0.4)",
              boxShadow: dark
                ? "0 0 4px hsl(var(--gold) / 0.3)"
                : "0 0 4px hsl(42, 80%, 55% / 0.2)",
            }}
          />
        </span>
      </button>
    </>
  );
}