import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display text-lg font-bold">Hoysala Degree College</span>
            </div>
            <p className="text-xs font-body opacity-70 leading-relaxed mb-1">
              Affiliated To Bangalore University & Approved by AICTE New Delhi
            </p>
            <p className="text-xs font-body opacity-70">College Code: BU 26 (P21GEF0099)</p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 font-body text-sm opacity-80">
              {[
                { label: "About", path: "/about" },
                { label: "Courses", path: "/courses" },
                { label: "Admissions", path: "/admissions" },
                { label: "Committees", path: "/committees" },
                { label: "Management", path: "/management" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <Link key={l.label} to={l.path} className="hover:text-secondary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Our Courses</h3>
            <div className="flex flex-col gap-2 font-body text-sm opacity-80">
              <span>BCA</span>
              <span>B.Com Regular</span>
              <span>B.Com Professional</span>
              <span>BBA</span>
              <span>CA / CS Coaching</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 font-body text-sm opacity-80">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:7676272167" className="hover:text-secondary transition-colors">7676272167 / 7975344252</a>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:principal.hoysaladegreecollege@gmail.com" className="hover:text-secondary transition-colors text-xs">principal.hoysaladegreecollege@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 text-center text-xs font-body opacity-60">
          © {new Date().getFullYear()} Hoysala Degree College. All rights reserved. | ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)
        </div>
      </div>
    </footer>
  );
}
