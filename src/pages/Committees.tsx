import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Globe, Briefcase, Monitor, Award, Users, Heart, Shield, BookOpen, Leaf, Scale, Sparkles, MessageSquare, AlertTriangle, UserX } from "lucide-react";

const committees = [
  { name: "Language Club", icon: Globe, desc: "Promoting linguistic skills and cultural appreciation through literary events." },
  { name: "Commerce Forum", icon: Briefcase, desc: "Business quizzes, seminars, and industry interactions for commerce students." },
  { name: "Management Forum", icon: Users, desc: "Case studies, leadership workshops, and management games." },
  { name: "Tech Club", icon: Monitor, desc: "Hackathons, coding bootcamps, and tech workshops for BCA students." },
  { name: "NSS (National Service Scheme)", icon: Award, desc: "Community service, blood donation drives, and social awareness campaigns." },
  { name: "Mentoring Cell", icon: Heart, desc: "Academic and personal guidance for every student through dedicated mentors." },
  { name: "Placement Cell", icon: Sparkles, desc: "Career guidance, resume building, mock interviews, and campus recruitments." },
  { name: "Student Counselling Cell", icon: MessageSquare, desc: "Professional counseling support for student well-being and mental health." },
  { name: "Eco Club", icon: Leaf, desc: "Environmental awareness programs, tree planting, and green initiatives." },
  { name: "Anti-Ragging Cell", icon: Shield, desc: "Ensuring a safe and ragging-free campus for all students." },
  { name: "Anti-Sexual Harassment Cell", icon: AlertTriangle, desc: "Providing a safe environment and addressing harassment complaints." },
  { name: "Women Empowerment Cell", icon: Scale, desc: "Programs promoting gender equality and women's safety." },
  { name: "Grievance & Redressal Cell", icon: BookOpen, desc: "Addressing student and staff grievances promptly and fairly." },
];

export default function Committees() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Committees & Clubs</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Committees</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="Our Committees" subtitle="Active committees and clubs driving holistic student development" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {committees.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 60}>
                <div className="bg-card border border-border rounded-xl p-6 hover-lift group transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">{c.name}</h3>
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
