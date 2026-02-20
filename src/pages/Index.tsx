import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Award, Calendar, ArrowRight, Star, Sparkles, Brain, ClipboardCheck, Library, MessageSquare, FlaskConical, BarChart3, ChevronRight, ChevronLeft, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import InfoSlider from "@/components/InfoSlider";
import heroImage from "@/assets/hero-college.jpg";
import principalImage from "@/assets/principal.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";

const courses = [
{ name: "BCA", full: "Bachelor of Computer Applications", icon: "🖥️", desc: "Master programming, databases, networking and emerging technologies.", duration: "3 Years" },
{ name: "B.Com Regular", full: "Bachelor of Commerce", icon: "📊", desc: "Build expertise in accounting, finance, taxation and business law.", duration: "3 Years" },
{ name: "B.Com Professional", full: "Commerce with CA/CS/CMA", icon: "📈", desc: "Professional coaching integrated with commerce degree.", duration: "3 Years" },
{ name: "BBA", full: "Bachelor of Business Administration", icon: "💼", desc: "Develop leadership, management, and entrepreneurial skills.", duration: "3 Years" },
{ name: "CA / CS", full: "Chartered Accountancy & Company Secretary", icon: "⚖️", desc: "Exclusive coaching for CA & CS Foundation aspirants.", duration: "Integrated" }];


const highlights = [
{ icon: Users, label: "Experienced Faculties", desc: "Industry-trained professors" },
{ icon: Star, label: "CA, CS & CMA Classes", desc: "Exclusive coaching sessions" },
{ icon: BookOpen, label: "Add-on Courses for BCA", desc: "AI, ML, Python & more" },
{ icon: Brain, label: "AI & ML Workshops", desc: "Hands-on practical training" },
{ icon: Sparkles, label: "Special Guest Lectures", desc: "Industry expert sessions" },
{ icon: ClipboardCheck, label: "Daily Attendance SMS", desc: "Real-time parent updates" },
{ icon: BarChart3, label: "Monthly Internals", desc: "Regular assessments" },
{ icon: FlaskConical, label: "Weekly CA/CS Tests", desc: "Consistent preparation" },
{ icon: Library, label: "Sophisticated Library", desc: "Vast resource collection" },
{ icon: Award, label: "NSS Unit", desc: "Social service opportunities" },
{ icon: MessageSquare, label: "Student Counseling", desc: "Personal guidance cell" },
{ icon: Calendar, label: "Placement Cell", desc: "Career & job support" }];


const testimonials = [
{ name: "Anusha C.H", course: "B.Com 2022-25", text: "Hoysala Degree College gave me the best platform to prepare for CA. The faculty support is exceptional! Scored 98.14%.", rating: 5 },
{ name: "Rahul M.", course: "BBA 2023-26", text: "The practical exposure through internships and case studies prepared me for the real business world. Amazing college!", rating: 5 },
{ name: "Simran B.", course: "B.Com 2022-25", text: "The dedicated coaching for CS and CMA along with regular degree is a unique advantage. Scored 94.14%!", rating: 5 },
{ name: "Priya K.", course: "BCA 2023-26", text: "The AI and ML workshops along with Python programming gave me an edge in the tech industry. Best decision to join Hoysala!", rating: 5 },
{ name: "Kiran R.", course: "B.Com Professional", text: "CA coaching integrated with B.Com is a game changer. The faculty goes above and beyond to help students succeed.", rating: 5 },
{ name: "Meera S.", course: "BBA 2024-27", text: "The placement cell helped me land an internship in my 2nd year itself. The exposure here is unmatched!", rating: 4 }];


// Animated counter hook
function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function AnimatedStat({ value, label, icon: Icon, suffix = "" }: {value: number;label: string;icon: any;suffix?: string;}) {
  const { count, ref } = useAnimatedCounter(value);
  return (
    <div ref={ref} className="text-center text-primary-foreground group cursor-default">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-foreground/8 border border-primary-foreground/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 group-hover:border-secondary/30 transition-all duration-500">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">{count}{suffix}</div>
      <div className="font-body text-[10px] sm:text-xs opacity-50 mt-2 tracking-wider uppercase">{label}</div>
    </div>);

}

