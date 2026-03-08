import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Download,
  Smartphone,
  Shield,
  Zap,
  Bell,
  BookOpen,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  PartyPopper,
  GraduationCap,
  Clock,
  Users,
  Fingerprint,
  Globe,
  MonitorSmartphone,
} from "lucide-react";

const features = [
  { icon: BookOpen, label: "Attendance & Marks", desc: "Track your academic progress in real-time with detailed analytics", hsl: "217 72% 55%" },
  { icon: Bell, label: "Instant Notifications", desc: "Never miss an important notice, event, or deadline", hsl: "160 60% 50%" },
  { icon: Shield, label: "Secure & Private", desc: "Your data is encrypted end-to-end and fully protected", hsl: "42 87% 55%" },
  { icon: Zap, label: "Lightning Fast", desc: "Optimized for a smooth, lag-free mobile experience", hsl: "270 60% 65%" },
  { icon: Fingerprint, label: "Biometric Login", desc: "Quick secure access with fingerprint authentication", hsl: "340 65% 55%" },
  { icon: Clock, label: "Smart Timetable", desc: "Auto-synced class schedule with reminders", hsl: "190 70% 50%" },
];

const screenshots = [
  { label: "Dashboard", emoji: "📊", desc: "Overview at a glance" },
  { label: "Attendance", emoji: "📋", desc: "Real-time tracking" },
  { label: "Timetable", emoji: "📅", desc: "Smart scheduling" },
  { label: "Notices", emoji: "📢", desc: "Instant updates" },
];

