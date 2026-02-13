import { useState } from "react";
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
  { label: "Events & Gallery", path: "/events" },
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
      <div className="bg-primary text-primary-foreground text-xs py-2">
        <div className="container flex flex-col items-center gap-1">
          <span className="font-display text-sm font-bold tracking-wide text-center w-full">ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-secondary font-semibold">✅ Recognized by Government of Karnataka</span>
            <a href="tel:7676272167" className="hover:text-secondary transition-colors">📞 7676272167</a>
            <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-secondary transition-colors">📧 Mail Us</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-primary leading-tight block">
              Hoysala Degree College
            </span>
            <span className="text-[9px] text-muted-foreground font-body tracking-wide leading-tight block">
              Affiliated To Bangalore University | College Code: BU 26
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-2.5 py-2 text-[13px] font-medium font-body rounded-md transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-secondary bg-primary/5"
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login">
            <Button size="sm" className="font-body bg-primary text-primary-foreground hover:bg-navy-light">
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 text-sm font-body rounded-md ${
                  location.pathname === link.path
                    ? "text-secondary bg-primary/5 font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full mt-2 font-body bg-primary text-primary-foreground">
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
