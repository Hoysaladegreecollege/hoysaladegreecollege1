import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import {
  Sparkles, Shield, Zap, Users, BookOpen, Bell, BarChart3, Calendar, MessageSquare,
  GraduationCap, Upload, Fingerprint, Globe, MonitorSmartphone, Star, CheckCircle,
  ArrowRight, Heart, Phone, Mail, ExternalLink, Crown, Layers, Lock, Eye,
  ClipboardCheck, Award, Brain, Camera, TrendingUp, CircuitBoard, Gem, Rocket,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

/* ── Slot Machine ── */
const PRICE_CHARS = ["₹", "3", "5", ",", "0", "0", "0"];
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

export default function PurchaseWebsite() {
  const [revealPhase, setRevealPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [landedCount, setLandedCount] = useState(0);
  const allLanded = landedCount >= PRICE_CHARS.length;

  useEffect(() => {
    if (revealPhase === "spinning" && allLanded) {
      const t = setTimeout(() => setRevealPhase("done"), 300);
      return () => clearTimeout(t);
    }
  }, [allLanded, revealPhase]);

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(180deg, #050608 0%, #07080c 30%, #0a0c14 60%, #050608 100%)" }}>
      <SEOHead title="Get This Website — College Management System | ₹35,000" description="Purchase this premium college management website with multi-role dashboards, attendance, fees, admissions and more. Built by Pavan A." canonical="/purchase" />

      {/* Floating ambient particles */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 1.8} x={`${8 + (i * 7.5) % 85}%`} size={2 + (i % 3)} />
      ))}

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-24 pb-28 sm:pt-36 sm:pb-40">
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
            <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-[5rem] font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-5xl mx-auto">
              The Complete{" "}
              <span className="relative inline-block">
                <span style={{ background: "linear-gradient(135deg, hsl(42,90%,68%), hsl(38,92%,55%), hsl(42,80%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  College Platform
                </span>
                <motion.span 
                  className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(42,87%,55%), transparent)" }}
                  animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              <br className="hidden sm:block" />
              Your Institution Deserves
            </h1>

            <p className="font-body text-white/35 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mt-7 leading-relaxed">
              Multi-role dashboards, attendance, marks, fees, admissions, messaging, gallery, AI chatbot — <span className="text-white/55 font-medium">everything built and ready to deploy.</span>
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {trustBadges.map((b, i) => (
                <motion.div 
                  key={b.label}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
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
                      {/* Double ambient glow */}
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
      </section>

      {/* ─── FEATURE GRID ─── */}
      <section className="py-24 sm:py-32 relative">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "linear-gradient(hsla(42,87%,55%,0.4) 1px, transparent 1px), linear-gradient(90deg, hsla(42,87%,55%,0.4) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,55%,0.08), transparent)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <CircuitBoard className="w-3.5 h-3.5" style={{ color: "hsla(42,87%,55%,0.6)" }} />
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Feature Arsenal</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                <span style={{ color: "hsl(42, 87%, 55%)" }}>18+</span> Powerful Features
              </h2>
              <p className="font-body text-white/30 text-sm mt-4 max-w-lg mx-auto leading-relaxed">Everything you need to run a modern educational institution — built, tested, and production-ready.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {allFeatures.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 40}>
                <motion.div 
                  className="group relative p-6 rounded-2xl border border-white/[0.05] overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.015)" }}
                  whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, hsla(${f.color}, 0.07), transparent 60%)` }} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: `linear-gradient(90deg, hsla(${f.color}, 0.6), transparent)` }} />
                  
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border border-white/[0.06] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      style={{ background: `hsla(${f.color}, 0.08)`, boxShadow: `0 0 0 hsla(${f.color}, 0)` }}>
                      <f.icon className="w-5 h-5" style={{ color: `hsla(${f.color}, 0.85)` }} />
                    </div>
                    <h3 className="font-display text-sm font-bold text-white/90 mb-1.5">{f.title}</h3>
                    <p className="font-body text-xs text-white/30 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEWS ─── */}
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
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Dashboard Previews</h2>
              <p className="font-body text-white/30 text-sm mt-4">Three powerful dashboards tailored for every role in the institution</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {dashboardPreviews.map((d, i) => (
              <ScrollReveal key={d.role} delay={i * 120}>
                <motion.div 
                  className="group relative rounded-2xl border border-white/[0.05] overflow-hidden"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))", boxShadow: "0 25px 70px -25px rgba(0,0,0,0.5)" }}
                  whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.12)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Top accent */}
                  <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, hsla(${d.color}, 0.5), transparent)` }} />
                  <div className="p-7 sm:p-8">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{d.emoji}</div>
                    <h3 className="font-display text-lg font-bold text-white mb-5">{d.role}</h3>
                    <div className="space-y-3">
                      {d.features.map((f) => (
                        <div key={f} className="flex items-center gap-2.5">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: `hsla(${d.color}, 0.7)` }} />
                          <span className="font-body text-xs text-white/45">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE DEMO PREVIEW ─── */}
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
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Live Preview</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                See It <span style={{ color: "hsl(42, 87%, 55%)" }}>In Action</span>
              </h2>
              <p className="font-body text-white/30 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
                Explore the actual live platform — interact with the real dashboards, navigate pages, and experience the quality firsthand.
              </p>
            </div>
          </ScrollReveal>

          {/* Demo tabs */}
          <LiveDemoSection />
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
                {/* Top gold accent */}
                <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(42 87% 55% / 0.7), transparent)" }} />
                
                {/* Corner accents */}
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
                    <span className="font-display text-5xl sm:text-6xl font-bold" style={{ background: "linear-gradient(135deg, hsl(42,90%,68%), hsl(38,92%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px hsla(42,87%,55%,0.2))" }}>₹35,000</span>
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
