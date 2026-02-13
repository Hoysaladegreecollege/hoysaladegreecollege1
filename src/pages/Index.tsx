import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Award, Calendar, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import heroImage from "@/assets/hero-college.jpg";
import principalImage from "@/assets/principal.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const courses = [
  { name: "BCA", full: "Bachelor of Computer Applications", icon: "🖥️", desc: "Master programming, databases, networking and emerging technologies.", duration: "3 Years" },
  { name: "BCom", full: "Bachelor of Commerce", icon: "📊", desc: "Build expertise in accounting, finance, taxation and business law.", duration: "3 Years" },
  { name: "BBA", full: "Bachelor of Business Administration", icon: "💼", desc: "Develop leadership, management, and entrepreneurial skills.", duration: "3 Years" },
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
      return {
        students: students.count || 0,
        faculty: teachers.count || 0,
        events: events.count || 0,
      };
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
    ? recentNotices.map((n: any) => ({
        date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        title: n.title,
        type: n.type,
      }))
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
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            Hoysala Degree College
          </h1>
          <p className="font-body text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8 animate-fade-in-up animation-delay-200">
            Empowering minds, shaping futures. Join a legacy of academic excellence in the heart of Bangalore.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link to="/admissions">
              <Button size="lg" className="font-body bg-secondary text-secondary-foreground hover:bg-gold-light text-base px-8">
                Apply Now
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="font-body border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
          <SectionHeading title="Courses We Offer" subtitle="Choose from our carefully designed undergraduate programs" />
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c.name} className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="font-display text-xl font-bold text-foreground">{c.name}</h3>
                <p className="font-body text-xs text-muted-foreground mt-1">{c.full}</p>
                <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">{c.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-body text-secondary font-semibold">Duration: {c.duration}</span>
                  <Link to="/courses" className="text-primary text-sm font-body font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-cream">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src={principalImage} alt="Principal" className="rounded-2xl shadow-xl w-full max-w-sm mx-auto" />
            </div>
            <div>
              <SectionHeading title="Principal's Message" centered={false} />
              <blockquote className="font-body text-muted-foreground leading-relaxed text-base italic border-l-4 border-secondary pl-6">
                "At Hoysala Degree College, we believe in nurturing not just academic excellence, but character, creativity and critical thinking. Our dedicated faculty and modern facilities create an environment where every student can thrive and achieve their dreams."
              </blockquote>
              <p className="mt-6 font-display text-lg font-semibold text-foreground">Dr. Rajesh Kumar</p>
              <p className="font-body text-sm text-muted-foreground">Principal, Hoysala Degree College</p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="Latest Announcements" subtitle="Stay updated with the latest news and notifications" />
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {announcements.map((a, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">{a.type}</span>
                  <span className="text-xs font-body text-muted-foreground">{a.date}</span>
                </div>
                <p className="font-body text-sm font-medium text-foreground">{a.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/notices">
              <Button variant="outline" className="font-body">
                View All Notices <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
