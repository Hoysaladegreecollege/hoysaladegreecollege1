import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Award, Calendar, ArrowRight, Star, Sparkles, Brain, ClipboardCheck, Library, MessageSquare, FlaskConical, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import InfoSlider from "@/components/InfoSlider";
import heroImage from "@/assets/hero-college.jpg";
import principalImage from "@/assets/principal.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const courses = [
  { name: "BCA", full: "Bachelor of Computer Applications", icon: "🖥️", desc: "Master programming, databases, networking and emerging technologies.", duration: "3 Years" },
  { name: "B.Com", full: "Bachelor of Commerce", icon: "📊", desc: "Build expertise in accounting, finance, taxation and business law.", duration: "3 Years" },
  { name: "BBA", full: "Bachelor of Business Administration", icon: "💼", desc: "Develop leadership, management, and entrepreneurial skills.", duration: "3 Years" },
  { name: "C.A", full: "Chartered Accountancy Coaching", icon: "📈", desc: "Exclusive coaching for CA Foundation & Intermediate aspirants.", duration: "Integrated" },
  { name: "C.S", full: "Company Secretary Coaching", icon: "⚖️", desc: "Dedicated classes for CS Foundation & Executive preparation.", duration: "Integrated" },
];

const highlights = [
  { icon: Users, label: "Experienced Faculties" },
  { icon: Star, label: "Exclusive CA, CS & CMA Classes" },
  { icon: BookOpen, label: "Add-on Courses for BCA" },
  { icon: Brain, label: "Hands-on AI & ML Workshops" },
  { icon: Sparkles, label: "Special Guest Lectures" },
  { icon: ClipboardCheck, label: "Daily Attendance SMS Updates" },
  { icon: BarChart3, label: "Monthly Internal Assessments" },
  { icon: FlaskConical, label: "Weekly Tests for CA & CS" },
  { icon: Library, label: "Sophisticated Library" },
  { icon: Award, label: "NSS Unit" },
  { icon: MessageSquare, label: "Student Counseling Cell" },
];

const testimonials = [
  { name: "Anusha C.H", course: "B.Com", text: "Hoysala Degree College gave me the best platform to prepare for CA. The faculty support is exceptional!", rating: 5 },
  { name: "Rahul M.", course: "BBA", text: "The practical exposure through internships and case studies prepared me for the real business world.", rating: 5 },
  { name: "Simran B.", course: "B.Com Professional", text: "The dedicated coaching for CS and CMA along with regular degree is a unique advantage here.", rating: 5 },
];

