import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, BookOpen, Users, Award, Heart, MapPin, Phone, Mail, Clock, GraduationCap, Shield, Globe, Briefcase, Wifi, Coffee, TrendingUp, Star, CheckCircle } from "lucide-react";
import principalImage from "@/assets/principal.jpg";

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Rigorous curriculum designed to meet industry standards and foster innovation.", color: "from-blue-500/15 to-blue-500/5", iconColor: "text-blue-600" },
  { icon: Users, title: "Holistic Development", desc: "Focus on sports, cultural activities, and life skills alongside academics.", color: "from-emerald-500/15 to-emerald-500/5", iconColor: "text-emerald-600" },
  { icon: Award, title: "Qualified Faculty", desc: "Experienced educators dedicated to student success and mentorship.", color: "from-secondary/20 to-secondary/5", iconColor: "text-secondary-foreground" },
  { icon: Heart, title: "Inclusive Environment", desc: "A welcoming campus that celebrates diversity and equal opportunity.", color: "from-rose-500/15 to-rose-500/5", iconColor: "text-rose-500" },
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
  { icon: TrendingUp, title: "90% Placement Record", desc: "Our students are placed in top companies across India.", color: "from-emerald-500/20 to-emerald-500/5" },
  { icon: Star, title: "University Rank Holders", desc: "Multiple students securing university ranks every year.", color: "from-secondary/25 to-secondary/5" },
  { icon: Award, title: "Best College Award", desc: "Recognized for academic excellence in Bengaluru Rural.", color: "from-blue-500/20 to-blue-500/5" },
  { icon: GraduationCap, title: "CA/CS Toppers", desc: "Students clearing CA/CS exams in their first attempt.", color: "from-primary/15 to-primary/5" },
];

export default function About() {
  return (
    <div className="page-enter">
      <PageHeader title="About Us" subtitle="Discover the story of Hoysala Degree College" />

      {/* About intro */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container max-w-4xl px-4 relative">
          <ScrollReveal><SectionHeading title="About Hoysala Degree College" subtitle="Building a legacy of knowledge and character" /></ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="relative mt-8">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-primary/40 to-transparent rounded-full" />
              <div className="pl-6 font-body text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base">
                <p>Hoysala Degree College, established in 2017 under Shri Shirdi Sai Educational Trust(R), is located in Nelamangala Town, Bengaluru Rural District. Affiliated to Bangalore University and approved by AICTE New Delhi, the college offers BCA, B.Com (Regular & Professional), and BBA programs.</p>
                <p>Our institution combines modern teaching methodologies with traditional values, creating an environment where students develop both professionally and personally. With experienced faculty, state-of-the-art infrastructure, and a strong focus on placements, we ensure every student is career-ready.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Facts - premium counter-style */}
      <section className="py-14 sm:py-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container px-4 relative">
          <ScrollReveal><SectionHeading title="Quick Facts" subtitle="Numbers that define our institution" /></ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {quickFacts.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 80}>
                <div className="premium-card p-4 sm:p-5 text-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="font-display text-xl sm:text-2xl font-bold text-primary group-hover:text-secondary transition-colors duration-500 relative">{f.value}</p>
                  <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider relative">{f.label}</p>
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
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/8 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-16 h-16 border-t-2 border-l-2 border-secondary/50 rounded-tl-2xl z-20" />
                <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-2 border-r-2 border-secondary/50 rounded-br-2xl z-20" />
                <img src={principalImage} alt="Principal Sri Gopal H.R" className="relative rounded-2xl shadow-2xl w-full group-hover:shadow-3xl transition-shadow duration-700 z-10" />
              </div>
              <div className="mt-6 text-center">
                <p className="font-display text-lg font-bold text-foreground">Sri Gopal H.R</p>
                <p className="font-body text-xs text-muted-foreground">M.Sc, M.Ed, TET, KSET, Ph.D</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary-foreground font-body text-xs font-bold">Principal</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="md:col-span-3">
              <SectionHeading title="Principal's Message" centered={false} />
              <div className="mt-6 bg-gradient-to-br from-primary/3 to-secondary/5 rounded-2xl p-6 border border-border/50">
                <div className="font-body text-muted-foreground leading-relaxed text-sm space-y-4 border-l-3 border-secondary pl-5 italic">
                  <p className="text-lg not-italic font-display text-foreground font-semibold">"Welcome to Hoysala Degree College"</p>
                  <p>It gives immense pleasure to welcome you to HOYSALA DEGREE COLLEGE, one of the best colleges in Nelamangala town.</p>
                  <p>Our experienced faculty, modern infrastructure, and student-centric approach ensure every student receives personalized attention and guidance.</p>
                  <p>I invite you to be part of the Hoysala family and experience excellence in education.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="container grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl px-4">
          {[
            { icon: Eye, color: "bg-primary/10", iconColor: "text-primary", title: "Our Vision", text: "To be a premier institution of higher learning, recognized for academic excellence, innovation, and producing socially responsible graduates who contribute to national development." },
            { icon: Target, color: "bg-secondary/20", iconColor: "text-secondary-foreground", title: "Our Mission", text: "To provide accessible, affordable, and quality education empowering students with knowledge, skills, and values for successful careers and meaningful lives." },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 200}>
              <div className="premium-card p-6 sm:p-8 h-full group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary/3 blur-2xl" />
                <div className={`icon-glow w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500 relative`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                <div className="mt-5 h-0.5 bg-gradient-to-r from-secondary/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="container px-4 relative">
          <ScrollReveal><SectionHeading title="Our Achievements" subtitle="Milestones that define our excellence" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {achievements.map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 100}>
                <div className="premium-card p-6 text-center group h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  <div className="icon-glow w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10">
                    <a.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-2 relative z-10">{a.title}</h4>
                  <p className="font-body text-xs text-muted-foreground relative z-10">{a.desc}</p>
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
                <div className="premium-card p-6 text-center h-full group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  <div className={`icon-glow w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-border/30 relative z-10`}>
                    <v.icon className={`w-6 h-6 ${v.iconColor}`} />
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2 relative z-10">{v.title}</h4>
                  <p className="font-body text-sm text-muted-foreground relative z-10">{v.desc}</p>
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
              <ScrollReveal key={f.title} delay={i * 70}>
                <div className="premium-card p-5 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/4 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-start gap-4">
                    <div className="icon-glow w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-400">
                      <f.icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors duration-300" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-body text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">{f.title}</h4>
                      <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
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
          <ScrollReveal><SectionHeading title="Reach Us" subtitle="We're always here to help" /></ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="premium-card p-6 sm:p-8 space-y-4">
              {[
                { icon: MapPin, text: "K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123", href: "https://maps.app.goo.gl/YGNgC5ev7v4pJWve9", external: true },
                { icon: Phone, text: "7676272167 / 7975344252 / 8618181383", href: "tel:7676272167" },
                { icon: Mail, text: "principal.hoysaladegreecollege@gmail.com", href: "mailto:principal.hoysaladegreecollege@gmail.com" },
                { icon: Clock, text: "Monday - Saturday: 9:00 AM - 5:00 PM", href: undefined },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 group hover:-translate-x-0 hover:translate-x-0.5 transition-transform duration-200">
                  <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors duration-300">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  {item.href ? (
                    <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}
                      className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200 pt-1.5">{item.text}</a>
                  ) : (
                    <p className="font-body text-sm text-muted-foreground pt-1.5">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
