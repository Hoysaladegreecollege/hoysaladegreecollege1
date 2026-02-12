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
            <p className="text-sm font-body opacity-80 leading-relaxed">
              Committed to excellence in education, fostering innovation, and empowering students to achieve their full potential.
            </p>
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
              {["About", "Courses", "Admissions", "Departments", "Contact"].map((l) => (
                <Link key={l} to={`/${l.toLowerCase()}`} className="hover:text-secondary transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Our Courses</h3>
            <div className="flex flex-col gap-2 font-body text-sm opacity-80">
              <span>Bachelor of Computer Applications (BCA)</span>
              <span>Bachelor of Commerce (BCom)</span>
              <span>Bachelor of Business Administration (BBA)</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 font-body text-sm opacity-80">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Nelamangala, Bangalore, Karnataka – 562123</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 80 XXXX XXXX</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@hoysalacollege.edu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 text-center text-xs font-body opacity-60">
          © {new Date().getFullYear()} Hoysala Degree College. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