export default function Index() {
  const { data: liveStats } = useQuery({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      const [students, teachers, events] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      return { students: students.count || 0, faculty: teachers.count || 0, events: events.count || 0 };
    },
  });

  const { data: topStudents = [] } = useQuery({
    queryKey: ["homepage-top-students"],
    queryFn: async () => {
      const { data } = await supabase.from("top_students").select("*").eq("is_active", true).order("rank").limit(6);
      return data || [];
    },
  });

  const { data: recentNotices = [] } = useQuery({
    queryKey: ["homepage-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("title, type, created_at").eq("is_active", true).order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
  });

  const stats = [
    { label: "Students Enrolled", value: liveStats ? `${liveStats.students}+` : "—", icon: Users },
    { label: "Expert Faculty", value: liveStats ? `${liveStats.faculty}+` : "—", icon: BookOpen },
    { label: "Years of Excellence", value: "15+", icon: Award },
    { label: "Placement Rate", value: "90%", icon: Star },
  ];

  const announcements = recentNotices.length > 0
    ? recentNotices.map((n: any) => ({ date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), title: n.title, type: n.type }))
    : [
        { date: "Feb 10, 2026", title: "Admission Open for 2026-27 Academic Year", type: "Admission" },
        { date: "Feb 5, 2026", title: "Annual Sports Day – March 15, 2026", type: "Event" },
      ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Hoysala Degree College Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(217,72%,18%,0.88), hsla(217,72%,18%,0.55))" }} />
        <div className="relative z-10 container text-center text-primary-foreground">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-secondary mb-4 animate-fade-in">
            Excellence in Education
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3 animate-fade-in-up">
            Hoysala Degree College
          </h1>
          <p className="font-body text-xs md:text-sm max-w-2xl mx-auto opacity-80 mb-2 animate-fade-in-up animation-delay-200">
            Affiliated To Bangalore University & Approved by AICTE New Delhi, College Code: BU 26 (P21GEF0099)
          </p>
          <p className="font-body text-xs max-w-2xl mx-auto opacity-60 mb-8 animate-fade-in-up animation-delay-200">
            K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link to="/admissions">
              <Button size="lg" className="font-body bg-secondary text-secondary-foreground hover:bg-gold-light text-base px-8">
                Apply Now
              </Button>
            </Link>
            <Link to="/courses">
              <button className="glass-btn px-8 py-3 rounded-lg font-body text-base font-medium text-primary-foreground animate-pulse-glow">
                ✨ Explore Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Slider */}
      <InfoSlider />

      {/* Stats */}
      <section className="bg-primary py-8">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center text-primary-foreground animate-counter" style={{ animationDelay: `${i * 0.15}s` }}>
              <s.icon className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="font-display text-3xl font-bold">{s.value}</div>
              <div className="font-body text-xs opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 bg-background">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Courses We Offer" subtitle="Choose from our carefully designed undergraduate programs & professional coaching" />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {courses.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 100}>
                <div className="group bg-card rounded-xl border border-border p-5 hover-lift cursor-pointer">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h3 className="font-display text-lg font-bold text-foreground">{c.name}</h3>
                  <p className="font-body text-[11px] text-muted-foreground mt-1">{c.full}</p>
                  <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-body text-secondary font-semibold">{c.duration}</span>
                    <Link to="/courses" className="text-primary text-xs font-body font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-cream">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Why Hoysala?" subtitle="Key highlights that set us apart" />
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <ScrollReveal key={h.label} delay={i * 50}>
                <div className="flex items-center gap-3 bg-card rounded-xl border border-border p-4 hover-lift">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <h.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-body text-sm font-medium text-foreground">{h.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <img src={principalImage} alt="Principal" className="rounded-2xl shadow-xl w-full max-w-sm mx-auto" />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <SectionHeading title="Principal's Message" centered={false} />
                <blockquote className="font-body text-muted-foreground leading-relaxed text-sm italic border-l-4 border-secondary pl-6 space-y-3">
                  <p>It gives immense pleasure to welcome you to HOYSALA DEGREE COLLEGE, one of the best colleges in Nelamangala town, established in 2017 under the aegis of Shri Shirdi Sai Educational Trust(R).</p>
                  <p>Our college is affiliated to Bangalore University and offers B.Com, BBA, and BCA programs. We believe in holistic development of students through academics, co-curricular activities, and value-based education.</p>
                  <p>Our experienced faculty, modern infrastructure, and student-centric approach ensure that every student receives personalized attention and guidance to excel in their chosen field.</p>
                  <p>I invite you to be part of the Hoysala family and experience excellence in education.</p>
                </blockquote>
                <p className="mt-6 font-display text-lg font-semibold text-foreground">Sri Gopal H.R</p>
                <p className="font-body text-sm text-muted-foreground">Principal, Hoysala Degree College</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Top Students / Achievers */}
      {topStudents.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container">
            <ScrollReveal>
              <SectionHeading title="Our Top Achievers" subtitle="Students who made us proud" />
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {topStudents.map((s: any, i: number) => (
                <ScrollReveal key={s.id} delay={i * 100}>
                  <div className="bg-card border border-border rounded-xl p-5 text-center hover-lift">
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.student_name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-secondary" />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-secondary/20 flex items-center justify-center">
                        <Award className="w-8 h-8 text-secondary" />
                      </div>
                    )}
                    <h3 className="font-display text-base font-bold text-foreground">{s.student_name}</h3>
                    <p className="font-body text-xs text-secondary font-semibold">Rank #{s.rank} • {s.course}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{s.year}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Student Testimonials" subtitle="Hear from our students" />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 150}>
                <div className="glass-card rounded-xl p-6 hover-lift">
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                    <p className="font-body text-xs text-secondary">{t.course}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 bg-cream">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Latest Announcements" subtitle="Stay updated with the latest news" />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {announcements.map((a, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">{a.type}</span>
                    <span className="text-xs font-body text-muted-foreground">{a.date}</span>
                  </div>
                  <p className="font-body text-sm font-medium text-foreground">{a.title}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/notices">
              <Button variant="outline" className="font-body">View All Notices <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
          <p className="font-body text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Join Hoysala Degree College and be part of an institution that shapes leaders of tomorrow.
          </p>
          <Link to="/admissions">
            <Button size="lg" className="font-body bg-secondary text-secondary-foreground hover:bg-gold-light text-base px-10">
              Apply for Admission
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
