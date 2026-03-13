import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, ArrowUpRight, Heart, ArrowUp, Sparkles, GraduationCap } from "lucide-react";
import collegeLogo from "@/assets/college-logo.png";
import { useState, useEffect } from "react";

const MAPS_LINK = "https://maps.app.goo.gl/nqvvEX7kgB7wQVKb7";

const quickLinks = [
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Admissions", path: "/admissions" },
  { label: "Alumni Network", path: "/alumni" },
  { label: "Clubs & Societies", path: "/clubs" },
  { label: "Library", path: "/library" },
  { label: "Committees", path: "/committees" },
  { label: "Management", path: "/management" },
  { label: "Contact", path: "/contact" },
  { label: "Download App", path: "/download" },
];

const courseLinks = ["BCA", "B.Com Regular", "B.Com Professional", "BBA", "CA / CS Coaching"];

const socials = [
  { Icon: Facebook, label: "Facebook", hsl: "220, 80%, 55%" },
  { Icon: Twitter, label: "Twitter", hsl: "200, 90%, 55%" },
  { Icon: Instagram, label: "Instagram", hsl: "330, 70%, 55%" },
  { Icon: Youtube, label: "YouTube", hsl: "0, 75%, 55%" },
];

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 400);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-card border-t border-border">
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      
      {/* Ambient glows */}
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full blur-[180px] pointer-events-none bg-secondary/[0.03]" />
      <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full blur-[150px] pointer-events-none bg-primary/[0.02]" />
      
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Ultra-premium CTA strip */}
      <div className="relative border-b border-border/50 overflow-hidden">
        {/* Animated ambient orbs */}
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[250px] h-[250px] rounded-full blur-[120px] pointer-events-none bg-secondary/[0.06] animate-pulse" />
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[100px] pointer-events-none bg-primary/[0.04]" />
        
        <div className="container py-10 sm:py-14 px-5 sm:px-4 relative">
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-secondary/15 bg-gradient-to-br from-secondary/[0.04] via-card to-secondary/[0.02] backdrop-blur-xl overflow-hidden">
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/[0.04] to-transparent animate-[shimmer_4s_ease-in-out_infinite] pointer-events-none" />
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-secondary/15 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-secondary/15 rounded-br-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-secondary/10 border border-secondary/20 shadow-lg shadow-secondary/10">
                <GraduationCap className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-display text-lg sm:text-xl font-bold text-foreground tracking-[-0.01em]">Start Your Journey Today</p>
                <p className="font-body text-xs sm:text-sm text-muted-foreground mt-0.5">Admissions open for 2026–27 academic year</p>
              </div>
            </div>
            <Link
              to="/admissions"
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-body text-sm font-semibold transition-all duration-500 overflow-hidden border bg-secondary text-secondary-foreground border-secondary/30 hover:shadow-[0_8px_30px_-5px_hsl(var(--secondary)/0.35)] hover:scale-[1.03] active:scale-[0.98] z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <span className="relative z-10">Apply Now</span>
              <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container py-12 sm:py-16 px-5 sm:px-4 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-border shadow-lg shadow-secondary/10">
                <img src={collegeLogo} alt="Hoysala Degree College Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-display text-base sm:text-lg font-bold block text-foreground">Hoysala Degree College</span>
                <span className="text-[9px] font-body font-semibold tracking-[0.15em] uppercase text-secondary">Est. 2019</span>
              </div>
            </div>
            <p className="text-xs font-body text-muted-foreground leading-relaxed mb-1.5">
              Affiliated To Bangalore University & Approved by AICTE New Delhi
            </p>
            <p className="text-[11px] font-body text-muted-foreground/60">College Code: BU 26 (P21GEF0099)</p>
            
            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {socials.map(({ Icon, label, hsl }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-400 group/social touch-manipulation border border-border hover:border-border/80 hover:-translate-y-0.5 bg-muted/50 hover:bg-muted"
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 25px -5px hsla(${hsl}, 0.2)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover/social:text-foreground transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-5 flex items-center gap-2.5 text-foreground">
              <span className="w-1 h-5 rounded-full bg-secondary" />
              Quick Links
            </h3>
            <div className="flex flex-col gap-3 sm:gap-2.5 font-body text-sm text-muted-foreground">
              {quickLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.path}
                  className="hover:text-foreground active:opacity-70 transition-all duration-300 inline-flex items-center gap-1.5 group touch-manipulation py-0.5 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-2 h-px transition-all duration-300 bg-secondary" />
                  {l.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-5 flex items-center gap-2.5 text-foreground">
              <span className="w-1 h-5 rounded-full bg-secondary" />
              Our Courses
            </h3>
            <div className="flex flex-col gap-3 sm:gap-2.5 font-body text-sm text-muted-foreground">
              {courseLinks.map((c) => (
                <Link
                  key={c}
                  to="/courses"
                  className="hover:text-foreground active:opacity-70 transition-all duration-300 inline-flex items-center gap-1.5 group touch-manipulation py-0.5 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-2 h-px transition-all duration-300 bg-secondary" />
                  {c}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-5 flex items-center gap-2.5 text-foreground">
              <span className="w-1 h-5 rounded-full bg-secondary" />
              Contact Us
            </h3>
            <div className="flex flex-col gap-4 sm:gap-3.5 font-body text-sm text-muted-foreground">
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 items-start hover:text-foreground active:opacity-70 transition-all duration-300 group touch-manipulation"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border border-border group-hover:border-border/80 transition-all duration-300 bg-muted/50">
                  <MapPin className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <span className="leading-relaxed text-[13px] sm:text-sm">
                  K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town - 562 123
                </span>
              </a>
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 border border-border bg-muted/50">
                  <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {["7676272167", "7975344252", "8618181383"].map((n) => (
                    <a key={n} href={`tel:${n}`} className="hover:text-foreground active:opacity-70 transition-colors touch-manipulation text-[13px] sm:text-sm">{n}</a>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 border border-border bg-muted/50">
                  <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                </div>
                <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-foreground active:opacity-70 transition-colors text-[12px] sm:text-xs break-all touch-manipulation">
                  principal.hoysaladegreecollege@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border/50">
        {/* Subtle gold accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />
        <div className="container py-5 px-5 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs font-body text-muted-foreground">
          <span>© {new Date().getFullYear()} Hoysala Degree College. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 fill-current text-secondary" /> 
            <span className="hidden sm:inline">ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)</span>
          </span>
          <Link to="/credits" className="transition-all duration-300 flex items-center gap-1 group text-secondary/50 hover:text-secondary">
            <Sparkles className="w-3 h-3" />
            Website Credits
          </Link>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group/top ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="26" fill="none" className="stroke-border" strokeWidth="2.5" />
          <circle
            cx="28" cy="28" r="26" fill="none"
            className="stroke-secondary drop-shadow-[0_0_6px_hsl(var(--secondary)/0.4)]"
            strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress)}`}
            strokeLinecap="round"
            style={{ transition: "all 150ms" }}
          />
        </svg>
        <span className="absolute inset-[4px] rounded-full border border-border group-hover/top:border-secondary/30 group-hover/top:shadow-[0_0_24px_hsl(var(--secondary)/0.15)] transition-all duration-300 bg-card" />
        <ArrowUp className="w-4.5 h-4.5 relative text-muted-foreground group-hover/top:text-secondary group-hover/top:-translate-y-0.5 transition-all duration-300" />
      </button>
    </footer>
  );
}
