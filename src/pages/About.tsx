import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, BookOpen, Users, Award, Heart, MapPin, Phone, Mail, Clock, GraduationCap, Shield, Globe, Briefcase, Wifi, Coffee, TrendingUp, Star } from "lucide-react";
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
  { icon: Wifi, title: "Wi-Fi Campus", desc: "High-speed internet across the campus for research and learning." },
  { icon: Coffee, title: "Canteen", desc: "Hygienic and affordable food options available on campus." },
  { icon: Briefcase, title: "Placement Cell", desc: "Dedicated cell ensuring 90% placement rate with top companies." },
];

const quickFacts = [
  { label: "Established", value: "2017" },
  { label: "Affiliated To", value: "Bangalore University" },
  { label: "College Code", value: "BU 26" },
  { label: "Approved By", value: "AICTE" },
  { label: "Programs", value: "BCA, B.Com, BBA" },
  { label: "Placement Rate", value: "90%" },
];

const achievements = [
  { icon: TrendingUp, title: "90% Placement Record", desc: "Our students are placed in top companies across India." },
  { icon: Star, title: "University Rank Holders", desc: "Multiple students securing university ranks every year." },
  { icon: Award, title: "Best College Award", desc: "Recognized for academic excellence in Bengaluru Rural." },
  { icon: GraduationCap, title: "CA/CS Toppers", desc: "Students clearing CA/CS exams in their first attempt." },
];

export default function About() {
  return (
    <div className="page-enter">
      <PageHeader title="About Us" subtitle="Discover the story of Hoysala Degree College" />

      {/* About */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-4xl px-4">
          <ScrollReveal><SectionHeading title="About Hoysala Degree College" subtitle="Building a legacy of knowledge and character" /></ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="font-body text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base">
              <p>Hoysala Degree College, established in 2017 under Shri Shirdi Sai Educational Trust(R), is located in Nelamangala Town, Bengaluru Rural District. Affiliated to Bangalore University and approved by AICTE New Delhi, the college offers BCA, B.Com (Regular & Professional), and BBA programs.</p>
              <p>Our institution combines modern teaching methodologies with traditional values, creating an environment where students develop both professionally and personally. With experienced faculty, state-of-the-art infrastructure, and a strong focus on placements, we ensure every student is career-ready.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-14 sm:py-20 bg-cream">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Quick Facts" /></ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {quickFacts.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 80}>
                <div className="premium-card p-4 sm:p-5 text-center group">
                  <p className="font-display text-xl sm:text-2xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">{f.value}</p>
                  <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">{f.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-5xl px-4">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <ScrollReveal className="md:col-span-2">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-secondary/15 to-primary/5 rounded-3xl blur-xl" />
                <img src={principalImage} alt="Principal" className="relative rounded-2xl shadow-xl w-full" />
              </div>
              <div className="mt-5 text-center">
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
      <section className="py-16 sm:py-24 bg-cream">
        <div className="container grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl px-4">
          <ScrollReveal>
            <div className="premium-card p-6 sm:p-8 h-full group">
              <div className="icon-glow w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">To be a premier institution of higher learning, recognized for academic excellence, innovation, and producing socially responsible graduates who contribute to national development.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="premium-card p-6 sm:p-8 h-full group">
              <div className="icon-glow w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center mb-5 group-hover:bg-secondary/25 transition-colors duration-300">
                <Target className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">To provide accessible, affordable, and quality education empowering students with knowledge, skills, and values for successful careers and meaningful lives.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Our Achievements" subtitle="Milestones that define our excellence" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {achievements.map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 100}>
                <div className="premium-card p-6 text-center group h-full">
                  <div className="icon-glow w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <a.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-2">{a.title}</h4>
                  <p className="font-body text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Our Core Values" subtitle="The principles that guide everything we do" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="premium-card p-6 text-center h-full group">
                  <div className="icon-glow w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h4>
                  <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <ScrollReveal><SectionHeading title="Campus Facilities" subtitle="Modern infrastructure for holistic learning" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {facilities.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="premium-card p-5 group">
                  <div className="flex items-start gap-4">
                    <div className="icon-glow w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
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
      <section className="py-16 bg-cream">
        <div className="container max-w-3xl px-4">
          <ScrollReveal><SectionHeading title="Reach Us" /></ScrollReveal>
          <div className="premium-card p-6 sm:p-8 space-y-4">
            <a href="https://maps.app.goo.gl/YGNgC5ev7v4pJWve9" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-primary transition-colors">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123</p>
            </a>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /><p className="font-body text-sm text-muted-foreground"><a href="tel:7676272167" className="hover:text-primary transition-colors">7676272167</a> / <a href="tel:7975344252" className="hover:text-primary transition-colors">7975344252</a> / <a href="tel:8618181383" className="hover:text-primary transition-colors">8618181383</a></p></div>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /><a href="mailto:principal.hoysaladegreecollege@gmail.com" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">principal.hoysaladegreecollege@gmail.com</a></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-primary shrink-0" /><p className="font-body text-sm text-muted-foreground">Monday - Saturday: 9:00 AM - 5:00 PM</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
