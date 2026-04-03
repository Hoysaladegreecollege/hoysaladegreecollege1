import { useEffect, useState } from "react";

interface PointNotification {
  id: number;
  text: string;
  x: number;
}

let nextId = 0;

export function useFloatingPoints() {
  const [notifications, setNotifications] = useState<PointNotification[]>([]);

  const showPoints = (text: string) => {
    const id = nextId++;
    const x = 40 + Math.random() * 20; // random horizontal position %
    setNotifications(prev => [...prev, { id, text, x }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 1300);
  };

  return { notifications, showPoints };
}

export default function FloatingPoints({ notifications }: { notifications: { id: number; text: string; x: number }[] }) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {notifications.map(n => (
        <div
          key={n.id}
          className="absolute gamify-float-up font-display text-lg font-black"
          style={{
            left: `${n.x}%`,
            top: "50%",
            background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px hsl(var(--secondary) / 0.4)",
          }}
        >
          {n.text}
        </div>
      ))}
    </div>
  );
}
