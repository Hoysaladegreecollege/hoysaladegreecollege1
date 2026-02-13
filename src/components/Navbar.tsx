import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
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
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2.5">
        <div className="container px-4">
          <p className="font-display text-sm sm:text-base font-bold tracking-wide text-center">
            ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
          </p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center mt-1 text-[10px] sm:text-xs">
            <span className="text-secondary font-semibold">✅ Recognized by Govt. of Karnataka</span>
            <a href="tel:7676272167" className="hover:text-secondary transition-colors hidden sm:inline">📞 7676272167</a>
            <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-secondary transition-colors hidden sm:inline">📧 Mail Us</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-2.5 sm:py-3 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
          </div>
          <div className="hidden min-[400px]:block">
            <span className="font-display text-base sm:text-lg font-bold text-primary leading-tight block">
              Hoysala Degree College
            </span>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground font-body tracking-wide leading-tight block">
              Affiliated To Bangalore University | BU 26
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-2.5 py-2 text-[12px] font-medium font-body rounded-lg transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-secondary bg-primary/5 font-semibold"
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden xl:block">
            <Button size="sm" className="font-body bg-primary text-primary-foreground hover:bg-navy-light rounded-xl text-xs">
              Login
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 text-foreground rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden border-t border-border bg-card animate-fade-in">
          <div className="container py-3 px-4 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 text-sm font-body rounded-lg transition-all ${
                  location.pathname === link.path
                    ? "text-secondary bg-primary/5 font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2 px-4">
              <a href="tel:7676272167" className="text-xs font-body text-muted-foreground hover:text-primary">📞 7676272167</a>
              <a href="tel:7975344252" className="text-xs font-body text-muted-foreground hover:text-primary">📞 7975344252</a>
            </div>
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full mt-2 font-body bg-primary text-primary-foreground rounded-xl">
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
