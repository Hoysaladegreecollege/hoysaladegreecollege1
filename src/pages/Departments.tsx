import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Monitor, TrendingUp, Briefcase, Award, ChevronRight, Users, GraduationCap, BookOpen } from "lucide-react";
import PremiumStatsStrip from "@/components/PremiumStatsStrip";

const departments = [
  {
    name: "Department of Computer Applications",
    icon: Monitor,
    course: "BCA — Bachelor of Computer Applications",
    hod: "Dr. Meena Sharma",
    hodQual: "Ph.D. in Computer Science",
    desc: "Offering cutting-edge education in computer science, programming, and IT. Students learn through hands-on lab sessions, industry projects, and workshops covering AI, ML, Python, and modern web development.",
    facilities: ["Computer Lab with 60+ systems", "Internet & Wi-Fi enabled campus", "Programming contests & hackathons", "AI/ML workshop lab"],
    color: "from-blue-500/12 to-blue-500/4",
    headerGrad: "from-blue-600/15 to-primary/8",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    stat: { students: "120+", faculty: "8+", year: "2017" },
  },
  {
    name: "Department of Commerce",
    icon: TrendingUp,
    course: "BCom — Regular & Professional",
    hod: "Prof. Renuka parasad R",
    hodQual: "M.Com, Bed",
    desc: "Providing comprehensive knowledge in accounting, finance, and business operations. Our Commerce department prepares students for CA, ICWA, and MBA pathways with dedicated coaching and expert mentoring.",
    facilities: ["Dedicated commerce library", "Tally & accounting software lab", "Industry guest lectures", "CA/CS coaching sessions"],
    color: "from-secondary/12 to-secondary/4",
    headerGrad: "from-secondary/18 to-amber-500/8",
    iconBg: "bg-secondary/15",
    iconColor: "text-secondary-foreground",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    stat: { students: "200+", faculty: "10+", year: "2017" },
  },
  {
    name: "Department of Business Administration",
    icon: Briefcase,
    course: "BBA — Bachelor of Business Administration",
    hod: "Dr. Priya Nair",
    hodQual: "Ph.D. in Management",
    desc: "Focused on developing future business leaders with practical exposure through case studies, internships, and entrepreneurship programs. Students gain real-world insights through our strong corporate tie-ups.",
    facilities: ["Seminar hall for presentations", "Business simulation tools", "Corporate tie-ups for internships", "Entrepreneurship development cell"],
    color: "from-emerald-500/12 to-emerald-500/4",
    headerGrad: "from-emerald-500/15 to-primary/8",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    stat: { students: "80+", faculty: "6+", year: "2019" },
  },
];

export default function Departments() {
  return (
    <div className="page-enter">
      <SEOHead title="Departments" description="Explore departments at Hoysala Degree College – Computer Applications, Commerce, and Business Administration. Specialized faculty and modern facilities." canonical="/departments" />
      <PageHeader title="Departments" subtitle="Specialized education and skill development" />

      <PremiumStatsStrip stats={[
        { icon: BookOpen, value: "3", label: "Departments" },
        { icon: Users, value: "400+", label: "Students" },
        { icon: GraduationCap, value: "24+", label: "Faculty Members" },
        { icon: Award, value: "90%", label: "Placement Rate" },
      ]} />

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container max-w-5xl px-4 relative space-y-8">
          <ScrollReveal>
            <SectionHeading title="Our Departments" subtitle="Each department is dedicated to providing specialized education and skill development." />
          </ScrollReveal>

          {departments.map((d, i) => (
            <ScrollReveal key={d.name} delay={i * 120}>
              <div className="premium-card overflow-hidden group border-glow">
                {/* Header */}
                <div className={`relative bg-gradient-to-r ${d.headerGrad} px-6 sm:px-8 py-6 border-b border-border overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/8 rounded-full blur-3xl" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                  <div className="relative flex items-start gap-4">
                    <div className={`icon-glow w-14 h-14 rounded-2xl ${d.iconBg} border border-border/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md`}>
                      <d.icon className={`w-7 h-7 ${d.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{d.name}</h2>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">{d.course}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 font-body text-[10px] font-bold px-2.5 py-1 rounded-full border ${d.badge}`}>
                          <GraduationCap className="w-3 h-3" /> HOD: {d.hod}
                        </span>
                        <span className="font-body text-[10px] text-muted-foreground">{d.hodQual}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Students", value: d.stat.students },
                      { label: "Faculty", value: d.stat.faculty },
                      { label: "Est.", value: d.stat.year },
                    ].map((s) => (
                      <div key={s.label} className={`text-center p-3 rounded-xl bg-gradient-to-br ${d.color} border border-border/40 group-hover:border-primary/15 transition-colors duration-300`}>
                        <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="font-body text-muted-foreground leading-relaxed mb-5 text-sm">{d.desc}</p>
                  <h4 className="font-body text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-secondary" /> Key Facilities
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {d.facilities.map((f) => (
                      <div key={f} className="flex items-center gap-3 font-body text-sm text-muted-foreground p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-200 group/item border border-transparent hover:border-border/50">
                        <ChevronRight className="w-4 h-4 text-secondary shrink-0 group-hover/item:translate-x-0.5 transition-transform duration-200" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
