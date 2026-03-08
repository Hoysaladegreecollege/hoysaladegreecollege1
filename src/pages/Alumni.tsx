import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Building, GraduationCap, Linkedin, Award, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Alumni() {
  const [filter, setFilter] = useState("All");

  const { data: alumni = [], isLoading } = useQuery({
    queryKey: ["public-alumni"],
    queryFn: async () => {
      const { data } = await supabase
        .from("alumni_stories")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const courses = ["All", ...Array.from(new Set(alumni.map((a: any) => a.course)))];
  const filteredAlumni = filter === "All" ? alumni : alumni.filter((a: any) => a.course === filter);

  return (
    <div className="page-enter bg-background min-h-screen">
      <SEOHead 
        title="Alumni Network | Hoysala Degree College" 
        description="Connect with Hoysala Degree College alumni. Read success stories and see career paths of our graduates." 
      />
      <PageHeader 
        title="Alumni Network" 
        subtitle="Celebrating the success and journey of our graduates across the globe" 
      />

      <section className="py-16 sm:py-24 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container px-4 max-w-6xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionHeading title="Success Stories" subtitle="Discover where our alumni are today" />
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Our alumni are our pride. They are leaders, innovators, and changemakers in their respective fields. 
                Explore their journeys and get inspired.
              </p>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {courses.map((c: any) => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)}
                  className={`font-body text-xs px-5 py-2.5 rounded-full transition-all duration-300 font-medium border backdrop-blur-sm ${
                    filter === c
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary"
                      : "bg-card/80 border-border/50 text-muted-foreground hover:bg-muted hover:border-primary/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredAlumni.map((person: any, i: number) => (
                <ScrollReveal key={person.id} delay={i * 100}>
                  <div className="group relative h-full flex flex-col rounded-3xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 sm:p-8 transition-all duration-500 hover:bg-card/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20 hover:-translate-y-1">
                    
                    {/* Featured Badge */}
                    {person.is_featured && (
                      <div className="absolute top-0 right-8 -translate-y-1/2">
                        <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                          <Award className="w-3 h-3" /> Featured
                        </div>
                      </div>
                    )}

                    {/* Top Section */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {person.image_url ? (
                          <img src={person.image_url} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-display font-bold text-primary/40">
                            {person.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-1">{person.name}</h3>
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md"><GraduationCap className="w-3 h-3" /> {person.course}</span>
                          <span className="bg-muted/50 px-2 py-0.5 rounded-md">Class of {person.batch_year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role & Company */}
                    <div className="mb-6 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-foreground/90 font-medium">
                        <Briefcase className="w-4 h-4 text-primary/60" />
                        {person.job_title}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Building className="w-4 h-4 text-primary/60" />
                        {person.company}
                      </div>
                    </div>

                    {/* Story Quote */}
                    <div className="relative flex-1 mb-6">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/5 -z-10 rotate-180" />
                      <p className="text-sm text-muted-foreground leading-relaxed italic pl-4 border-l-2 border-primary/20">
                        "{person.story}"
                      </p>
                    </div>

                    {/* Footer / Link */}
                    {person.linkedin_url && (
                      <div className="pt-4 border-t border-border/40 mt-auto">
                        <a 
                          href={person.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          Connect on LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {filteredAlumni.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-border/30">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-xl font-medium text-foreground mb-2">No profiles found</h3>
              <p className="text-muted-foreground text-sm">We are still updating our alumni database for this course.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
