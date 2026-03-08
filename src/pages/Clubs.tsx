import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Users, Code, BookOpen, Music, Camera, ChevronRight, Sparkles } from "lucide-react";

const clubs = [
  {
    id: "tech",
    name: "Tech Innovators Club",
    icon: Code,
    category: "Technology",
    members: 120,
    desc: "A community for coding enthusiasts. We host hackathons, tech talks, and build open-source projects.",
    gradient: "from-blue-500/20 to-purple-500/20",
    color: "text-blue-500"
  },
  {
    id: "commerce",
    name: "Finance & Commerce Society",
    icon: BookOpen,
    category: "Business",
    members: 85,
    desc: "Discussing market trends, organizing mock stock exchanges, and learning from industry experts.",
    gradient: "from-green-500/20 to-emerald-500/20",
    color: "text-emerald-500"
  },
  {
    id: "arts",
    name: "Cultural & Arts Forum",
    icon: Music,
    category: "Arts",
    members: 150,
    desc: "Celebrating diversity through dance, music, theater, and fine arts. Organizers of the annual fest.",
    gradient: "from-pink-500/20 to-rose-500/20",
    color: "text-pink-500"
  },
  {
    id: "media",
    name: "Photography & Media Club",
    icon: Camera,
    category: "Creative",
    members: 65,
    desc: "Capturing campus life. We run photography workshops, exhibitions, and manage the college magazine.",
    gradient: "from-orange-500/20 to-amber-500/20",
    color: "text-orange-500"
  }
];

export default function Clubs() {
  return (
    <div className="page-enter bg-background min-h-screen">
      <SEOHead 
        title="Student Clubs & Societies | Hoysala Degree College" 
        description="Join student clubs at Hoysala Degree College. Explore tech, cultural, sports, and academic societies." 
      />
      <PageHeader 
        title="Student Clubs" 
        subtitle="Discover your passion, develop skills, and build lifelong friendships" 
      />

      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container px-4 max-w-6xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionHeading title="Active Societies" subtitle="Find where you belong" />
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Education goes beyond the classroom. Our student-led clubs provide platforms to explore interests, 
                develop leadership skills, and create memorable college experiences.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {clubs.map((club, i) => (
              <ScrollReveal key={club.id} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm p-8 transition-all duration-500 hover:bg-card/80 hover:shadow-xl hover:-translate-y-1">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${club.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-background shadow-inner border border-border/50 ${club.color} group-hover:scale-110 transition-transform duration-500`}>
                        <club.icon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50">
                        <Users className="w-3.5 h-3.5" /> {club.members}+ Members
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{club.name}</h3>
                    <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-4">{club.category}</p>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-8">
                      {club.desc}
                    </p>

                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors w-fit group/btn mt-auto">
                      Learn More & Join
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="mt-16 sm:mt-24 relative rounded-3xl overflow-hidden bg-primary/5 border border-primary/20 p-8 sm:p-12 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary),0.1),transparent_50%)]" />
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Want to start a new club?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-sm sm:text-base">
                Have a unique idea? We encourage students to take initiative. Gather 10 interested students and a faculty advisor to register a new student society.
              </p>
              <button className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Submit Proposal
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
