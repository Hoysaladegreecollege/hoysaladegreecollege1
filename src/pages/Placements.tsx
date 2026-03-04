import { TrendingUp, Users, Building2, Award, GraduationCap, Target, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const stats = [
  { icon: Users, label: "Students Placed", value: "500+", color: "text-blue-400" },
  { icon: Building2, label: "Recruiting Partners", value: "50+", color: "text-emerald-400" },
  { icon: Award, label: "Highest Package", value: "₹6 LPA", color: "text-amber-400" },
  { icon: TrendingUp, label: "Placement Rate", value: "85%", color: "text-purple-400" },
];

const features = [
  { icon: Target, title: "Career Counselling", desc: "Personalized career guidance sessions with industry experts to help students identify their strengths and career paths." },
  { icon: GraduationCap, title: "Skill Development", desc: "Workshops on communication, aptitude, technical skills, and interview preparation throughout the academic year." },
  { icon: Building2, title: "Industry Connect", desc: "Regular industry visits, guest lectures, and internship opportunities with leading organizations." },
  { icon: Star, title: "Mock Interviews", desc: "Practice sessions with HR professionals to build confidence and improve interview performance." },
];

export default function Placements() {
  return (
    <>
      <SEOHead title="Placements | Hoysala Degree College" description="Discover placement opportunities and career support at Hoysala Degree College." />

      <div className="min-h-screen py-16 sm:py-24">
        <div className="container px-4 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Career Support</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4">
              Placements & <span className="text-primary">Careers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Our dedicated placement cell ensures every student is industry-ready with comprehensive training, mentoring, and placement drives.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group relative rounded-3xl border border-border/30 bg-card/60 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10">
                    <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-500`} strokeWidth={1.5} />
                    <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group relative rounded-3xl border border-border/30 bg-card/60 backdrop-blur-sm p-6 sm:p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative z-10 flex gap-5">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