export default function Index() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    testimonialRef.current = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
    }, 5000);
    return () => {if (testimonialRef.current) clearInterval(testimonialRef.current);};
  }, []);

  const { data: liveStats } = useQuery({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      const [students, teachers, events] = await Promise.all([
      supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true)]
      );
      return { students: students.count || 0, faculty: teachers.count || 0, events: events.count || 0 };
    }
  });

  const { data: topStudents = [] } = useQuery({
    queryKey: ["homepage-top-students"],
    queryFn: async () => {
      const { data } = await supabase.from("top_students").select("*").eq("is_active", true).order("rank").limit(6);
      return data || [];
    }
  });

  const { data: recentNotices = [] } = useQuery({
    queryKey: ["homepage-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("title, type, created_at").eq("is_active", true).order("created_at", { ascending: false }).limit(4);
      return data || [];
    }
  });

  const stats = [
  { label: "Students Enrolled", value: liveStats?.students || 250, icon: Users, suffix: "+" },
  { label: "Expert Faculty", value: liveStats?.faculty || 25, icon: BookOpen, suffix: "+" },
  { label: "Years of Excellence", value: 15, icon: Award, suffix: "+" },
  { label: "Placement Rate", value: 90, icon: Star, suffix: "%" }];


  const announcements = recentNotices.length > 0 ?
  recentNotices.map((n: any) => ({ date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), title: n.title, type: n.type })) :
  [
  { date: "Feb 10, 2026", title: "Admission Open for 2026-27 Academic Year", type: "Admission" },
  { date: "Feb 5, 2026", title: "Annual Sports Day – March 15, 2026", type: "Event" }];


  const totalSlides = Math.ceil(testimonials.length / 2);
  const currentTestimonials = testimonials.slice(testimonialIndex * 2, testimonialIndex * 2 + 2);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Hoysala Degree College Campus" className="absolute inset-0 w-full h-full object-cover scale-110 animate-hero-float" style={{ animationDuration: "20s" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(217,72%,8%,0.94), hsla(217,72%,15%,0.78), hsla(217,72%,22%,0.55))" }} />

        {/* Floating ambient orbs */}
        <div className="absolute top-16 left-[8%] w-40 h-40 rounded-full bg-secondary/6 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-16 right-[8%] w-56 h-56 rounded-full bg-secondary/4 blur-3xl animate-float animation-delay-400 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/3 blur-[150px] pointer-events-none" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />

        <div className="relative z-10 container text-center text-primary-foreground px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 mb-6 animate-fade-in backdrop-blur-sm shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-secondary animate-sparkle" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-secondary font-bold">Excellence in Education</span>
            <Sparkles className="w-3.5 h-3.5 text-secondary animate-sparkle animation-delay-300" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-5 animate-slide-up">
            Hoysala Degree<br className="hidden sm:block" />
            <span className="text-gradient bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(42,87%,70%), hsl(42,87%,55%), hsl(38,92%,48%))" }}> College</span>
          </h1>

          <p className="font-body text-xs sm:text-sm max-w-2xl mx-auto opacity-65 mb-1.5 animate-fade-in-up animation-delay-300 leading-relaxed">
            Affiliated To Bangalore University & Approved by AICTE New Delhi
          </p>
          <p className="font-body text-[11px] sm:text-xs max-w-xl mx-auto opacity-35 mb-8 animate-fade-in-up animation-delay-400">
            College Code: BU 26 • K.R.P. Arcade, Nelamangala Town, Bengaluru Rural Dist. - 562 123
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-500">
            <Link to="/admissions">
              <button className="relative group w-full sm:w-auto overflow-hidden px-8 sm:px-10 py-4 rounded-2xl font-body text-sm sm:text-base font-bold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-100"
              style={{ background: "linear-gradient(135deg, hsl(42,87%,52%), hsl(38,92%,44%), hsl(42,87%,60%))", boxShadow: "0 8px 40px hsla(42,87%,52%,0.45), 0 2px 0 rgba(255,255,255,0.15) inset" }}>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </Link>
            <Link to="/courses">
              <button className="relative group w-full sm:w-auto overflow-hidden px-8 sm:px-10 py-4 rounded-2xl font-body text-sm sm:text-base font-bold text-white transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-100"
              style={{ background: "rgba(255,255,255,0.09)", border: "1.5px solid rgba(255,255,255,0.22)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.18) inset" }}>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/12 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  <GraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Explore Courses
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 animate-float">
            


          </div>
        </div>
      </section>

      <InfoSlider />

      {/* Stats with Animated Counters */}
      <section className="bg-primary py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-navy-dark opacity-50" />
        <div className="relative container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-4">
          {stats.map((s, i) =>
          <AnimatedStat key={i} value={s.value} label={s.label} icon={s.icon} suffix={s.suffix} />
          )}
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <ScrollReveal>
            <SectionHeading title="Courses We Offer" subtitle="Choose from our carefully designed undergraduate programs & professional coaching" />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {courses.map((c, i) =>
            <ScrollReveal key={c.name} delay={i * 80}>
                <Link to="/courses">
                  <div className="premium-card p-5 sm:p-6 cursor-pointer h-full group">
                    <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">{c.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                    <p className="font-body text-[11px] text-muted-foreground mt-1">{c.full}</p>
                    <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-body text-secondary font-bold bg-secondary/10 px-2 py-1 rounded-full">{c.duration}</span>
                      <span className="text-primary text-xs font-body font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="container px-4">
          <ScrollReveal>
            <SectionHeading title="Why Hoysala?" subtitle="Key highlights that set us apart from the rest" />
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {highlights.map((h, i) =>
            <ScrollReveal key={h.label} delay={i * 60}>
                <div className="premium-card p-4 sm:p-5 cursor-default group">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="icon-glow w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
                      <h.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:text-secondary transition-colors duration-300" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-body text-xs sm:text-sm font-bold text-foreground block">{h.label}</span>
                      <span className="font-body text-[10px] sm:text-xs text-muted-foreground mt-0.5 block">{h.desc}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/15 to-primary/5 rounded-3xl blur-2xl" />
                <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-secondary/30 rounded-tl-3xl" />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-secondary/30 rounded-br-3xl" />
                <img alt="Principal" className="relative rounded-2xl shadow-2xl w-full max-w-sm mx-auto" src="/lovable-uploads/bacc5b2d-3f25-473a-a2ee-a0d75a0cb7e3.png" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <SectionHeading title="Principal's Message" centered={false} />
                <blockquote className="font-body text-muted-foreground leading-relaxed text-sm italic border-l-4 border-secondary pl-5 space-y-3">
                  <p>It gives immense pleasure to welcome you to HOYSALA DEGREE COLLEGE, one of the best colleges in Nelamangala town, established in 2017 under the aegis of Shri Shirdi Sai Educational Trust(R).</p>
                  <p>Our college is affiliated to Bangalore University and offers B.Com, BBA, and BCA programs. We believe in holistic development of students through academics, co-curricular activities, and value-based education.</p>
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-1.5 h-12 bg-gradient-to-b from-secondary to-secondary/30 rounded-full" />
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">Sri Gopal H.R</p>
                    <p className="font-body text-xs text-muted-foreground">M.Sc, M.Ed, TET, KSET, Ph.D • Principal</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Top Students / Achievers */}
      {topStudents.length > 0 &&
      <section className="py-16 sm:py-24 bg-cream">
          <div className="container px-4">
            <ScrollReveal>
              <SectionHeading title="Our Top Achievers" subtitle="Students who made us proud" />
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {topStudents.map((s: any, i: number) =>
            <ScrollReveal key={s.id} delay={i * 100}>
                  <div className="premium-card p-6 text-center group">
                    {s.photo_url ?
                <img src={s.photo_url} alt={s.student_name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-secondary/40 shadow-lg group-hover:scale-110 group-hover:border-secondary transition-all duration-300" /> :

                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-8 h-8 text-secondary" />
                      </div>
                }
                    <h3 className="font-display text-base font-bold text-foreground">{s.student_name}</h3>
                    <p className="font-body text-xs text-secondary font-bold mt-1">Rank #{s.rank} • {s.course}</p>
                    <p className="font-body text-[11px] text-muted-foreground mt-1">{s.year}</p>
                  </div>
                </ScrollReveal>
            )}
            </div>
          </div>
        </section>
      }

      {/* Testimonials - 1 row, 2 columns per slide */}
      <section className="py-16 sm:py-24 bg-background overflow-hidden">
        <div className="container px-4">
          <ScrollReveal>
            <SectionHeading title="What Our Students Say" subtitle="Hear from the Hoysala family" />
          </ScrollReveal>
          <div className="relative max-w-4xl mx-auto">
            <button
              onClick={() => setTestimonialIndex((prev) => prev === 0 ? totalSlides - 1 : prev - 1)}
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border shadow-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:border-primary transition-all duration-300">

              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % totalSlides)}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border shadow-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:border-primary transition-all duration-300">

              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 px-6 sm:px-10">
              {currentTestimonials.map((t, i) =>
              <div key={`${testimonialIndex}-${i}`} className="premium-card p-6 sm:p-8 animate-fade-in h-full flex flex-col relative">
                  <Quote className="w-8 h-8 text-secondary/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) =>
                  <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                  )}
                  </div>
                  <p className="font-body text-sm text-muted-foreground italic leading-relaxed flex-1">"{t.text}"</p>
                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm font-bold text-primary">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                      <p className="font-body text-xs text-secondary font-semibold">{t.course}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, i) =>
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === testimonialIndex ? "bg-primary w-8 h-2.5" : "bg-border w-2.5 h-2.5 hover:bg-muted-foreground"}`} />

              )}
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="container px-4">
          <ScrollReveal>
            <SectionHeading title="Latest Announcements" subtitle="Stay updated with the latest news" />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {announcements.map((a, i) =>
            <ScrollReveal key={i} delay={i * 100}>
                <div className="premium-card p-5 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary-foreground">{a.type}</span>
                    <span className="text-xs font-body text-muted-foreground">{a.date}</span>
                  </div>
                  <p className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">{a.title}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/notices">
              <Button variant="outline" className="font-body rounded-xl hover:shadow-md transition-all">View All Notices <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 page-header">
        <div className="relative z-10 container text-center px-4">
          <ScrollReveal>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="font-body text-primary-foreground/50 mb-8 max-w-xl mx-auto text-sm sm:text-base">
              Join Hoysala Degree College and be part of an institution that shapes leaders of tomorrow.
            </p>
            <Link to="/admissions">
              <Button size="lg" className="font-body bg-secondary text-secondary-foreground hover:bg-gold-light text-sm sm:text-base px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all rounded-xl">
                Apply for Admission <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>);

}