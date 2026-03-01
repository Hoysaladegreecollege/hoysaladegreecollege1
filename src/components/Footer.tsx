import { Link } from "react-router-dom";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowUpRight,
  Heart,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const MAPS_LINK = "https://maps.app.goo.gl/nqvvEX7kgB7wQVKb7";

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
    <footer className="bg-[hsl(228,14%,8%)] dark:bg-[hsl(230,15%,5%)] text-white/90 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-secondary/3 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-primary-foreground/2 blur-3xl" />

      <div className="container py-10 sm:py-16 px-5 sm:px-4 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <span className="font-display text-base sm:text-lg font-bold block">Hoysala Degree College</span>
                <span className="text-[9px] text-secondary/80 font-body">Est. 2017</span>
              </div>
            </div>
            <p className="text-xs font-body opacity-60 leading-relaxed mb-1">
              Affiliated To Bangalore University & Approved by AICTE New Delhi
            </p>
            <p className="text-[11px] sm:text-xs font-body opacity-50">College Code: BU 26 (P21GEF0099)</p>
            <div className="flex gap-2.5 mt-5">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary hover:border-secondary active:scale-95 transition-all duration-300 touch-manipulation"
                >
                  <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-secondary rounded-full" /> Quick Links
            </h3>
            <div className="flex flex-col gap-3 sm:gap-2.5 font-body text-sm sm:text-sm opacity-70">
              {[
                { label: "About", path: "/about" },
                { label: "Courses", path: "/courses" },
                { label: "Admissions", path: "/admissions" },
                { label: "Committees", path: "/committees" },
                { label: "Management", path: "/management" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.path}
                  className="hover:text-secondary active:opacity-70 transition-all duration-300 inline-flex items-center gap-1 group touch-manipulation py-0.5"
                >
                  {l.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-secondary rounded-full" /> Our Courses
            </h3>
            <div className="flex flex-col gap-3 sm:gap-2.5 font-body text-sm sm:text-sm opacity-70">
              {["BCA", "B.Com Regular", "B.Com Professional", "BBA", "CA / CS Coaching"].map((c) => (
                <Link
                  key={c}
                  to="/courses"
                  className="hover:text-secondary active:opacity-70 transition-all duration-300 inline-flex items-center gap-1 group touch-manipulation py-0.5"
                >
                  {c}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-secondary rounded-full" /> Contact Us
            </h3>
            <div className="flex flex-col gap-4 sm:gap-3.5 font-body text-sm opacity-70">
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2.5 items-start hover:text-secondary active:opacity-70 transition-colors group touch-manipulation"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-secondary/20 transition-colors">
                  <MapPin className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="leading-relaxed text-[13px] sm:text-sm">
                  K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town - 562 123
                </span>
              </a>
              <div className="flex gap-2.5 items-center">
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {["7676272167", "7975344252", "8618181383"].map((n) => (
                    <a
                      key={n}
                      href={`tel:${n}`}
                      className="hover:text-secondary active:opacity-70 transition-colors touch-manipulation text-[13px] sm:text-sm"
                    >
                      {n}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </div>
                <a
                  href="mailto:principal.hoysaladegreecollege@gmail.com"
                  className="hover:text-secondary active:opacity-70 transition-colors text-[12px] sm:text-xs break-all touch-manipulation"
                >
                  principal.hoysaladegreecollege@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/8">
        <div className="container py-4 px-5 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs font-body opacity-40">
          <span>© {new Date().getFullYear()} Hoysala Degree College. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-secondary fill-secondary" /> ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
          </span>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group/top ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}
        aria-label="Back to top"
      >
        {/* Scroll progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" className="opacity-25" />
          <circle cx="28" cy="28" r="26" fill="none" stroke="hsl(var(--gold))" strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress)}`}
            strokeLinecap="round"
            className="transition-all duration-150 drop-shadow-[0_0_4px_hsl(var(--gold)/0.4)]" />
        </svg>
        {/* Button bg */}
        <span className="absolute inset-[4px] rounded-full bg-card border border-border/40 group-hover/top:border-[hsl(var(--gold))]/40 group-hover/top:shadow-[0_0_20px_hsl(var(--gold)/0.2)] transition-all duration-300" />
        <ArrowUp className="w-4.5 h-4.5 relative text-foreground group-hover/top:text-[hsl(var(--gold))] group-hover/top:-translate-y-0.5 transition-all duration-300" />
      </button>
    </footer>
  );
}
