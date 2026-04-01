import { useState, useEffect, useRef, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import {
  Sparkles, Shield, Zap, Users, BookOpen, Bell, BarChart3, Calendar, MessageSquare,
  GraduationCap, Upload, Fingerprint, Globe, MonitorSmartphone, Monitor, Star, CheckCircle,
  ArrowRight, Heart, Phone, Mail, ExternalLink, Crown, Layers, Lock, Eye,
  ClipboardCheck, Award, Brain, Camera, TrendingUp, CircuitBoard, Gem, Rocket,
  LayoutDashboard, Clock, DollarSign, Image, Settings, UserCheck, Activity,
  PieChart, FileText, Search, ChevronRight, Megaphone, User
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, animate, useScroll, useTransform, useSpring, useInView } from "framer-motion";

/* ── 3D Tilt Card Wrapper ── */
function Tilt3DCard({ children, className = "", intensity = 15 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  }, [intensity]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: smoothX, rotateY: smoothY, transformPerspective: 800, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Staggered Text Reveal ── */
function StaggeredText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, rotateX: -80 }}
            animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
            transition={{ delay: delay + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Parallax Section Wrapper ── */
function ParallaxSection({ children, className = "", speed = 0.15 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Magnetic Hover Button ── */
function MagneticButton({ children, className = "", ...props }: React.ComponentProps<typeof motion.div>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 200, damping: 15 });
  const smoothY = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Slot Machine ── */
const PRICE_CHARS = ["₹", "4", "9", ",", "9", "9", "9"];
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SPECIAL_CHARS = ["₹", ","];

function SlotDigit({ char, delay, revealed, onLand }: { char: string; delay: number; revealed: boolean; onLand?: () => void }) {
  const isSpecial = SPECIAL_CHARS.includes(char);
  const targetIndex = isSpecial ? 0 : DIGITS.indexOf(char);
  const stripItems = isSpecial ? [char] : DIGITS;
  const itemH = 80;
  const [phase, setPhase] = useState<"idle" | "spinning" | "landing" | "landed">("idle");
  const yRef = useMotionValue(0);

  useEffect(() => {
    if (!revealed) { setPhase("idle"); return; }
    setPhase("spinning");
    const landTimer = setTimeout(() => {
      setPhase("landing");
      animate(yRef, -(targetIndex * itemH), {
        type: "spring", stiffness: 220, damping: 13, mass: 1.1, velocity: -900,
        onComplete: () => { setPhase("landed"); onLand?.(); },
      });
    }, delay);
    return () => clearTimeout(landTimer);
  }, [revealed, delay]);

  useEffect(() => {
    if (phase !== "spinning") return;
    const totalH = stripItems.length * itemH;
    let raf: number;
    let pos = -Math.random() * totalH * 2;
    const speed = 24 + Math.random() * 14;
    const tick = () => { pos -= speed; if (pos < -totalH * 3) pos += totalH; yRef.set(pos); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (!revealed) return <div style={{ width: isSpecial ? 30 : (char === "," ? 16 : 44), height: itemH }} />;

  return (
    <div className="relative overflow-hidden" style={{ height: itemH, width: isSpecial ? 30 : (char === "," ? 16 : 44) }}>
      <AnimatePresence>
        {phase === "landed" && (
          <motion.div className="absolute inset-0 z-20 pointer-events-none rounded-lg"
            initial={{ opacity: 1, scale: 1.4 }} animate={{ opacity: 0, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{ background: "radial-gradient(circle, hsla(42,90%,65%,0.8), hsla(42,87%,55%,0.2) 50%, transparent 70%)" }} />
        )}
      </AnimatePresence>
      <motion.div className="flex flex-col will-change-transform" style={{ y: yRef }}>
        {[...stripItems, ...stripItems, ...stripItems, ...stripItems].map((d, i) => (
          <div key={i} className="flex items-center justify-center shrink-0 font-display font-black select-none"
            style={{
              height: itemH, fontSize: isSpecial ? 28 : (char === "," ? 28 : 46),
              background: "linear-gradient(180deg, hsl(42,90%,68%), hsl(38,92%,52%), hsl(35,85%,42%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: phase === "landed" ? "drop-shadow(0 0 12px hsla(42,87%,55%,0.5))" : "none",
            }}>{d}</div>
        ))}
      </motion.div>
      <div className="absolute top-0 left-0 right-0 h-5 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, #07080c, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-5 pointer-events-none z-10" style={{ background: "linear-gradient(to top, #07080c, transparent)" }} />
    </div>
  );
}

/* ── Floating Particle ── */
function FloatingParticle({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, width: size, height: size, background: "hsla(42,87%,55%,0.15)", filter: "blur(1px)" }}
      initial={{ bottom: "-5%", opacity: 0 }}
      animate={{ bottom: "105%", opacity: [0, 0.6, 0] }}
      transition={{ duration: 12 + Math.random() * 8, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      start = Math.floor(eased * value);
      if (ref.current) ref.current.textContent = start + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ── Mock Tab Content Components ── */
function MockAdminContent() {
  const statCards = [
    { label: "Total Students", value: 1247, icon: GraduationCap, change: "+12%", color: "42, 87%, 55%" },
    { label: "Total Teachers", value: 86, icon: Users, change: "+3%", color: "220, 80%, 55%" },
    { label: "Attendance Rate", value: 94, icon: UserCheck, suffix: "%", change: "+2.1%", color: "160, 60%, 50%" },
    { label: "Fee Collection", value: 98, icon: DollarSign, suffix: "%", change: "+5%", color: "340, 65%, 55%" },
  ];
  return (
    <>
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <p className="font-body text-[15px] font-bold text-white/85">Welcome back, Admin 👋</p>
          <p className="font-body text-[10px] text-white/30 mt-0.5">Here's what's happening at your institution today</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <Calendar className="w-3 h-3 text-white/30" />
          <span className="font-body text-[10px] text-white/35">Mar 2026</span>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} className="relative rounded-xl border border-white/[0.05] p-3 sm:p-4 overflow-hidden"
            style={{ background: `linear-gradient(135deg, hsla(${stat.color}, 0.06), rgba(255,255,255,0.01))` }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/[0.06]" style={{ background: `hsla(${stat.color}, 0.1)` }}>
                <stat.icon className="w-4 h-4" style={{ color: `hsl(${stat.color})` }} />
              </div>
              <span className="font-body text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ color: "hsl(145,65%,55%)", background: "hsla(145,65%,50%,0.1)" }}>{stat.change}</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-white/90"><AnimatedCounter value={stat.value} suffix={stat.suffix || ""} /></p>
            <p className="font-body text-[9px] text-white/30 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "hsla(220,80%,55%,0.1)" }}>
              <BarChart3 className="w-3 h-3" style={{ color: "hsl(220,80%,55%)" }} />
            </div>
            <span className="font-body text-[11px] font-bold text-white/60">Weekly Attendance</span>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {[72, 88, 65, 95, 78, 92, 85].map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t-md" style={{ background: `linear-gradient(180deg, hsla(220,80%,55%,0.6), hsla(220,80%,55%,0.15))` }}
                initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + i * 0.07, duration: 0.6 }} />
            ))}
          </div>
          <div className="flex gap-1.5 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <span key={d} className="flex-1 text-center font-body text-[7px] text-white/20">{d}</span>
            ))}
          </div>
        </motion.div>
        <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "hsla(42,87%,55%,0.1)" }}>
                <DollarSign className="w-3 h-3" style={{ color: "hsl(42,87%,55%)" }} />
              </div>
              <span className="font-body text-[11px] font-bold text-white/60">Fee Collection</span>
            </div>
            <span className="font-body text-[9px] font-bold" style={{ color: "hsl(145,65%,55%)" }}>₹12.4L</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsla(42,87%,55%,0.15)" strokeWidth="3" />
                <motion.circle cx="18" cy="18" r="14" fill="none" stroke="hsl(42,87%,55%)" strokeWidth="3"
                  strokeDasharray="88" strokeLinecap="round" initial={{ strokeDashoffset: 88 }} animate={{ strokeDashoffset: 88 * 0.02 }} transition={{ delay: 0.6, duration: 1.5 }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="font-display text-sm font-bold text-white/80">98%</span></div>
            </div>
            <div className="space-y-2 flex-1">
              {[{ label: "Collected", pct: 98, color: "42, 87%, 55%" }, { label: "Pending", pct: 2, color: "340, 65%, 55%" }].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-[9px] text-white/40">{item.label}</span>
                    <span className="font-body text-[9px] font-bold text-white/50">{item.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: `hsl(${item.color})` }}
                      initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ delay: 0.8 + i * 0.15, duration: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div className="rounded-xl border border-white/[0.05] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
            <span className="font-body text-[11px] font-bold text-white/60">Recent Activity</span>
          </div>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { action: "Attendance marked for BCA Sem-3", time: "2 min ago", icon: Clock, color: "160, 60%, 50%" },
            { action: "Fee payment recorded — ₹24,000", time: "15 min ago", icon: DollarSign, color: "42, 87%, 55%" },
            { action: "New admission application received", time: "1 hr ago", icon: FileText, color: "220, 80%, 55%" },
            { action: "Notice posted: Annual Day Event", time: "3 hrs ago", icon: Bell, color: "340, 65%, 55%" },
          ].map((item, i) => (
            <motion.div key={i} className="flex items-center gap-3 px-4 py-2.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: `hsla(${item.color}, 0.08)` }}>
                <item.icon className="w-3 h-3" style={{ color: `hsla(${item.color}, 0.7)` }} />
              </div>
              <span className="font-body text-[10px] text-white/45 flex-1">{item.action}</span>
              <span className="font-body text-[8px] text-white/20 shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function MockUserManagementContent() {
  const users = [
    { name: "Priya Sharma", role: "Student", course: "BCA", sem: 3, status: "Active", avatar: "PS" },
    { name: "Rajesh Kumar", role: "Student", course: "B.Com", sem: 5, status: "Active", avatar: "RK" },
    { name: "Aisha Patel", role: "Teacher", course: "CS Dept", sem: null, status: "Active", avatar: "AP" },
    { name: "Vikram Singh", role: "Student", course: "BBA", sem: 1, status: "Inactive", avatar: "VS" },
    { name: "Meena Rao", role: "Teacher", course: "Commerce", sem: null, status: "Active", avatar: "MR" },
    { name: "Karthik N", role: "Student", course: "BCA", sem: 5, status: "Active", avatar: "KN" },
  ];
  const roleTabs = ["All", "Students", "Teachers", "Admins"];
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-[15px] font-bold text-white/85">User Management</p>
        <p className="font-body text-[10px] text-white/30 mt-0.5">Manage all users across the institution</p>
      </motion.div>
      <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {roleTabs.map((t, i) => (
          <span key={t} className={`px-3 py-1.5 rounded-lg font-body text-[10px] font-bold border ${i === 0 ? "text-white/80 border-white/10" : "text-white/30 border-white/[0.04]"}`}
            style={i === 0 ? { background: "rgba(255,255,255,0.06)" } : { background: "rgba(255,255,255,0.015)" }}>{t}</span>
        ))}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <Search className="w-3 h-3 text-white/25" />
          <span className="font-body text-[10px] text-white/20">Search users...</span>
        </div>
      </motion.div>
      <motion.div className="rounded-xl border border-white/[0.05] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/[0.06] text-[9px] font-body font-bold text-white/30 uppercase tracking-wider">
          <span>User</span><span className="hidden sm:block">Course</span><span className="hidden sm:block">Semester</span><span>Status</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {users.map((u, i) => (
            <motion.div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-2.5"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-body text-[9px] font-bold"
                  style={{ background: "hsla(220,80%,55%,0.1)", color: "hsl(220,80%,65%)" }}>{u.avatar}</div>
                <div className="min-w-0">
                  <p className="font-body text-[11px] text-white/70 font-medium truncate">{u.name}</p>
                  <p className="font-body text-[8px] text-white/25">{u.role}</p>
                </div>
              </div>
              <span className="font-body text-[10px] text-white/35 hidden sm:block">{u.course}</span>
              <span className="font-body text-[10px] text-white/35 hidden sm:block">{u.sem ? `Sem ${u.sem}` : "—"}</span>
              <span className={`font-body text-[9px] font-bold px-2 py-0.5 rounded-md ${u.status === "Active" ? "text-[hsl(145,65%,55%)]" : "text-[hsl(0,65%,55%)]"}`}
                style={{ background: u.status === "Active" ? "hsla(145,65%,50%,0.1)" : "hsla(0,65%,50%,0.1)" }}>{u.status}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function MockAttendanceContent() {
  const courses = [
    { name: "BCA", total: 180, present: 162, rate: "90%" },
    { name: "B.Com", total: 240, present: 228, rate: "95%" },
    { name: "BBA", total: 120, present: 108, rate: "90%" },
    { name: "BA", total: 90, present: 81, rate: "90%" },
  ];
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-[15px] font-bold text-white/85">Attendance Hub</p>
        <p className="font-body text-[10px] text-white/30 mt-0.5">Monitor attendance across all courses and semesters</p>
      </motion.div>
      <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <span className="px-3 py-1.5 rounded-lg font-body text-[10px] font-bold text-white/80 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>Overview</span>
        <span className="px-3 py-1.5 rounded-lg font-body text-[10px] font-bold text-white/30 border border-white/[0.04]" style={{ background: "rgba(255,255,255,0.015)" }}>Absent Report</span>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {courses.map((c, i) => (
          <motion.div key={c.name} className="rounded-xl border border-white/[0.05] p-3" style={{ background: "rgba(255,255,255,0.015)" }}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}>
            <p className="font-body text-[11px] font-bold text-white/60 mb-2">{c.name}</p>
            <p className="font-display text-xl font-bold" style={{ color: "hsl(160,60%,50%)" }}>{c.rate}</p>
            <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "hsl(160,60%,50%)" }}
                initial={{ width: 0 }} animate={{ width: c.rate }} transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }} />
            </div>
            <p className="font-body text-[8px] text-white/25 mt-1.5">{c.present}/{c.total} students</p>
          </motion.div>
        ))}
      </div>
      <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5" style={{ color: "hsl(340,65%,55%)" }} />
          <span className="font-body text-[11px] font-bold text-white/60">Low Attendance Alerts (&lt;75%)</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { name: "Rahul M", course: "BCA", sem: 3, rate: "68%" },
            { name: "Sneha K", course: "B.Com", sem: 1, rate: "71%" },
            { name: "Ajay P", course: "BBA", sem: 5, rate: "62%" },
          ].map((s, i) => (
            <motion.div key={i} className="flex items-center justify-between py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "hsla(340,65%,55%,0.1)" }}>
                  <Users className="w-3 h-3" style={{ color: "hsl(340,65%,55%)" }} />
                </div>
                <div>
                  <p className="font-body text-[10px] text-white/60">{s.name}</p>
                  <p className="font-body text-[8px] text-white/25">{s.course} — Sem {s.sem}</p>
                </div>
              </div>
              <span className="font-body text-[10px] font-bold" style={{ color: "hsl(340,65%,55%)" }}>{s.rate}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function MockFeeManagementContent() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-[15px] font-bold text-white/85">Fee Management</p>
        <p className="font-body text-[10px] text-white/30 mt-0.5">Track and manage student fee payments across semesters</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Total Collected", value: "₹12.4L", icon: DollarSign, color: "145, 65%, 50%" },
          { label: "Pending Amount", value: "₹85,000", icon: Clock, color: "340, 65%, 55%" },
          { label: "Total Students", value: "1,247", icon: Users, color: "42, 87%, 55%" },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl border border-white/[0.05] p-3 sm:p-4" style={{ background: `linear-gradient(135deg, hsla(${s.color}, 0.06), rgba(255,255,255,0.01))` }}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <s.icon className="w-4 h-4 mb-2" style={{ color: `hsl(${s.color})` }} />
            <p className="font-display text-lg font-bold text-white/85">{s.value}</p>
            <p className="font-body text-[9px] text-white/30 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <motion.div className="rounded-xl border border-white/[0.05] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <span className="font-body text-[11px] font-bold text-white/60">Recent Payments</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { name: "Priya S", amount: "₹24,000", date: "Today", sem: 3, method: "UPI" },
            { name: "Rajesh K", amount: "₹22,500", date: "Yesterday", sem: 5, method: "Cash" },
            { name: "Arun M", amount: "₹24,000", date: "2 days ago", sem: 1, method: "Bank" },
            { name: "Deepa R", amount: "₹23,000", date: "3 days ago", sem: 3, method: "UPI" },
          ].map((p, i) => (
            <motion.div key={i} className="flex items-center gap-3 px-4 py-2.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsla(145,65%,50%,0.1)" }}>
                <DollarSign className="w-3 h-3" style={{ color: "hsl(145,65%,55%)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[10px] text-white/60 font-medium">{p.name} — Sem {p.sem}</p>
                <p className="font-body text-[8px] text-white/25">{p.method} • {p.date}</p>
              </div>
              <span className="font-body text-[11px] font-bold" style={{ color: "hsl(145,65%,55%)" }}>{p.amount}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function MockTeacherDashboardContent() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-[15px] font-bold text-white/85">Welcome, Prof. Aisha 👩‍🏫</p>
        <p className="font-body text-[10px] text-white/30 mt-0.5">Computer Science Department • BCA</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "My Students", value: "64", icon: Users, color: "220, 80%, 55%" },
          { label: "Avg Attendance", value: "91%", icon: UserCheck, color: "160, 60%, 50%" },
          { label: "Avg Marks", value: "72%", icon: BarChart3, color: "42, 87%, 55%" },
          { label: "Materials", value: "23", icon: Upload, color: "270, 60%, 55%" },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl border border-white/[0.05] p-3" style={{ background: `linear-gradient(135deg, hsla(${s.color}, 0.06), rgba(255,255,255,0.01))` }}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <s.icon className="w-4 h-4 mb-1.5" style={{ color: `hsl(${s.color})` }} />
            <p className="font-display text-xl font-bold text-white/85">{s.value}</p>
            <p className="font-body text-[9px] text-white/30">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
          initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-3.5 h-3.5" style={{ color: "hsl(42,87%,55%)" }} />
            <span className="font-body text-[11px] font-bold text-white/60">Top Performers</span>
          </div>
          {[{ name: "Priya S", marks: "95%", rank: 1 }, { name: "Karthik N", marks: "92%", rank: 2 }, { name: "Meena R", marks: "89%", rank: 3 }].map((s, i) => (
            <motion.div key={i} className="flex items-center gap-2.5 py-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.08 }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-body text-[9px] font-bold"
                style={{ background: i === 0 ? "hsla(42,87%,55%,0.15)" : "rgba(255,255,255,0.04)", color: i === 0 ? "hsl(42,87%,60%)" : "white/40" }}>#{s.rank}</span>
              <span className="font-body text-[10px] text-white/55 flex-1">{s.name}</span>
              <span className="font-body text-[10px] font-bold" style={{ color: "hsl(145,65%,55%)" }}>{s.marks}</span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
          initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5" style={{ color: "hsl(220,80%,55%)" }} />
            <span className="font-body text-[11px] font-bold text-white/60">Today's Schedule</span>
          </div>
          {[{ time: "9:00 AM", subject: "Data Structures", room: "Lab 2" }, { time: "11:00 AM", subject: "DBMS", room: "Room 104" }, { time: "2:00 PM", subject: "Python Lab", room: "Lab 1" }].map((s, i) => (
            <motion.div key={i} className="flex items-center gap-2.5 py-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.08 }}>
              <span className="font-body text-[9px] text-white/25 w-14 shrink-0">{s.time}</span>
              <span className="font-body text-[10px] text-white/55 flex-1">{s.subject}</span>
              <span className="font-body text-[8px] text-white/20 px-1.5 py-0.5 rounded border border-white/[0.04]">{s.room}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

function MockStudentDashboardContent() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-[15px] font-bold text-white/85">Welcome, Priya 🎓</p>
        <p className="font-body text-[10px] text-white/30 mt-0.5">BCA • Semester 3 • Roll No: BCA2024003</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "Attendance", value: "91%", icon: UserCheck, color: "160, 60%, 50%" },
          { label: "Avg Marks", value: "82%", icon: BarChart3, color: "220, 80%, 55%" },
          { label: "Fee Status", value: "Paid", icon: DollarSign, color: "145, 65%, 50%" },
          { label: "Notices", value: "5", icon: Bell, color: "42, 87%, 55%" },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl border border-white/[0.05] p-3" style={{ background: `linear-gradient(135deg, hsla(${s.color}, 0.06), rgba(255,255,255,0.01))` }}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <s.icon className="w-4 h-4 mb-1.5" style={{ color: `hsl(${s.color})` }} />
            <p className="font-display text-xl font-bold text-white/85">{s.value}</p>
            <p className="font-body text-[9px] text-white/30">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
          initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5" style={{ color: "hsl(42,87%,55%)" }} />
            <span className="font-body text-[11px] font-bold text-white/60">Today's Timetable</span>
          </div>
          {[
            { time: "9:00 AM", subject: "Data Structures", teacher: "Prof. Aisha" },
            { time: "11:00 AM", subject: "DBMS", teacher: "Prof. Vikram" },
            { time: "1:00 PM", subject: "Web Tech", teacher: "Prof. Meena" },
            { time: "3:00 PM", subject: "Python Lab", teacher: "Prof. Aisha" },
          ].map((s, i) => (
            <motion.div key={i} className="flex items-center gap-2.5 py-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}>
              <span className="font-body text-[9px] text-white/25 w-14 shrink-0">{s.time}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[10px] text-white/55">{s.subject}</p>
                <p className="font-body text-[8px] text-white/20">{s.teacher}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
          initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-3.5 h-3.5" style={{ color: "hsl(220,80%,55%)" }} />
            <span className="font-body text-[11px] font-bold text-white/60">Recent Marks</span>
          </div>
          {[
            { subject: "Data Structures", marks: "42/50", type: "Internal" },
            { subject: "DBMS", marks: "38/50", type: "Internal" },
            { subject: "Web Tech", marks: "45/50", type: "Internal" },
          ].map((s, i) => (
            <motion.div key={i} className="flex items-center justify-between py-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.08 }}>
              <div>
                <p className="font-body text-[10px] text-white/55">{s.subject}</p>
                <p className="font-body text-[8px] text-white/20">{s.type}</p>
              </div>
              <span className="font-body text-[11px] font-bold" style={{ color: "hsl(145,65%,55%)" }}>{s.marks}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div className="rounded-xl border border-white/[0.05] p-4" style={{ background: "rgba(255,255,255,0.015)" }}
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="w-3.5 h-3.5" style={{ color: "hsl(340,65%,55%)" }} />
          <span className="font-body text-[11px] font-bold text-white/60">Latest Announcements</span>
        </div>
        {[
          { title: "Annual Day Celebration — March 28", time: "2 hrs ago" },
          { title: "Submit assignments by Friday", time: "1 day ago" },
        ].map((a, i) => (
          <motion.div key={i} className="flex items-center justify-between py-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}>
            <span className="font-body text-[10px] text-white/50">{a.title}</span>
            <span className="font-body text-[8px] text-white/20">{a.time}</span>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

/* ── Mock Dashboard Preview ── */
function MockDashboardPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "Admin Dashboard", icon: LayoutDashboard, color: "42, 87%, 55%" },
    { label: "User Management", icon: Users, color: "220, 80%, 55%" },
    { label: "Attendance Hub", icon: UserCheck, color: "160, 60%, 50%" },
    { label: "Fee Management", icon: DollarSign, color: "340, 65%, 55%" },
    { label: "Teacher Dashboard", icon: BookOpen, color: "270, 60%, 55%" },
    { label: "Student Dashboard", icon: GraduationCap, color: "190, 70%, 50%" },
  ];

  const sidebarConfigs: Record<number, { items: { icon: React.ElementType; label: string; active?: boolean }[]; portalLabel: string }> = {
    0: { portalLabel: "Admin Portal", items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true }, { icon: Bell, label: "Post Notice" }, { icon: BookOpen, label: "Courses" },
      { icon: UserCheck, label: "Attendance Hub" }, { icon: FileText, label: "Applications" }, { icon: Users, label: "Users" },
      { icon: DollarSign, label: "Fee Management" }, { icon: Award, label: "Top Rankers" }, { icon: Calendar, label: "Timetable" },
      { icon: Image, label: "Events" }, { icon: Camera, label: "Gallery" }, { icon: Settings, label: "Settings" },
    ]},
    1: { portalLabel: "Admin Portal", items: [
      { icon: LayoutDashboard, label: "Dashboard" }, { icon: Users, label: "Users", active: true }, { icon: UserCheck, label: "Attendance Hub" },
      { icon: DollarSign, label: "Fee Management" }, { icon: BookOpen, label: "Courses" }, { icon: Settings, label: "Settings" },
    ]},
    2: { portalLabel: "Admin Portal", items: [
      { icon: LayoutDashboard, label: "Dashboard" }, { icon: Users, label: "Users" }, { icon: UserCheck, label: "Attendance Hub", active: true },
      { icon: DollarSign, label: "Fee Management" }, { icon: BookOpen, label: "Courses" }, { icon: Settings, label: "Settings" },
    ]},
    3: { portalLabel: "Admin Portal", items: [
      { icon: LayoutDashboard, label: "Dashboard" }, { icon: Users, label: "Users" }, { icon: UserCheck, label: "Attendance Hub" },
      { icon: DollarSign, label: "Fee Management", active: true }, { icon: BookOpen, label: "Courses" }, { icon: Settings, label: "Settings" },
    ]},
    4: { portalLabel: "Teacher Portal", items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true }, { icon: Users, label: "Students" }, { icon: Clock, label: "Attendance" },
      { icon: UserCheck, label: "Att. Overview" }, { icon: BarChart3, label: "Marks" }, { icon: Calendar, label: "Timetable" },
      { icon: Upload, label: "Materials" }, { icon: Bell, label: "Notices" }, { icon: MessageSquare, label: "Messages" },
    ]},
    5: { portalLabel: "Student Portal", items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true }, { icon: User, label: "My Profile" }, { icon: Clock, label: "Attendance" },
      { icon: BarChart3, label: "Marks" }, { icon: DollarSign, label: "Fee Details" }, { icon: Calendar, label: "Timetable" },
      { icon: Bell, label: "Notices" }, { icon: BookOpen, label: "Materials" }, { icon: MessageSquare, label: "Messages" },
    ]},
  };

  const headerTitles = ["Admin Dashboard", "User Management", "Attendance Hub", "Fee Management", "Teacher Dashboard", "Student Dashboard"];
  const urlPaths = ["/dashboard/admin", "/dashboard/admin/users", "/dashboard/admin/attendance", "/dashboard/admin/fees", "/dashboard/teacher", "/dashboard/student"];

  const currentSidebar = sidebarConfigs[activeTab] || sidebarConfigs[0];

  return (
    <div className="max-w-6xl mx-auto">
      <ScrollReveal delay={60}>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab, i) => (
            <motion.button key={tab.label} onClick={() => setActiveTab(i)}
              className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-body text-[10px] sm:text-xs font-bold transition-all duration-300 border flex items-center gap-1.5 sm:gap-2 ${
                activeTab === i ? "text-white border-white/15" : "text-white/35 border-white/[0.05] hover:text-white/60 hover:border-white/10"
              }`}
              style={activeTab === i ? { background: `hsla(${tab.color}, 0.1)` } : { background: "rgba(255,255,255,0.015)" }}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              {activeTab === i && (
                <motion.div className="absolute inset-0 rounded-xl pointer-events-none" layoutId="mock-tab-glow"
                  style={{ boxShadow: `0 0 20px hsla(${tab.color}, 0.15), inset 0 0 20px hsla(${tab.color}, 0.05)` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
              <tab.icon className="w-3.5 h-3.5 relative z-10" style={activeTab === i ? { color: `hsl(${tab.color})` } : {}} />
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              <span className="relative z-10 sm:hidden">{tab.label.split(' ').pop()}</span>
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <motion.div className="relative rounded-2xl sm:rounded-3xl border overflow-hidden"
          style={{ borderColor: "hsla(42,87%,55%,0.12)", background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", boxShadow: "0 60px 140px -40px rgba(0,0,0,0.8), 0 0 80px hsla(42,87%,55%,0.05)" }}
          layout>
          {/* Browser top bar */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsla(0,65%,55%,0.7)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsla(42,87%,55%,0.7)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsla(145,65%,50%,0.7)" }} />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-white/[0.06] max-w-md w-full" style={{ background: "rgba(0,0,0,0.3)" }}>
                <Lock className="w-2.5 h-2.5 text-white/20" />
                <span className="font-body text-[10px] text-white/30 truncate">hoysaladegreecollege.in{urlPaths[activeTab]}</span>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex" style={{ height: "clamp(400px, 58vw, 600px)" }}>
            {/* Sidebar */}
            <div className="hidden sm:flex flex-col border-r border-white/[0.04] shrink-0" style={{ width: 200, background: "rgba(14,16,22,0.98)" }}>
              <div className="px-4 pt-4 pb-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsla(42,87%,55%,0.15)" }}>
                    <GraduationCap className="w-4 h-4" style={{ color: "hsl(42,87%,55%)" }} />
                  </div>
                  <div>
                    <p className="font-body text-[11px] font-bold text-white/80">Hoysala College</p>
                    <p className="font-body text-[8px] text-white/25">{currentSidebar.portalLabel}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden px-2 pt-2 space-y-0.5">
                {currentSidebar.items.map((item, i) => (
                  <motion.div key={`${activeTab}-${item.label}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-body ${item.active ? "text-white/90 font-medium" : "text-white/30"}`}
                    style={item.active ? { background: "rgba(255,255,255,0.06)" } : {}}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                    {item.active && <div className="absolute left-0 w-[2px] h-3 rounded-full" style={{ background: "hsl(42,87%,55%)" }} />}
                    <item.icon className="w-3.5 h-3.5 shrink-0" style={item.active ? { color: "hsl(42,87%,55%)" } : {}} />
                    <span className="truncate">{item.label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="px-3 py-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <User className="w-3 h-3 text-white/40" />
                  </div>
                  <div>
                    <p className="font-body text-[10px] text-white/50 font-medium">{activeTab >= 4 ? (activeTab === 4 ? "Prof. Aisha" : "Priya S") : "Admin User"}</p>
                    <p className="font-body text-[8px] text-white/20">{activeTab >= 4 ? (activeTab === 4 ? "teacher@college.in" : "student@college.in") : "admin@college.in"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "rgba(10,12,20,0.95)" }}>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.04]" style={{ background: "rgba(255,255,255,0.01)" }}>
                <div>
                  <p className="font-body text-[13px] font-bold text-white/80">{headerTitles[activeTab]}</p>
                  <p className="font-body text-[9px] text-white/25">Hoysala Degree College</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <Search className="w-3.5 h-3.5 text-white/30" />
                  </div>
                  <div className="relative w-7 h-7 rounded-lg flex items-center justify-center border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <Bell className="w-3.5 h-3.5 text-white/30" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "hsl(0,65%,55%)" }} />
                  </div>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {activeTab === 0 && <MockAdminContent />}
                  {activeTab === 1 && <MockUserManagementContent />}
                  {activeTab === 2 && <MockAttendanceContent />}
                  {activeTab === 3 && <MockFeeManagementContent />}
                  {activeTab === 4 && <MockTeacherDashboardContent />}
                  {activeTab === 5 && <MockStudentDashboardContent />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-t border-white/[0.04]" style={{ background: "rgba(255,255,255,0.015)" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(145, 65%, 50%)" }} />
              <span className="font-body text-[10px] text-white/25">Sample Preview • {headerTitles[activeTab]}</span>
            </div>
            <span className="font-body text-[10px] text-white/15">Static preview — no login required</span>
          </div>
        </motion.div>
      </ScrollReveal>

      <motion.p className="text-center mt-6 font-body text-[11px] text-white/20"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
        ✨ This is a sample preview — the actual product includes all interactive features
      </motion.p>
    </div>
  );
}

/* ── Marquee Line ── */
function InfiniteMarquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(90deg, #07080c, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(-90deg, #07080c, transparent)" }} />
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.04] font-body text-[11px] text-white/30"
            style={{ background: "rgba(255,255,255,0.015)" }}>
            <CheckCircle className="w-3 h-3" style={{ color: "hsla(42,87%,55%,0.4)" }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const allFeatures = [
  { icon: Users, title: "Multi-Role Dashboards", desc: "Separate dashboards for Students, Teachers, Principals & Admins with role-based access", color: "220, 80%, 55%" },
  { icon: ClipboardCheck, title: "Attendance Management", desc: "Mark, track, and analyze attendance with visual reports and absent notifications", color: "160, 60%, 50%" },
  { icon: BarChart3, title: "Marks & Results", desc: "Upload, manage and view internal & external exam marks with analytics", color: "270, 60%, 55%" },
  { icon: Calendar, title: "Smart Timetable", desc: "Dynamic timetable management by course, semester and day of week", color: "42, 87%, 55%" },
  { icon: Bell, title: "Notices & Announcements", desc: "Post and manage notices with pinning, categories and real-time updates", color: "340, 65%, 55%" },
  { icon: MessageSquare, title: "Direct Messaging", desc: "Secure messaging between teachers and students with file attachments", color: "190, 70%, 50%" },
  { icon: Upload, title: "Study Materials", desc: "Upload and organize study materials by course, subject, and semester", color: "145, 65%, 42%" },
  { icon: GraduationCap, title: "Admissions Portal", desc: "Complete online admission with application tracking, photo upload, and PDF download", color: "280, 60%, 55%" },
  { icon: Shield, title: "Fee Management", desc: "Semester-wise fee tracking, payment recording, receipt generation with PIN security", color: "42, 87%, 55%" },
  { icon: Award, title: "Top Rankers Showcase", desc: "Highlight and display college top performers with photos and rankings", color: "155, 65%, 45%" },
  { icon: Camera, title: "Gallery Management", desc: "Upload, categorize and display campus photos with admin controls", color: "340, 65%, 55%" },
  { icon: Brain, title: "AI-Powered Chatbot", desc: "Intelligent assistant that answers student queries about the college", color: "270, 60%, 55%" },
  { icon: Fingerprint, title: "Biometric/Passkey Login", desc: "WebAuthn passkey authentication for fingerprint, face, and screen lock", color: "190, 70%, 50%" },
  { icon: Lock, title: "Role-Based Security", desc: "Row-level security with encrypted data, admin approval system & OTP verification", color: "220, 80%, 55%" },
  { icon: TrendingUp, title: "Placement Portal", desc: "Showcase placement statistics, company partners, and career support", color: "145, 65%, 42%" },
  { icon: Layers, title: "Semester Promotion", desc: "Bulk student promotion across semesters with academic year management", color: "42, 87%, 55%" },
  { icon: Eye, title: "Activity Logs", desc: "Complete audit trail of all admin actions for accountability", color: "280, 60%, 55%" },
  { icon: Globe, title: "PWA Support", desc: "Install as a native app on any device — works offline with push notifications", color: "160, 60%, 50%" },
];

const dashboardPreviews = [
  { role: "Admin Dashboard", emoji: "⚙️", features: ["User Management", "Fee Management", "Attendance Hub", "Gallery & Events", "Semester Promotion", "Activity Logs", "Reports"], color: "42, 87%, 55%" },
  { role: "Teacher Dashboard", emoji: "📚", features: ["Mark Attendance", "Upload Marks", "Study Materials", "Student List", "Messaging", "Timetable", "Notices"], color: "220, 80%, 55%" },
  { role: "Student Dashboard", emoji: "🎓", features: ["View Attendance", "Check Marks", "Timetable", "Fee Status", "Materials", "Announcements", "Messages"], color: "160, 60%, 50%" },
];

const techStack = [
  "React 18", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "PostgreSQL",
  "Row-Level Security", "Edge Functions", "WebAuthn", "PWA", "Vite", "Shadcn UI",
];

const trustBadges = [
  { icon: Zap, label: "Lightning Fast", sub: "Sub-second loads" },
  { icon: Shield, label: "Bank-Grade Security", sub: "RLS + WebAuthn" },
  { icon: MonitorSmartphone, label: "Fully Responsive", sub: "All devices" },
  { icon: Rocket, label: "Production Ready", sub: "Deploy today" },
];

const marqueeItems1 = [
  "Student Management", "Teacher Portal", "Attendance Tracking", "Fee Collection",
  "Exam Results", "Timetable System", "Notice Board", "Gallery Management",
  "Admission Portal", "Push Notifications", "Dark Mode", "PWA Support",
];
const marqueeItems2 = [
  "Role-Based Access", "Activity Logs", "Passkey Login", "Direct Messaging",
  "Study Materials", "Top Rankers", "Alumni Portal", "PDF Reports",
  "WhatsApp Integration", "Birthday Wishes", "Semester Promotion", "AI Chatbot",
];

export default function PurchaseWebsite() {
  const [revealPhase, setRevealPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [landedCount, setLandedCount] = useState(0);
  const allLanded = landedCount >= PRICE_CHARS.length;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    if (revealPhase === "spinning" && allLanded) {
      const t = setTimeout(() => setRevealPhase("done"), 300);
      return () => clearTimeout(t);
    }
  }, [allLanded, revealPhase]);

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(180deg, #050608 0%, #07080c 30%, #0a0c14 60%, #050608 100%)" }}>
      <SEOHead title="Get This Website — College Management System | ₹49,999" description="Purchase this premium college management website with multi-role dashboards, attendance, fees, admissions and more. Built by Pavan A." canonical="/purchase" />

      {/* Floating ambient particles */}
      {[...Array(16)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 1.4} x={`${5 + (i * 6) % 90}%`} size={2 + (i % 4)} />
      ))}

      {/* ─── HERO ─── */}
      <motion.section ref={heroRef} className="relative overflow-hidden pt-24 pb-28 sm:pt-36 sm:pb-40" style={{ opacity: heroOpacity, scale: heroScale }}>
        {/* Multi-layer ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[200px]" style={{ background: "radial-gradient(circle, hsla(42,80%,55%,0.07), transparent 70%)" }} />
          <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, hsla(270,60%,55%,0.04), transparent 70%)" }} />
          <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full blur-[130px]" style={{ background: "radial-gradient(circle, hsla(220,80%,55%,0.03), transparent 70%)" }} />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(hsla(42,87%,55%,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Top cinematic line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 5%, hsla(42,87%,55%,0.15) 30%, hsla(42,87%,55%,0.3) 50%, hsla(42,87%,55%,0.15) 70%, transparent 95%)" }} />

        <div className="relative container px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            
            {/* Premium badge with glow */}
            <motion.div 
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border mb-10 backdrop-blur-sm"
              style={{ borderColor: "hsla(42,87%,55%,0.2)", background: "linear-gradient(135deg, rgba(198,167,94,0.08), rgba(198,167,94,0.02))" }}
              animate={{ boxShadow: ["0 0 20px hsla(42,87%,55%,0.05)", "0 0 40px hsla(42,87%,55%,0.12)", "0 0 20px hsla(42,87%,55%,0.05)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="w-4 h-4" style={{ color: "hsl(42, 87%, 55%)" }} />
              <span className="font-body text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "hsl(42, 87%, 55%)" }}>Premium College Management System</span>
              <Gem className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
            </motion.div>

            {/* Main headline */}
            <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-[5rem] font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-5xl mx-auto" style={{ perspective: "600px" }}>
              <StaggeredText text="The Complete" delay={0.2} />
              {" "}
              <span className="relative inline-block">
                <motion.span 
                  style={{ background: "linear-gradient(135deg, hsl(42,90%,68%), hsl(38,92%,55%), hsl(42,80%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}
                  initial={{ opacity: 0, scale: 0.8, rotateX: -40 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  College Platform
                </motion.span>
                <motion.span 
                  className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(42,87%,55%), transparent)" }}
                  animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              <br className="hidden sm:block" />
              <StaggeredText text="Your Institution Deserves" delay={0.5} />
            </h1>

            <p className="font-body text-white/35 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mt-7 leading-relaxed">
              Multi-role dashboards, attendance, marks, fees, admissions, messaging, gallery, AI chatbot — <span className="text-white/55 font-medium">everything built and ready to deploy.</span>
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-10">
              {trustBadges.map((b, i) => (
                <motion.div 
                  key={b.label}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -3, borderColor: "hsla(42,87%,55%,0.15)" }}
                >
                  <b.icon className="w-4 h-4" style={{ color: "hsla(42,87%,55%,0.7)" }} />
                  <div className="text-left">
                    <p className="font-body text-[10px] font-bold text-white/60">{b.label}</p>
                    <p className="font-body text-[9px] text-white/25">{b.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Price Reveal ── */}
            <div className="mt-14 inline-flex flex-col items-center gap-3" style={{ minHeight: 150 }}>
              <AnimatePresence mode="wait">
                {revealPhase === "idle" && (
                  <motion.button key="reveal-btn"
                    onClick={() => { setLandedCount(0); setRevealPhase("spinning"); }}
                    className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-body text-base font-bold border overflow-hidden"
                    style={{ borderColor: "hsla(42,87%,55%,0.25)", background: "linear-gradient(135deg, rgba(198,167,94,0.08), rgba(198,167,94,0.02))" }}
                    whileHover={{ scale: 1.06, y: -6, boxShadow: "0 20px 60px hsla(42,87%,55%,0.15)" }}
                    whileTap={{ scale: 0.97 }}
                    exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)", y: 30 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <motion.span 
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(105deg, transparent 40%, hsla(42,87%,55%,0.15) 50%, transparent 60%)" }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.span>
                    <Eye className="w-5 h-5 relative z-10" style={{ color: "hsl(42, 87%, 55%)" }} />
                    <span className="relative z-10" style={{ color: "hsl(42, 87%, 55%)" }}>Reveal Price</span>
                    <Sparkles className="w-4 h-4 relative z-10 opacity-60" style={{ color: "hsl(42, 87%, 55%)" }} />
                  </motion.button>
                )}

                {(revealPhase === "spinning" || revealPhase === "done") && (
                  <motion.div key="price-slots" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <motion.div className="absolute -inset-10 rounded-3xl pointer-events-none"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ background: "radial-gradient(ellipse, hsla(42,87%,55%,0.08), transparent 70%)", filter: "blur(30px)" }} />

                      <div className="relative flex items-center justify-center px-5 py-3 rounded-2xl border"
                        style={{ borderColor: "hsla(42,87%,55%,0.15)", background: "linear-gradient(135deg, rgba(198,167,94,0.04), rgba(7,8,12,0.95))", boxShadow: "0 0 60px -20px hsla(42,87%,55%,0.15), inset 0 1px 0 hsla(42,87%,55%,0.1)" }}>
                        
                        {revealPhase === "spinning" && (
                          <motion.div className="absolute inset-y-0 w-1/3 pointer-events-none z-20"
                            animate={{ left: ["-40%", "140%"], opacity: [0.15, 0.45, 0.15] }}
                            transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                            style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,70%,0.3), transparent)" }} />
                        )}

                        {PRICE_CHARS.map((char, i) => (
                          <SlotDigit key={i} char={char} delay={400 + i * 420} revealed onLand={() => setLandedCount(c => c + 1)} />
                        ))}
                      </div>

                      {revealPhase === "done" && (
                        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden z-30"
                          initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1, duration: 0.4 }}>
                          <motion.div className="absolute inset-y-0 w-1/3"
                            initial={{ left: "-33%" }} animate={{ left: "133%" }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                            style={{ background: "linear-gradient(90deg, transparent, hsla(42,90%,75%,0.5), hsla(42,87%,55%,0.2), transparent)" }} />
                        </motion.div>
                      )}
                    </div>

                    <motion.p className="font-body text-[9px] tracking-[0.3em] uppercase"
                      style={{ color: "hsla(42,87%,55%,0.35)" }}
                      animate={revealPhase === "done" ? { opacity: 0 } : { opacity: [0.2, 0.6, 0.2] }}
                      transition={revealPhase === "done" ? { duration: 0.2 } : { duration: 1, repeat: Infinity }}>
                      Unlocking premium offer...
                    </motion.p>

                    <motion.div className="relative overflow-hidden rounded-full px-7 py-1.5 mt-1 border border-white/[0.05]"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                      initial={{ opacity: 0, y: 12 }} animate={revealPhase === "done" ? { opacity: 1, y: 0 } : { opacity: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}>
                      <span className="font-body text-white/35 text-xs relative z-10">one-time payment • lifetime ownership</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <motion.a href="https://api.whatsapp.com/send/?phone=9036048950&text=Hi+Pavan%2C+I%27m+interested+in+purchasing+the+college+website.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-12 sm:px-16 py-5 rounded-2xl font-body text-base font-bold transition-all duration-500 overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(42,87%,62%), hsl(38,92%,50%), hsl(35,85%,42%))", color: "hsl(30,10%,8%)", boxShadow: "0 20px 60px hsla(42,87%,52%,0.3), inset 0 1px 0 hsla(50,100%,90%,0.4), 0 0 0 1px hsla(42,87%,55%,0.2)" }}
                whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.98 }}>
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </span>
                <MessageSquare className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Buy on WhatsApp</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>

              <motion.a href="https://pavan-05.framer.ai/" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-body text-sm font-bold border text-white/60 hover:text-white transition-all duration-300"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                whileHover={{ scale: 1.03, y: -3, borderColor: "rgba(255,255,255,0.15)" }}>
                <Globe className="w-5 h-5" />
                <span>Developer Portfolio</span>
                <ExternalLink className="w-4 h-4 opacity-40" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── MARQUEE STRIP ─── */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />
        <InfiniteMarquee items={marqueeItems1} />
        <InfiniteMarquee items={marqueeItems2} reverse />
      </section>

      {/* ─── FEATURE GRID ─── */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "linear-gradient(hsla(42,87%,55%,0.4) 1px, transparent 1px), linear-gradient(90deg, hsla(42,87%,55%,0.4) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <CircuitBoard className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Feature Arsenal</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ perspective: "500px" }}>
                <span style={{ color: "hsl(42, 87%, 55%)" }}>18+</span>{" "}
                <StaggeredText text="Powerful Features" />
              </h2>
              <p className="font-body text-white/30 text-sm mt-4 max-w-lg mx-auto leading-relaxed">Everything you need to run a modern educational institution — built, tested, and production-ready.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {allFeatures.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 40}>
                <Tilt3DCard intensity={12}>
                  <motion.div 
                    className="group relative p-6 rounded-2xl border border-white/[0.05] overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.015)" }}
                    whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.1)", boxShadow: `0 20px 60px -15px hsla(${f.color}, 0.15)` }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, hsla(${f.color}, 0.07), transparent 60%)` }} />
                    <div className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: `linear-gradient(90deg, hsla(${f.color}, 0.6), transparent)` }} />
                    
                    {/* 3D floating icon */}
                    <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
                      <motion.div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border border-white/[0.06]"
                        style={{ background: `hsla(${f.color}, 0.08)`, transform: "translateZ(30px)" }}
                        whileHover={{ scale: 1.15, rotate: 6 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <f.icon className="w-5 h-5" style={{ color: `hsla(${f.color}, 0.85)` }} />
                      </motion.div>
                      <h3 className="font-display text-sm font-bold text-white/90 mb-1.5" style={{ transform: "translateZ(20px)" }}>{f.title}</h3>
                      <p className="font-body text-xs text-white/30 leading-relaxed" style={{ transform: "translateZ(10px)" }}>{f.desc}</p>
                    </div>
                  </motion.div>
                </Tilt3DCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEWS (Role cards) ─── */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[180px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(42,80%,55%,0.04), transparent 70%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <Layers className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Role-Based</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ perspective: "500px" }}>
                <StaggeredText text="Dashboard Previews" />
              </h2>
              <p className="font-body text-white/30 text-sm mt-4">Three powerful dashboards tailored for every role in the institution</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {dashboardPreviews.map((d, i) => (
              <ScrollReveal key={d.role} delay={i * 120}>
                <ParallaxSection speed={0.08 + i * 0.04}>
                  <Tilt3DCard intensity={10}>
                    <motion.div 
                      className="group relative rounded-2xl border border-white/[0.05] overflow-hidden"
                      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))", boxShadow: "0 25px 70px -25px rgba(0,0,0,0.5)" }}
                      whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.12)", boxShadow: `0 30px 80px -20px hsla(${d.color}, 0.15)` }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, hsla(${d.color}, 0.5), transparent)` }} />
                      <div className="p-7 sm:p-8" style={{ transformStyle: "preserve-3d" }}>
                        <motion.div 
                          className="text-5xl mb-4 inline-block"
                          style={{ transform: "translateZ(40px)" }}
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >{d.emoji}</motion.div>
                        <h3 className="font-display text-lg font-bold text-white mb-5" style={{ transform: "translateZ(25px)" }}>{d.role}</h3>
                        <div className="space-y-3" style={{ transform: "translateZ(15px)" }}>
                          {d.features.map((f, fi) => (
                            <motion.div key={f} className="flex items-center gap-2.5"
                              initial={{ opacity: 0, x: -15 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 + fi * 0.05, duration: 0.4 }}
                            >
                              <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: `hsla(${d.color}, 0.7)` }} />
                              <span className="font-body text-xs text-white/45">{f}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </Tilt3DCard>
                </ParallaxSection>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MOCK DASHBOARD PREVIEW ─── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[200px]" style={{ background: "radial-gradient(circle, hsla(220,80%,55%,0.04), transparent 70%)" }} />
        </div>

        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <Monitor className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Dashboard Preview</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                See the <span style={{ color: "hsl(42, 87%, 55%)" }}>Dashboard</span> in Action
              </h2>
              <p className="font-body text-white/30 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
                A fully functional admin dashboard with real-time analytics, user management, and comprehensive institutional controls.
              </p>
            </div>
          </ScrollReveal>

          <MockDashboardPreview />
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />
        <div className="container px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <Zap className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Tech Stack</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Built With Modern Tech</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {techStack.map((t, i) => (
                <motion.span key={t}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.05] font-body text-xs font-medium text-white/45 hover:text-white/80 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  whileHover={{ scale: 1.08, y: -2, borderColor: "hsla(42,87%,55%,0.2)" }}>
                  {t}
                </motion.span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── PRICING CARD ─── */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px]" style={{ background: "radial-gradient(circle, hsla(42,80%,55%,0.07), transparent 70%)" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <motion.div 
                className="relative rounded-3xl border overflow-hidden"
                style={{ borderColor: "hsla(42,87%,55%,0.18)", background: "linear-gradient(160deg, rgba(198,167,94,0.05), rgba(12,14,20,0.98) 40%)", boxShadow: "0 50px 120px -30px rgba(0,0,0,0.6), 0 0 80px rgba(198,167,94,0.05)" }}
                whileHover={{ boxShadow: "0 50px 120px -30px rgba(0,0,0,0.6), 0 0 100px rgba(198,167,94,0.08)" }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(42 87% 55% / 0.7), transparent)" }} />
                
                <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none" style={{ background: "linear-gradient(135deg, hsla(42,87%,55%,0.06), transparent 50%)" }} />
                <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{ background: "linear-gradient(225deg, hsla(42,87%,55%,0.06), transparent 50%)" }} />

                <div className="p-8 sm:p-12 text-center relative">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Crown className="w-14 h-14 mx-auto mb-5" style={{ color: "hsl(42, 87%, 55%)", filter: "drop-shadow(0 0 20px hsla(42,87%,55%,0.3))" }} />
                  </motion.div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Complete Website Package</h3>
                  <p className="font-body text-white/30 text-sm mb-8">Everything included — no hidden costs</p>

                  <div className="flex items-baseline justify-center gap-2 mb-10">
                    <span className="font-display text-5xl sm:text-6xl font-bold" style={{ background: "linear-gradient(135deg, hsl(42,90%,68%), hsl(38,92%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px hsla(42,87%,55%,0.2))" }}>₹49,999</span>
                    <span className="font-body text-white/25 text-sm">one-time</span>
                  </div>

                  <div className="space-y-3.5 text-left mb-10 max-w-sm mx-auto">
                    {[
                      "Complete source code ownership",
                      "All 18+ features included",
                      "Multi-role dashboard system",
                      "Database setup & configuration",
                      "Free deployment assistance",
                      "1 month free support",
                      "Custom branding & logo setup",
                      "Mobile-responsive design",
                    ].map((item, i) => (
                      <motion.div key={item} className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}>
                        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "hsl(145, 65%, 50%)" }} />
                        <span className="font-body text-sm text-white/55">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.a href="https://api.whatsapp.com/send/?phone=9036048950&text=Hi+Pavan%2C+I+want+to+purchase+the+college+website+for+%E2%82%B935%2C000.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-body text-base font-bold w-full justify-center transition-all duration-500 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, hsl(42,87%,62%), hsl(38,92%,50%))", color: "hsl(30,10%,8%)", boxShadow: "0 16px 50px hsla(42,87%,52%,0.3), inset 0 1px 0 hsla(50,100%,90%,0.35)" }}
                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </span>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Purchase Now</span>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Get in Touch</h2>
              <p className="font-body text-white/30 text-sm mb-12">Have questions? Reach out through any channel below.</p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { href: "https://api.whatsapp.com/send/?phone=9036048950&text=Hello+Pavan+%F0%9F%91%8B&type=phone_number&app_absent=0", Icon: MessageSquare, label: "WhatsApp", sub: "+91 9036048950", hoverColor: "hsla(145,65%,50%,0.25)" },
                  { href: "https://pavan-05.framer.ai/", Icon: Globe, label: "Portfolio", sub: "pavan-05.framer.ai", hoverColor: "hsla(42,87%,55%,0.25)" },
                  { href: "mailto:pavan05@flash.co", Icon: Mail, label: "Email", sub: "pavan05@flash.co", hoverColor: "hsla(200,70%,55%,0.25)" },
                ].map((c) => (
                  <motion.a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                    className="group p-7 rounded-2xl border border-white/[0.05] transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.015)" }}
                    whileHover={{ y: -4, borderColor: c.hoverColor }}>
                    <c.Icon className="w-8 h-8 mx-auto mb-3 text-white/30 group-hover:text-white/70 transition-colors duration-300" />
                    <p className="font-body text-xs font-bold text-white/60">{c.label}</p>
                    <p className="font-body text-[10px] text-white/25 mt-1">{c.sub}</p>
                  </motion.a>
                ))}
              </div>

              <div className="mt-14">
                <Link to="/credits" className="font-body text-xs text-white/20 hover:text-white/40 transition-colors inline-flex items-center gap-1.5">
                  ← Back to Credits
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
