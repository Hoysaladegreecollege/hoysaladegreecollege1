import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function DarkModeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark") ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
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

  // Init on mount
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
      {/* Soft full-screen flash overlay for theme transition */}
      {transitioning && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none animate-fade-in"
          style={{
            background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            animation: "theme-flash 0.5s ease-out forwards",
          }}
        />
      )}
      <button
        onClick={toggle}
        className={`relative w-14 h-7 rounded-full p-0.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          dark
            ? "bg-muted border border-border"
            : "bg-secondary/20 border border-secondary/30"
        } ${className}`}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {/* Icons on each side */}
        <Sun className={`w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
          dark ? "text-muted-foreground opacity-50" : "text-secondary opacity-100"
        }`} />
        <Moon className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
          dark ? "text-secondary opacity-100" : "text-muted-foreground opacity-50"
        }`} />

        {/* Sliding knob */}
        <span
          className={`block w-6 h-6 rounded-full shadow-md transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            dark
              ? "translate-x-7 bg-card border border-border shadow-[0_0_8px_hsl(var(--gold)/0.2)]"
              : "translate-x-0 bg-white border border-secondary/20 shadow-[0_0_8px_hsl(var(--secondary)/0.15)]"
          }`}
        />
      </button>
    </>
  );
}
