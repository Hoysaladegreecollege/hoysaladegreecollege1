import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Target, Eye, BookOpen, Users, Award, Heart, MapPin, Phone, Mail, Clock, GraduationCap, Shield, Globe } from "lucide-react";
import heroImage from "@/assets/hero-college.jpg";
import principalImage from "@/assets/principal.jpg";

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Rigorous curriculum designed to meet industry standards and foster innovation." },
  { icon: Users, title: "Holistic Development", desc: "Focus on sports, cultural activities, and life skills alongside academics." },
  { icon: Award, title: "Qualified Faculty", desc: "Experienced educators dedicated to student success and mentorship." },
  { icon: Heart, title: "Inclusive Environment", desc: "A welcoming campus that celebrates diversity and equal opportunity." },
];

const facilities = [
  { icon: GraduationCap, title: "Smart Classrooms", desc: "Modern classrooms equipped with digital projectors and audio systems." },
  { icon: BookOpen, title: "Well-Stocked Library", desc: "Thousands of books, journals, and digital resources for research." },
  { icon: Globe, title: "Computer Lab", desc: "State-of-the-art lab with latest software and high-speed internet." },
  { icon: Shield, title: "Safe Campus", desc: "CCTV surveillance and dedicated security for a safe learning environment." },
  { icon: Clock, title: "Flexible Timings", desc: "Morning & afternoon sessions to accommodate all students." },
  { icon: Users, title: "Student Clubs", desc: "NSS, Eco Club, Tech Club, Language Club, and many more." },
];

const quickFacts = [
  { label: "Established", value: "2017" },
  { label: "Affiliated To", value: "Bangalore University" },
  { label: "College Code", value: "BU 26 (P21GEF0099)" },
  { label: "Approved By", value: "AICTE, New Delhi" },
  { label: "Programs Offered", value: "BCA, B.Com, BBA" },
  { label: "Placement Rate", value: "90%" },
];

export default function About() {
  return (
    <div>
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / About</p>
        </div>
      </section>

      {/* About */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container max-w-4xl px-4">
          <ScrollReveal><SectionHeading title="About Hoysala Degree College" subtitle="Building a legacy of knowledge and character" /></ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="font-body text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base">
              <p>Hoysala Degree College, established in 2017 under Shri Shirdi Sai Educational Trust(R), is located in Nelamangala Town, Bengaluru Rural District. Affiliated to Bangalore University and approved by AICTE New Delhi, the college offers BCA, B.Com (Regular & Professional), and BBA programs.</p>
              <p>Our institution combines modern teaching methodologies with traditional values, creating an environment where students develop both professionally and personally.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-12 sm:py-16 bg-cream">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Quick Facts" /></ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {quickFacts.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 80}>
                <div className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <p className="font-display text-lg sm:text-xl font-bold text-primary">{f.value}</p>
                  <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1">{f.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl px-4">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <ScrollReveal className="md:col-span-2">
              <img src={principalImage} alt="Principal" className="rounded-2xl shadow-xl w-full" />
              <div className="mt-4 text-center">
                <p className="font-display text-lg font-bold text-foreground">Sri Gopal H.R</p>
                <p className="font-body text-sm text-muted-foreground">M.Sc, M.Ed, TET, KSET, Ph.D • Principal</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="md:col-span-3">
              <SectionHeading title="Principal's Message" centered={false} />
              <div className="font-body text-muted-foreground leading-relaxed text-sm space-y-3 border-l-4 border-secondary pl-6 italic">
                <p>It gives immense pleasure to welcome you to HOYSALA DEGREE COLLEGE, one of the best colleges in Nelamangala town.</p>
                <p>Our experienced faculty, modern infrastructure, and student-centric approach ensure every student receives personalized attention and guidance.</p>
                <p>I invite you to be part of the Hoysala family and experience excellence in education.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-cream">
        <div className="container grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl px-4">
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Eye className="w-6 h-6 text-primary" /></div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">To be a premier institution of higher learning, recognized for academic excellence, innovation, and producing socially responsible graduates.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4"><Target className="w-6 h-6 text-secondary" /></div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">To provide accessible, affordable, and quality education empowering students with knowledge, skills, and values for successful careers.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Our Core Values" subtitle="The principles that guide everything we do" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="text-center bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"><v.icon className="w-6 h-6 text-primary" /></div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h4>
                  <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Campus Facilities" subtitle="Modern infrastructure for holistic learning" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {facilities.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-body text-sm font-bold text-foreground">{f.title}</h4>
                      <p className="font-body text-xs text-muted-foreground mt-1">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl px-4">
          <ScrollReveal><SectionHeading title="Reach Us" /></ScrollReveal>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="font-body text-sm text-muted-foreground">K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123</p></div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /><p className="font-body text-sm text-muted-foreground">7676272167 / 7975344252 / 8618181383</p></div>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /><p className="font-body text-sm text-muted-foreground">principal.hoysaladegreecollege@gmail.com</p></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-primary shrink-0" /><p className="font-body text-sm text-muted-foreground">Monday - Saturday: 9:00 AM - 5:00 PM</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
