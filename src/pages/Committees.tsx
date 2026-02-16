import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Globe, Briefcase, Monitor, Award, Users, Heart, Shield, BookOpen, Leaf, Scale, Sparkles, MessageSquare, AlertTriangle } from "lucide-react";

const committees = [
  { name: "Language Club", icon: Globe, desc: "Promoting linguistic skills and cultural appreciation through literary events.", color: "from-primary/10 to-primary/5" },
  { name: "Commerce Forum", icon: Briefcase, desc: "Business quizzes, seminars, and industry interactions for commerce students.", color: "from-secondary/10 to-secondary/5" },
  { name: "Management Forum", icon: Users, desc: "Case studies, leadership workshops, and management games.", color: "from-primary/10 to-secondary/5" },
  { name: "Tech Club", icon: Monitor, desc: "Hackathons, coding bootcamps, and tech workshops for BCA students.", color: "from-primary/10 to-primary/5" },
  { name: "NSS (National Service Scheme)", icon: Award, desc: "Community service, blood donation drives, and social awareness campaigns.", color: "from-secondary/10 to-secondary/5" },
  { name: "Mentoring Cell", icon: Heart, desc: "Academic and personal guidance for every student through dedicated mentors.", color: "from-primary/10 to-secondary/5" },
  { name: "Placement Cell", icon: Sparkles, desc: "Career guidance, resume building, mock interviews, and campus recruitments.", color: "from-secondary/10 to-primary/5" },
  { name: "Student Counselling Cell", icon: MessageSquare, desc: "Professional counseling support for student well-being and mental health.", color: "from-primary/10 to-primary/5" },
  { name: "Eco Club", icon: Leaf, desc: "Environmental awareness programs, tree planting, and green initiatives.", color: "from-secondary/10 to-secondary/5" },
  { name: "Anti-Ragging Cell", icon: Shield, desc: "Ensuring a safe and ragging-free campus for all students.", color: "from-primary/10 to-secondary/5" },
  { name: "Anti-Sexual Harassment Cell", icon: AlertTriangle, desc: "Providing a safe environment and addressing harassment complaints.", color: "from-primary/10 to-primary/5" },
  { name: "Women Empowerment Cell", icon: Scale, desc: "Programs promoting gender equality and women's safety.", color: "from-secondary/10 to-secondary/5" },
  { name: "Grievance & Redressal Cell", icon: BookOpen, desc: "Addressing student and staff grievances promptly and fairly.", color: "from-primary/10 to-secondary/5" },
];

export default function Committees() {
  return (
    <div className="page-enter">
      <PageHeader title="Committees & Clubs" subtitle="Driving holistic student development" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <SectionHeading title="Our Committees" subtitle="Active committees and clubs shaping well-rounded graduates" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {committees.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 60}>
                <div className="premium-card p-6 group h-full">
                  <div className={`icon-glow w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
