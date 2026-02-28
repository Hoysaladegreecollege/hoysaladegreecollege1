import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [phase, setPhase] = useState<"enter" | "exit" | "idle">("idle");
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPath.current) {
      setDisplayChildren(children);
      return;
    }
    prevPath.current = location.pathname;

    // Exit phase
    setPhase("exit");
    const exitTimer = setTimeout(() => {
      setDisplayChildren(children);
      setPhase("enter");
      const enterTimer = setTimeout(() => setPhase("idle"), 500);
      return () => clearTimeout(enterTimer);
    }, 200);

    return () => clearTimeout(exitTimer);
  }, [location.pathname, children]);

  return (
    <div
      className="will-change-[opacity,transform]"
      style={{
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "translateY(-8px)" : phase === "enter" ? "translateY(0)" : "none",
      }}
    >
      {displayChildren}
    </div>
  );
}
