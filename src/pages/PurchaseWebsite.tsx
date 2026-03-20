import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import {
  Sparkles, Shield, Zap, Users, BookOpen, Bell, BarChart3, Calendar, MessageSquare,
  GraduationCap, Upload, Fingerprint, Globe, MonitorSmartphone, Star, CheckCircle,
  ArrowRight, Heart, Phone, Mail, ExternalLink, Crown, Layers, Lock, Eye,
  ClipboardCheck, Award, Brain, Camera, TrendingUp, CircuitBoard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRICE_CHARS = ["₹", "1", "5", ",", "0", "0", "0"];
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SPECIAL_CHARS = ["₹", ","];

function SlotDigit({ char, delay, revealed }: { char: string; delay: number; revealed: boolean }) {
  const isSpecial = SPECIAL_CHARS.includes(char);
  const targetIndex = isSpecial ? 0 : DIGITS.indexOf(char);
  const stripItems = isSpecial ? [char] : DIGITS;
  const itemH = 72;
  const totalH = stripItems.length * itemH;
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!revealed) { setLanded(false); return; }
    const t = setTimeout(() => setLanded(true), delay);
    return () => clearTimeout(t);
  }, [revealed, delay]);

  if (!revealed) return null;

  return (
    <div className="relative overflow-hidden" style={{ height: itemH, width: isSpecial ? 30 : (char === "," ? 16 : 40) }}>
      <AnimatePresence>
        {landed && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none rounded-lg"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: "radial-gradient(circle, hsla(42,87%,65%,0.5), transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col"
        initial={{ y: -(Math.random() * totalH * 2 + totalH * 2) }}
        animate={landed
          ? { y: -(targetIndex * itemH) }
          : { y: [-(totalH * 3), 0] }
        }
        transition={landed
          ? { type: "spring", stiffness: 280, damping: 18, mass: 0.8 }
          : { duration: 0.25, repeat: Infinity, ease: "linear" }
        }
      >
        {(!landed ? [...stripItems, ...stripItems, ...stripItems, ...stripItems] : stripItems).map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0 font-display font-bold"
            style={{
              height: itemH,
              fontSize: isSpecial ? 28 : (char === "," ? 28 : 42),
              background: "linear-gradient(135deg, hsl(42,87%,55%), hsl(38,92%,65%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {d}
          </div>
        ))}
      </motion.div>

      <div className="absolute top-0 left-0 right-0 h-3 pointer-events-none" style={{ background: "linear-gradient(to bottom, #050608, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none" style={{ background: "linear-gradient(to top, #050608, transparent)" }} />
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

export default function PurchaseWebsite() {
  const [priceRevealed, setPriceRevealed] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #050608 0%, #0a0c14 50%, #050608 100%)" }}>
      <SEOHead title="Get This Website — College Management System | ₹15,000" description="Purchase this premium college management website with multi-role dashboards, attendance, fees, admissions and more. Built by Pavan A." canonical="/purchase" />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-36">
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[180px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(42,80%,55%,0.08), transparent 70%)" }} />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(220,80%,55%,0.04), transparent 70%)" }} />
        </div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(rgba(198,167,94,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative container px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[hsl(42_87%_55%_/_0.2)] mb-8" style={{ background: "rgba(198,167,94,0.06)" }}>
              <Crown className="w-4 h-4" style={{ color: "hsl(42, 87%, 55%)" }} />
              <span className="font-body text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(42, 87%, 55%)" }}>Premium College Management System</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight max-w-4xl mx-auto">
              The Complete <br className="hidden sm:block" />
              <span style={{ background: "linear-gradient(135deg, hsl(42,87%,55%), hsl(38,92%,65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>College Website</span>
              <br className="hidden sm:block" /> You Need
            </h1>

            <p className="font-body text-white/40 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              Multi-role dashboards, attendance, marks, fees, admissions, messaging, gallery, AI chatbot — everything built and ready to deploy for your institution.
            </p>

            {/* Price with slot-machine reveal animation */}
            <div className="mt-10 inline-flex flex-col items-center gap-2">
              <AnimatePresence mode="wait">
                {priceRevealed ? (
                  <motion.div
                    key="price"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="flex items-center justify-center">
                      {PRICE_CHARS.map((char, i) => (
                        <SlotDigit key={i} char={char} delay={400 + i * 350} revealed={priceRevealed} />
                      ))}
                    </div>

                    <motion.div
                      className="relative overflow-hidden rounded-full px-6 py-1.5 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ delay: 3.4, duration: 0.8, ease: "easeInOut" }}
                        style={{ background: "linear-gradient(90deg, transparent, hsla(42,87%,65%,0.3), transparent)", width: "50%" }}
                      />
                      <span className="font-body text-white/30 text-sm relative z-10">one-time payment</span>
                    </motion.div>

                    <motion.p
                      className="font-body text-white/25 text-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.6 }}
                    >Full source code • Lifetime ownership • Free deployment support</motion.p>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    onClick={() => setPriceRevealed(true)}
                    className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-body text-base font-bold border border-[hsl(42_87%_55%_/_0.3)] transition-all duration-500 overflow-hidden"
                    style={{ background: "rgba(198,167,94,0.06)" }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(42_87%_55%_/_0.15)] to-transparent -translate-x-full animate-[loginShimmer_3s_ease-in-out_infinite]" />
                    </span>
                    <Eye className="w-5 h-5 relative z-10" style={{ color: "hsl(42, 87%, 55%)" }} />
                    <span className="relative z-10" style={{ color: "hsl(42, 87%, 55%)" }}>Reveal Price</span>
                    <Sparkles className="w-4 h-4 relative z-10 opacity-50" style={{ color: "hsl(42, 87%, 55%)" }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a href="https://api.whatsapp.com/send/?phone=9036048950&text=Hi+Pavan%2C+I%27m+interested+in+purchasing+the+college+website.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-10 sm:px-14 py-5 rounded-[1.25rem] font-body text-base font-bold transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,50%), hsl(35,85%,45%))", color: "hsl(30,10%,10%)", boxShadow: "0 16px 48px hsla(42,87%,52%,0.35), inset 0 1px 0 hsla(50,100%,90%,0.35)" }}>
                <span className="absolute inset-0 overflow-hidden rounded-[1.25rem]">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </span>
                <MessageSquare className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Buy on WhatsApp</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <a href="https://pavan-05.framer.ai/" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-[1.25rem] font-body text-sm font-bold border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <Globe className="w-5 h-5" />
                <span>Developer Portfolio</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(198,167,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(198,167,94,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                <span style={{ color: "hsl(42, 87%, 55%)" }}>18+</span> Powerful Features
              </h2>
              <p className="font-body text-white/35 text-sm mt-3 max-w-lg mx-auto">Everything you need to run a modern educational institution — built, tested, and production-ready.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {allFeatures.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 50}>
                <div className="group relative p-6 rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, hsla(${f.color}, 0.06), transparent 70%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsla(${f.color}, 0.5), transparent)` }} />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border border-white/[0.06] group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `hsla(${f.color}, 0.08)` }}>
                      <f.icon className="w-5 h-5" style={{ color: `hsla(${f.color}, 0.8)` }} />
                    </div>
                    <h3 className="font-display text-sm font-bold text-white/90 mb-1.5">{f.title}</h3>
                    <p className="font-body text-xs text-white/35 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Previews */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(42,80%,55%,0.05), transparent 70%)" }} />
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Dashboard Previews</h2>
              <p className="font-body text-white/35 text-sm mt-3">Three powerful dashboards tailored for every role in the institution</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {dashboardPreviews.map((d, i) => (
              <ScrollReveal key={d.role} delay={i * 120}>
                <div className="group relative rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-2"
                  style={{ background: "rgba(255,255,255,0.02)", boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)" }}>
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, hsla(${d.color}, 0.4), transparent)` }} />
                  <div className="p-7">
                    <div className="text-5xl mb-4">{d.emoji}</div>
                    <h3 className="font-display text-lg font-bold text-white mb-4">{d.role}</h3>
                    <div className="space-y-2.5">
                      {d.features.map((f) => (
                        <div key={f} className="flex items-center gap-2.5">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: `hsla(${d.color}, 0.7)` }} />
                          <span className="font-body text-xs text-white/50">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 sm:py-20 relative">
        <div className="container px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Built With Modern Tech</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {techStack.map((t) => (
                <span key={t} className="px-4 py-2 rounded-xl border border-white/[0.06] font-body text-xs font-medium text-white/50 hover:text-white/80 hover:border-white/[0.12] transition-all duration-300" style={{ background: "rgba(255,255,255,0.02)" }}>
                  {t}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(42,80%,55%,0.08), transparent 70%)" }} />
        </div>
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <div className="relative rounded-3xl border border-[hsl(42_87%_55%_/_0.2)] overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(198,167,94,0.04), rgba(20,24,36,0.98))", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5), 0 0 60px rgba(198,167,94,0.06)" }}>
                <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(42 87% 55% / 0.6), transparent)" }} />

                <div className="p-8 sm:p-12 text-center">
                  <Crown className="w-12 h-12 mx-auto mb-5" style={{ color: "hsl(42, 87%, 55%)" }} />
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Complete Website Package</h3>
                  <p className="font-body text-white/35 text-sm mb-8">Everything included — no hidden costs</p>

                  <div className="flex items-baseline justify-center gap-2 mb-8">
                    <span className="font-display text-5xl sm:text-6xl font-bold" style={{ color: "hsl(42, 87%, 55%)" }}>₹15,000</span>
                    <span className="font-body text-white/30 text-sm">one-time</span>
                  </div>

                  <div className="space-y-3 text-left mb-10 max-w-sm mx-auto">
                    {[
                      "Complete source code ownership",
                      "All 18+ features included",
                      "Multi-role dashboard system",
                      "Database setup & configuration",
                      "Free deployment assistance",
                      "1 month free support",
                      "Custom branding & logo setup",
                      "Mobile-responsive design",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "hsl(145, 65%, 50%)" }} />
                        <span className="font-body text-sm text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>

                  <a href="https://api.whatsapp.com/send/?phone=9036048950&text=Hi+Pavan%2C+I+want+to+purchase+the+college+website+for+%E2%82%B915%2C000.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-body text-base font-bold w-full justify-center transition-all duration-500 hover:scale-[1.02] hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,50%))", color: "hsl(30,10%,10%)", boxShadow: "0 12px 40px hsla(42,87%,52%,0.3), inset 0 1px 0 hsla(50,100%,90%,0.3)" }}>
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </span>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Purchase Now</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Get in Touch</h2>
              <p className="font-body text-white/35 text-sm mb-10">Have questions? Reach out through any channel below.</p>

              <div className="grid sm:grid-cols-3 gap-4">
                <a href="https://api.whatsapp.com/send/?phone=9036048950&text=Hello+Pavan+%F0%9F%91%8B&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
                  className="group p-6 rounded-2xl border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
                  <p className="font-body text-xs font-bold text-white/70">WhatsApp</p>
                  <p className="font-body text-[10px] text-white/30 mt-1">+91 9036048950</p>
                </a>
                <a href="https://pavan-05.framer.ai/" target="_blank" rel="noopener noreferrer"
                  className="group p-6 rounded-2xl border border-white/[0.06] hover:border-[hsl(42_87%_55%_/_0.3)] transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <Globe className="w-8 h-8 mx-auto mb-3 group-hover:text-[hsl(42,87%,55%)] transition-colors" style={{ color: "hsla(42,87%,55%,0.6)" }} />
                  <p className="font-body text-xs font-bold text-white/70">Portfolio</p>
                  <p className="font-body text-[10px] text-white/30 mt-1">pavan-05.framer.ai</p>
                </a>
                <a href="mailto:pavan05@flash.co"
                  className="group p-6 rounded-2xl border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <Mail className="w-8 h-8 mx-auto mb-3 text-cyan-400/60 group-hover:text-cyan-400 transition-colors" />
                  <p className="font-body text-xs font-bold text-white/70">Email</p>
                  <p className="font-body text-[10px] text-white/30 mt-1">pavan05@flash.co</p>
                </a>
              </div>

              <div className="mt-12">
                <Link to="/credits" className="font-body text-xs text-white/25 hover:text-white/50 transition-colors inline-flex items-center gap-1.5">
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
