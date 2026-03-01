import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
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
} from "lucide-react";

const features = [
  { icon: BookOpen, label: "Attendance & Marks", desc: "Track your academic progress in real-time", color: "#60a5fa" },
  { icon: Bell, label: "Instant Notifications", desc: "Never miss an important notice or event", color: "#34d399" },
  { icon: Shield, label: "Secure & Private", desc: "Your data is encrypted and fully protected", color: "#fbbf24" },
  { icon: Zap, label: "Lightning Fast", desc: "Optimized for smooth, lag-free experience", color: "#a78bfa" },
];

const screenshots = [
  { label: "Dashboard", emoji: "📊" },
  { label: "Attendance", emoji: "📋" },
  { label: "Timetable", emoji: "📅" },
  { label: "Notices", emoji: "📢" },
];

export default function DownloadPage() {
  const [showThankYou, setShowThankYou] = useState(false);
  const [downloadCount] = useState(1247);

  const handleDownload = () => {
    setShowThankYou(true);
    // Trigger the actual download
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
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Premium dark background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(230,12%,6%) 0%, hsl(228,14%,9%) 50%, hsl(230,10%,5%) 100%)",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 30%, hsl(var(--gold)), transparent 60%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.2) 50%, transparent 90%)" }}
        />

        <div className="relative container px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                {/* App icon */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-8 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-white/[0.08] flex items-center justify-center shadow-2xl relative group">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Smartphone className="w-14 h-14 sm:w-16 sm:h-16 text-white/80" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
                  HDC Portal
                </h2>
                <p className="font-body text-white/50 text-sm sm:text-base max-w-lg mx-auto mb-2">
                  The official Hoysala Degree College app for students, teachers, and parents.
                </p>

                {/* Rating & downloads */}
                <div className="flex items-center justify-center gap-6 mt-6 mb-10">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-white/60 text-xs font-body ml-1">4.8</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-white/50 text-xs font-body">{downloadCount.toLocaleString()}+ Downloads</span>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-white/50 text-xs font-body">Android</span>
                </div>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="group relative inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl font-body text-base sm:text-lg font-bold text-primary-foreground transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))",
                    boxShadow: "0 12px 40px hsl(var(--primary) / 0.35), 0 0 80px hsl(var(--primary) / 0.1)",
                  }}
                >
                  {/* Shimmer */}
                  <span className="absolute inset-0 overflow-hidden rounded-2xl">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </span>
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:animate-bounce" />
                  <span className="relative z-10">Download for Android</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <p className="text-white/30 text-[11px] font-body mt-4">
                  APK file • Requires Android 6.0+
                </p>
              </div>
            </ScrollReveal>

            {/* App preview cards */}
            <ScrollReveal delay={200}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                {screenshots.map((s, i) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6 text-center hover:bg-white/[0.07] transition-all duration-300 group hover:-translate-y-1"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="text-3xl sm:text-4xl mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                      {s.emoji}
                    </span>
                    <p className="font-body text-white/60 text-xs font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Why Students Love It
              </h3>
              <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
                Everything you need for your college journey, beautifully designed.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 100}>
                <div className="premium-card p-6 sm:p-7 text-center group h-full border-glow">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/[0.06]"
                    style={{ backgroundColor: `${f.color}15` }}
                  >
                    <f.icon className="w-7 h-7" style={{ color: f.color }} />
                  </div>
                  <h4 className="font-display text-base font-bold text-foreground mb-2">{f.label}</h4>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(230,12%,6%) 0%, hsl(228,14%,9%) 50%, hsl(230,10%,5%) 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--gold)), transparent 70%)" }} />
        <div className="relative container px-4 text-center">
          <ScrollReveal>
            <Sparkles className="w-8 h-8 text-yellow-400/60 mx-auto mb-4" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Start Your Digital Campus Life
            </h3>
            <p className="font-body text-white/40 text-sm mb-8 max-w-md mx-auto">
              Join thousands of students already using HDC Portal.
            </p>
            <button
              onClick={handleDownload}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-body text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))",
                boxShadow: "0 8px 30px hsl(var(--primary) / 0.3)",
              }}
            >
              <Download className="w-4 h-4" />
              Download Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md rounded-3xl border-border/30 overflow-hidden p-0">
          {/* Top gradient banner */}
          <div
            className="relative py-10 px-6 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(230,12%,6%) 0%, hsl(228,14%,9%) 50%, hsl(230,10%,5%) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--gold)), transparent 60%)" }}
            />
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5 animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Thank You!
              </h3>
              <p className="font-body text-white/50 text-sm">
                Your download has started
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <PartyPopper className="w-5 h-5 text-yellow-500" />
              <span className="font-body text-sm font-medium text-foreground">
                Welcome to HDC Portal!
              </span>
              <PartyPopper className="w-5 h-5 text-yellow-500" />
            </div>

            <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              The APK file is being downloaded. Once complete, open the file on your Android device to install the app.
            </p>

            {/* Install steps */}
            <div className="space-y-3 text-left max-w-xs mx-auto">
              {[
                "Open the downloaded APK file",
                "Allow installation from unknown sources",
                "Follow the on-screen instructions",
                "Log in with your college credentials",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-display text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-2">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span className="font-body text-[11px] text-muted-foreground">
                Made with love for HDC students
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
