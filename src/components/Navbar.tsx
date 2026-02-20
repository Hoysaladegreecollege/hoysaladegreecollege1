import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Admissions", path: "/admissions" },
  { label: "Departments", path: "/departments" },
  { label: "Faculty", path: "/faculty" },
  { label: "Events", path: "/events" },
  { label: "Notices", path: "/notices" },
  { label: "Achievements", path: "/achievements" },
  { label: "Committees", path: "/committees" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-card/98 backdrop-blur-xl shadow-lg border-b border-border" : "bg-card/95 backdrop-blur-md border-b border-border/50"}`}>


      {/* Top bar */}
      <div className="bg-gradient-to-r from-primary via-primary to-navy-dark text-primary-foreground py-2">
        <div className="container px-4">
          <p className="font-display text-xs sm:text-sm font-bold tracking-wide text-center">
            ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
          </p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center mt-0.5 text-[10px] sm:text-xs">
            <span className="text-secondary font-semibold">✅ Recognized by Govt. of Karnataka</span>
            <a href="tel:7676272167" className="hover:text-secondary transition-colors hidden sm:inline-flex items-center gap-1">📞 7676272167</a>
            <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-secondary transition-colors hidden sm:inline-flex items-center gap-1">📧 Mail Us</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-2 sm:py-2.5 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-navy-dark flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
          </div>
          <div>
            <span className="font-display text-sm sm:text-lg font-bold leading-tight block group-hover:text-primary transition-all duration-300 text-foreground contrast-more:text-foreground">
              Hoysala Degree College
            </span>
            <span className="text-[8px] sm:text-[9px] font-body tracking-wide leading-tight block text-muted-foreground">
              Affiliated To Bangalore University | BU 26
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2.5 py-2 text-[12px] font-medium font-body rounded-lg transition-all duration-300 ${
                  active
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-secondary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden xl:block">
            <Button size="sm" className="font-body bg-gradient-to-r from-primary to-navy-dark text-primary-foreground hover:from-navy-dark hover:to-primary rounded-xl text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 btn-premium">
              Login
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 rounded-xl hover:bg-primary/5 transition-all duration-300 text-foreground"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu className={`w-5 h-5 absolute text-foreground transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
              <X className={`w-5 h-5 absolute text-foreground transition-all duration-300 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu - enhanced */}
      <div className={`xl:hidden border-t border-border overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="container py-3 px-4 flex flex-col gap-0.5 bg-card stagger-children">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2.5 text-sm font-body rounded-xl transition-all duration-300 flex items-center justify-between ${
                location.pathname === link.path
                  ? "text-primary bg-primary/5 font-semibold border-l-2 border-secondary"
                  : "text-foreground hover:bg-muted hover:translate-x-1"
              }`}
            >
              {link.label}
              {location.pathname === link.path && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 px-4">
            <a href="tel:7676272167" className="text-xs font-body text-muted-foreground hover:text-primary transition-colors">📞 7676272167</a>
            <a href="tel:7975344252" className="text-xs font-body text-muted-foreground hover:text-primary transition-colors">📞 7975344252</a>
          </div>
          <Link to="/login">
            <Button size="sm" className="w-full mt-2 font-body bg-gradient-to-r from-primary to-navy-dark text-primary-foreground rounded-xl btn-premium">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
