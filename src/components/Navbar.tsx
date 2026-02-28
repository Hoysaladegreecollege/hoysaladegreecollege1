import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, ChevronDown, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Admissions", path: "/admissions" },
  { label: "Departments", path: "/departments" },
  { label: "Faculty", path: "/faculty" },
  { label: "Events", path: "/events" },
  { label: "Notices", path: "/notices" },
  { label: "Gallery", path: "/gallery" },
  { label: "Achievements", path: "/achievements" },
  { label: "Committees", path: "/committees" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Animate active indicator
  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle(s => ({ ...s, opacity: 0 }));
    }
  }, [location.pathname]);

  const progress = Math.min(scrollY / 300, 1);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
      ? "bg-card shadow-sm border-b border-border"
      : "bg-card border-b border-border/40"
    }`}>

      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-secondary via-primary to-secondary transition-all duration-100 z-50"
        style={{ width: `${progress * 100}%`, opacity: progress > 0 ? 1 : 0 }} />

      {/* Top bar */}
      <div className="relative bg-gradient-to-r from-primary via-primary to-navy-dark text-primary-foreground py-2 overflow-hidden">
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_4s_linear_infinite]" />
        <div className="container px-4 relative">
          <p className="font-display text-xs sm:text-sm font-bold tracking-wide text-center">
            ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
          </p>
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center mt-0.5 text-[10px] sm:text-xs">
            <span className="text-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Recognized by Govt. of Karnataka
            </span>
            <a href="tel:7676272167" className="hover:text-secondary transition-colors hidden sm:inline-flex items-center gap-1 group">
              <Phone className="w-3 h-3 group-hover:scale-110 transition-transform" /> 7676272167
            </a>
            <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-secondary transition-colors hidden sm:inline-flex items-center gap-1 group">
              <Mail className="w-3 h-3 group-hover:scale-110 transition-transform" /> Mail Us
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-2 sm:py-2.5 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0">
            {/* Gradient bg with rotation animation on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-navy-dark group-hover:from-navy-dark group-hover:to-primary transition-all duration-500" />
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <GraduationCap className="absolute inset-0 m-auto w-5 h-5 sm:w-6 sm:h-6 text-secondary group-hover:scale-110 group-hover:rotate-6 transition-all duration-400" />
          </div>
          <div className="leading-tight">
            <span className="font-display text-sm sm:text-[17px] font-bold block group-hover:text-primary transition-colors duration-300 text-foreground">
              Hoysala Degree College
            </span>
            <span className="font-body text-[8px] sm:text-[9px] tracking-wider text-muted-foreground block">
              Affiliated To Bangalore University | BU 26
            </span>
          </div>
        </Link>

        {/* Desktop links with sliding indicator */}
        <div ref={navRef} className="hidden xl:flex items-center gap-0 relative">
          {/* Sliding active pill */}
          <div
            className="absolute bottom-1 h-0.5 bg-gradient-to-r from-secondary/60 via-secondary to-secondary/60 rounded-full transition-all duration-400 ease-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: indicatorStyle.opacity }}
          />
          {/* Hover bg pill */}
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                data-active={active}
                className={`relative px-2.5 py-2 text-[11.5px] font-medium font-body rounded-lg transition-all duration-300 group/link ${
                  active
                    ? "text-primary font-semibold"
                    : "text-foreground/65 hover:text-primary"
                }`}
              >
                {/* Hover bg */}
                <span className="absolute inset-0 rounded-lg bg-primary/0 group-hover/link:bg-primary/5 transition-colors duration-300" />
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle className="hidden sm:flex" />
          <Link to="/login" className="hidden xl:block">
            <button className="relative group overflow-hidden px-5 py-2 rounded-xl font-body text-xs font-bold text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 active:scale-100 transition-all duration-300"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
              <span className="relative flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                Login
              </span>
            </button>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden relative p-2 rounded-xl hover:bg-primary/5 transition-all duration-300 text-foreground"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu className={`w-5 h-5 absolute transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
              <X className={`w-5 h-5 absolute transition-all duration-300 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`xl:hidden border-t border-border overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="container py-3 px-4 bg-card">
          {/* Nav links */}
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link, i) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`px-4 py-2.5 text-sm font-body rounded-xl transition-all duration-300 flex items-center justify-between group ${
                    active
                      ? "text-primary bg-primary/5 font-semibold border-l-2 border-secondary"
                      : "text-foreground hover:bg-muted hover:translate-x-1"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick contact */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex gap-2 flex-wrap mb-3">
              {["7676272167", "7975344252"].map((num) => (
                <a key={num} href={`tel:${num}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border font-body text-xs text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                  <Phone className="w-3 h-3" /> {num}
                </a>
              ))}
            </div>
            <Link to="/login">
              <button className="relative w-full group overflow-hidden px-6 py-3 rounded-xl font-body text-sm font-bold text-primary-foreground transition-all duration-300"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))" }}>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> Login to Portal
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
