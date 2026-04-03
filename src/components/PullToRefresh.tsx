import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 80;

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAtTop = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollTop <= 0 && window.scrollY <= 0;
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (refreshing) return;
    if (isAtTop()) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, [refreshing]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0 && isAtTop()) {
      setPullDistance(Math.min(diff * 0.5, 120));
    } else {
      setPullDistance(0);
    }
  }, [pulling, refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);
    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      try {
        await qc.refetchQueries({ type: 'active' });
      } catch {}
      setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
      }, 400);
    } else {
      setPullDistance(0);
    }
  }, [pulling, pullDistance, qc]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative min-h-screen"
    >
      {/* Pull indicator */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[60] flex items-center justify-center pointer-events-none transition-opacity duration-200"
        style={{
          top: `${Math.max(pullDistance - 40, 0)}px`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div className="w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center">
          <RefreshCw
            className={`w-4 h-4 text-primary transition-transform duration-200 ${refreshing ? "animate-spin" : ""}`}
            style={{
              transform: refreshing ? undefined : `rotate(${progress * 360}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content with pull offset */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transitionDuration: pulling ? "0ms" : "300ms",
        }}
      >
        {children}
      </div>
    </div>
  );
}
