import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const MAPS_LINK = "https://maps.app.goo.gl/YGNgC5ev7v4pJWve9";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-10 sm:py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="font-display text-base sm:text-lg font-bold">Hoysala Degree College</span>
            </div>
            <p className="text-[11px] sm:text-xs font-body opacity-70 leading-relaxed mb-1">
              Affiliated To Bangalore University & Approved by AICTE New Delhi
            </p>
            <p className="text-[11px] sm:text-xs font-body opacity-70">College Code: BU 26 (P21GEF0099)</p>
            <div className="flex gap-2 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300 hover:scale-110">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 font-body text-xs sm:text-sm opacity-80">
              {[
                { label: "About", path: "/about" },
                { label: "Courses", path: "/courses" },
                { label: "Admissions", path: "/admissions" },
                { label: "Committees", path: "/committees" },
                { label: "Management", path: "/management" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <Link key={l.label} to={l.path} className="hover:text-secondary transition-colors hover:translate-x-1 inline-block">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Courses - now with links */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-4">Our Courses</h3>
            <div className="flex flex-col gap-2 font-body text-xs sm:text-sm opacity-80">
              {["BCA", "B.Com Regular", "B.Com Professional", "BBA", "CA / CS Coaching"].map(c => (
                <Link key={c} to="/courses" className="hover:text-secondary transition-colors hover:translate-x-1 inline-block">{c}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 font-body text-xs sm:text-sm opacity-80">
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-start hover:text-secondary transition-colors">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123</span>
              </a>
              <div className="flex gap-2 items-center flex-wrap">
                <Phone className="w-4 h-4 shrink-0" />
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <a href="tel:7676272167" className="hover:text-secondary transition-colors">7676272167</a>
                  <a href="tel:7975344252" className="hover:text-secondary transition-colors">7975344252</a>
                  <a href="tel:8618181383" className="hover:text-secondary transition-colors">8618181383</a>
                  <a href="tel:7892508243" className="hover:text-secondary transition-colors">7892508243</a>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-secondary transition-colors text-[11px] sm:text-xs break-all">principal.hoysaladegreecollege@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 px-4 text-center text-[10px] sm:text-xs font-body opacity-60">
          © {new Date().getFullYear()} Hoysala Degree College. All rights reserved. | ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
        </div>
      </div>
    </footer>
  );
}