export default function DownloadPage() {
  const [showThankYou, setShowThankYou] = useState(false);
  const [downloadCount] = useState(1247);

  const handleDownload = () => {
    setShowThankYou(true);
    const link = document.createElement("a");
    link.href = "/downloads/HDC_Portal.apk";
    link.download = "HDC_Portal.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-enter">
      <SEOHead
        title="Download HDC Portal App"
        description="Download the official Hoysala Degree College mobile app for Android. Access attendance, marks, timetable, notices and more."
        canonical="/download"
      />
      <PageHeader title="Download Our App" subtitle="Your college, in your pocket" />

      {/* Hero Download Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Premium dark background */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, hsl(230,12%,6%) 0%, hsl(228,14%,8%) 40%, hsl(230,10%,4%) 100%)" }} />
        
        {/* Multi-layer ambient glows */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(var(--gold), 0.06), transparent 70%)" }} />
        <div className="absolute bottom-0 left-[20%] w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-secondary/[0.02] rounded-full blur-[80px] pointer-events-none" />
        
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.2) 50%, transparent 90%)" }} />

        <div className="relative container px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                {/* App icon - Apple-inspired */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-10 group">
                  <div className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-br from-primary/30 to-primary/5 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-full h-full rounded-[2.2rem] bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.08] flex items-center justify-center shadow-2xl backdrop-blur-xl overflow-hidden group-hover:scale-105 transition-transform duration-700"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                    {/* Inner shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <GraduationCap className="w-16 h-16 sm:w-18 sm:h-18 text-white/80 relative z-10 drop-shadow-lg" />
                  </div>
                  {/* Badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-9 h-9 rounded-xl bg-emerald-500 border-[3px] border-[hsl(230,12%,6%)] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Title */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-5 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-secondary/60 animate-sparkle" />
                  <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Official App</span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-[-0.02em] leading-[1.1]">
                  HDC Portal
                </h2>
                <p className="font-body text-white/40 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  The official Hoysala Degree College app for students, teachers, and parents. Everything in one place.
                </p>

                {/* Rating & stats strip */}
                <div className="flex items-center justify-center gap-5 sm:gap-8 mt-8 mb-12">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <span className="text-white/35 text-[10px] font-body font-semibold tracking-wider uppercase">4.8 Rating</span>
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white/90 text-lg font-display font-bold">{downloadCount.toLocaleString()}+</span>
                    <span className="text-white/35 text-[10px] font-body font-semibold tracking-wider uppercase">Downloads</span>
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white/90 text-lg font-display font-bold">6 MB</span>
                    <span className="text-white/35 text-[10px] font-body font-semibold tracking-wider uppercase">App Size</span>
                  </div>
                </div>

                {/* Premium download button */}
                <button
                  onClick={handleDownload}
                  className="group relative inline-flex items-center gap-3 px-12 sm:px-16 py-5 sm:py-[1.35rem] rounded-[1.25rem] font-body text-base sm:text-lg font-bold transition-all duration-600 hover:scale-105 hover:-translate-y-1 active:scale-[0.97] touch-manipulation"
                  style={{
                    background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,50%), hsl(35,85%,45%))",
                    color: "hsl(30,10%,10%)",
                    boxShadow: "0 16px 48px hsla(42,87%,52%,0.35), 0 0 100px hsla(42,87%,52%,0.08), inset 0 1px 0 hsla(50,100%,90%,0.35)",
                  }}
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 overflow-hidden rounded-[1.25rem]">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </span>
                  {/* Glass ring */}
                  <span className="absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-white/25 pointer-events-none" />
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:animate-bounce" />
                  <span className="relative z-10">Download for Android</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>

                <p className="text-white/20 text-[11px] font-body mt-5 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                  APK file • Requires Android 6.0+ • Free
                </p>
              </div>
            </ScrollReveal>

            {/* App preview cards */}
            <ScrollReveal delay={200}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                {screenshots.map((s, i) => (
                  <div
                    key={s.label}
                    className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 sm:p-7 text-center group overflow-hidden active:scale-[0.97] touch-manipulation"
                    style={{
                      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                      animationDelay: `${i * 100}ms`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "";
                      (e.currentTarget as HTMLElement).style.boxShadow = "";
                    }}
                  >
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                      style={{ background: "linear-gradient(90deg, transparent, hsla(var(--gold), 0.3), transparent)" }} />
                    <span className="text-4xl sm:text-5xl mb-3 inline-block group-hover:scale-115 group-hover:-rotate-3 transition-all duration-500 filter group-hover:drop-shadow-lg">
                      {s.emoji}
                    </span>
                    <p className="font-display text-xs sm:text-sm font-bold text-white/70 group-hover:text-white/90 transition-colors">{s.label}</p>
                    <p className="font-body text-[10px] text-white/25 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
        {/* Subtle diagonal pattern */}
        <div className="absolute inset-0 opacity-[0.012] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--foreground) / 0.15) 0, hsl(var(--foreground) / 0.15) 1px, transparent 1px, transparent 60px)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading
              title="Why Students Love It"
              subtitle="Everything you need for your college journey, beautifully designed."
            />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 80}>
                <div
                  className="relative p-6 sm:p-7 rounded-3xl border border-border/30 bg-card group overflow-hidden h-full active:scale-[0.97] touch-manipulation"
                  style={{ transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px -12px hsla(${f.hsl}, 0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  {/* Hover gradient fill */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 rounded-3xl pointer-events-none"
                    style={{ background: `linear-gradient(135deg, hsla(${f.hsl}, 0.05), transparent 70%)` }} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                    style={{ background: `linear-gradient(90deg, transparent, hsla(${f.hsl}, 0.5), transparent)` }} />
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] rounded-3xl pointer-events-none"
                    style={{ transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }} />

                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 border border-border/30 shadow-sm"
                      style={{ background: `hsla(${f.hsl}, 0.08)` }}
                    >
                      <f.icon className="w-7 h-7" style={{ color: `hsl(${f.hsl})` }} />
                    </div>
                    <h4 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{f.label}</h4>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, hsl(230,12%,6%), hsl(228,14%,8%), hsl(230,10%,4%))" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 40%, hsl(var(--gold)), transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.2) 50%, transparent 90%)" }} />

        <div className="relative container px-4 text-center">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-secondary/70" />
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-white mb-3 tracking-[-0.01em]">
                Start Your Digital Campus Life
              </h3>
              <p className="font-body text-white/35 text-sm mb-10 max-w-md mx-auto leading-relaxed">
                Join thousands of students already using HDC Portal to stay connected with their college.
              </p>
              <button
                onClick={handleDownload}
                className="group relative inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-body text-sm font-bold transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-[0.97] touch-manipulation"
                style={{
                  background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,50%), hsl(35,85%,45%))",
                  color: "hsl(30,10%,10%)",
                  boxShadow: "0 12px 40px hsla(42,87%,52%,0.3), inset 0 1px 0 hsla(50,100%,90%,0.3)",
                }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </span>
                <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Download Now</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <div className="mt-8 flex items-center justify-center gap-5 text-white/20 text-[10px] font-body font-semibold tracking-wider uppercase">
                <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {downloadCount}+ Users</span>
                <span>•</span>
                <span>Free Forever</span>
                <span>•</span>
                <span>Android 6.0+</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md rounded-3xl border-border/20 overflow-hidden p-0 bg-card/95 backdrop-blur-2xl shadow-2xl">
          {/* Top gradient hero */}
          <div className="relative py-12 px-6 text-center overflow-hidden"
            style={{ background: "linear-gradient(160deg, hsl(230,12%,6%), hsl(228,14%,9%), hsl(230,10%,5%))" }}>
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--gold)), transparent 60%)" }} />
            <div className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            
            <div className="relative">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl" />
                <div className="relative w-full h-full rounded-3xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center backdrop-blur-sm"
                  style={{ boxShadow: "0 8px 32px hsla(142,70%,45%,0.2)" }}>
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center border-2 border-[hsl(230,12%,6%)] shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-2 tracking-[-0.01em]">
                Thank You! 🎉
              </h3>
              <p className="font-body text-white/40 text-sm">
                Your download has started
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-center gap-2.5">
              <PartyPopper className="w-5 h-5 text-secondary" />
              <span className="font-display text-base font-bold text-foreground">
                Welcome to HDC Portal!
              </span>
              <PartyPopper className="w-5 h-5 text-secondary" />
            </div>

            <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto text-center">
              The APK file is being downloaded. Follow these steps to install the app on your device.
            </p>

            {/* Install steps */}
            <div className="space-y-2.5 max-w-xs mx-auto">
              {[
                "Open the downloaded APK file",
                "Allow installation from unknown sources",
                "Follow the on-screen instructions",
                "Log in with your college credentials",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all duration-300 group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: "hsla(var(--primary), 0.08)" }}>
                    <span className="font-display text-[11px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-2">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span className="font-body text-[11px] text-muted-foreground/60">
                Made with love for HDC students
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
