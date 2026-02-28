import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, ChevronDown, Phone, Mail, Sparkles } from "lucide-react";
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

      {/* Top bar — premium */}
      <div className="relative bg-gradient-to-r from-[hsl(230,18%,8%)] via-[hsl(228,16%,10%)] to-[hsl(230,18%,8%)] text-white py-2.5 overflow-hidden">
        {/* Animated shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_5s_linear_infinite]" />
        {/* Floating ambient orbs */}
        <div className="absolute -top-6 left-[10%] w-24 h-24 rounded-full bg-[hsl(var(--gold))]/[0.06] blur-2xl animate-float" />
        <div className="absolute -bottom-4 right-[15%] w-20 h-20 rounded-full bg-[hsl(var(--gold))]/[0.04] blur-2xl animate-float animation-delay-300" />
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/25 to-transparent" />
        {/* Bottom gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/15 to-transparent" />

        <div className="container px-4 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <p className="font-display text-xs sm:text-sm font-bold tracking-wide text-center sm:text-left text-white animate-fade-in">
            ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
          </p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end text-[10px] sm:text-xs animate-fade-in animation-delay-200">
            <span className="text-[hsl(var(--gold))] font-semibold flex items-center gap-1.5 group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--gold))]/60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--gold))]" />
              </span>
              Recognized by Govt. of Karnataka
            </span>
            <span className="hidden sm:block w-px h-3.5 bg-white/10" />
            <a href="tel:7676272167" className="text-white/50 hover:text-[hsl(var(--gold))] transition-all duration-300 hidden sm:inline-flex items-center gap-1.5 group hover:translate-y-[-1px]">
              <Phone className="w-3 h-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" /> 7676272167
            </a>
            <span className="hidden sm:block w-px h-3.5 bg-white/10" />
            <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="text-white/50 hover:text-[hsl(var(--gold))] transition-all duration-300 hidden sm:inline-flex items-center gap-1.5 group hover:translate-y-[-1px]">
              <Mail className="w-3 h-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" /> Mail Us
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
          <DarkModeToggle />
          <Link to="/login" className="hidden xl:block">
            <button className="relative group overflow-hidden px-6 py-2.5 rounded-full font-body text-xs font-bold tracking-wider uppercase text-white shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-400 border border-white/10 hover:border-white/20"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(230,20%,12%))" }}>
              {/* Animated shimmer sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {/* Inner glow top edge */}
              <span className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              {/* Gold accent bottom */}
              <span className="absolute bottom-0 left-[30%] right-[30%] h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-400 text-[hsl(var(--gold))]" />
                Login
              </span>
            </button>
          </Link>

          {/* Hamburger — premium toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden relative w-[40px] h-[40px] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group/burger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90"
            aria-label="Toggle menu"
            style={{
              background: open
                ? "linear-gradient(135deg, hsl(var(--primary)), hsl(230,18%,14%))"
                : "linear-gradient(135deg, hsl(230,18%,14%), hsl(230,16%,18%))",
              boxShadow: open
                ? "0 2px 12px hsl(var(--primary) / 0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 8px rgba(198,167,94,0.04)",
              border: open ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Ambient glow */}
            <span
              className="absolute inset-0 rounded-xl transition-opacity duration-500"
              style={{
                background: open
                  ? "radial-gradient(circle at center, hsl(var(--primary) / 0.15), transparent 70%)"
                  : "radial-gradient(circle at center, hsl(var(--gold) / 0.06), transparent 70%)",
                opacity: open ? 1 : 0,
              }}
            />
            {/* Animated bars → X */}
            <div className="relative w-[18px] h-[14px] mx-auto">
              <span
                className="absolute left-0 h-[1.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: open ? 18 : 18,
                  top: open ? 6 : 0,
                  transform: open ? "rotate(45deg)" : "rotate(0)",
                  background: open ? "hsl(var(--gold))" : "hsl(var(--foreground) / 0.7)",
                }}
              />
              <span
                className="absolute left-0 top-[6px] h-[1.5px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: open ? 0 : 12,
                  opacity: open ? 0 : 1,
                  transform: open ? "translateX(8px)" : "translateX(0)",
                  background: "hsl(var(--gold) / 0.5)",
                }}
              />
              <span
                className="absolute left-0 h-[1.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: open ? 18 : 15,
                  top: open ? 6 : 12,
                  transform: open ? "rotate(-45deg)" : "rotate(0)",
                  background: open ? "hsl(var(--gold))" : "hsl(var(--foreground) / 0.5)",
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu — app-like slide-in */}
      <div className={`xl:hidden border-t border-border overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="container py-3 px-5 bg-card overflow-y-auto max-h-[80vh]">
          {/* Nav links — staggered animation */}
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link, i) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{ animationDelay: open ? `${i * 40}ms` : "0ms" }}
                  className={`px-4 py-3 text-[15px] font-body rounded-xl transition-all duration-300 flex items-center justify-between group touch-manipulation active:scale-[0.98] ${
                    open ? "animate-fade-in-up" : ""
                  } ${
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

          {/* Quick contact — thumb-friendly */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex gap-2 flex-wrap mb-3">
              {["7676272167", "7975344252"].map((num) => (
                <a key={num} href={`tel:${num}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted border border-border font-body text-sm text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-[0.97] transition-all duration-300 touch-manipulation">
                  <Phone className="w-3.5 h-3.5" /> {num}
                </a>
              ))}
            </div>
            <Link to="/login">
              <button className="relative w-full group overflow-hidden px-6 py-3.5 rounded-xl font-body text-sm font-bold text-primary-foreground active:scale-[0.97] transition-all duration-300 touch-manipulation"
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
