import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Calendar, Image as ImageIcon, ChevronRight, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const fallbackEvents = [
  { id: "1", title: "Annual Sports Day 2026", event_date: "2026-03-15", category: "Sports", description: "Inter-college sports competition.", image_url: "" },
  { id: "2", title: "Tech Fest – InnoVate 2026", event_date: "2026-02-28", category: "Technical", description: "Annual technical festival.", image_url: "" },
  { id: "3", title: "Cultural Night – Utsav", event_date: "2026-04-05", category: "Cultural", description: "A night of dance, music, and art.", image_url: "" },
];

const categories = ["All", "General", "Sports", "Technical", "Cultural", "Workshop", "Academic", "NSS", "Placement", "Seminar"];

const CATEGORY_COLORS: Record<string, string> = {
  Sports: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
  Technical: "from-blue-500/15 to-blue-500/5 text-blue-700",
  Cultural: "from-purple-500/15 to-purple-500/5 text-purple-700",
  Workshop: "from-orange-500/15 to-orange-500/5 text-orange-700",
  Academic: "from-primary/15 to-primary/5 text-primary",
  NSS: "from-rose-500/15 to-rose-500/5 text-rose-700",
  Placement: "from-secondary/20 to-secondary/5 text-secondary-foreground",
  Seminar: "from-indigo-500/15 to-indigo-500/5 text-indigo-700",
  General: "from-muted to-muted/50 text-muted-foreground",
};

function parseGallery(description: string | null): { text: string; gallery: string[] } {
  if (!description) return { text: "", gallery: [] };
  const parts = description.split("---gallery---");
  return {
    text: parts[0]?.trim() || "",
    gallery: parts[1]?.trim().split("\n").filter(Boolean) || [],
  };
}

export default function Events() {
  const [filter, setFilter] = useState("All");

  const { data: dbEvents = [], isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("is_active", true).order("event_date", { ascending: false });
      return data || [];
    },
  });

  const events = dbEvents.length > 0 ? dbEvents : fallbackEvents;
  const filtered = filter === "All" ? events : events.filter((e: any) => e.category === filter);

  const catColor = (cat: string) => CATEGORY_COLORS[cat] || "from-muted to-muted/50 text-muted-foreground";

  return (
    <div className="page-enter">
      <SEOHead title="Events & Gallery" description="Explore college events at Hoysala Degree College – sports, cultural, technical festivals, workshops, and campus activities." canonical="/events" />
      <PageHeader title="Events & Gallery" subtitle="Explore our vibrant campus life" />

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal><SectionHeading title="College Events" subtitle="Discover what makes campus life exciting" /></ScrollReveal>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`font-body text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-300 border ${
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105 shadow-primary/20"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:bg-muted hover:scale-105"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <Skeleton className="h-52 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="flex gap-2"><Skeleton className="h-5 w-20 rounded-full" /><Skeleton className="h-5 w-24" /></div>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((e: any, i: number) => (
                <ScrollReveal key={e.id} delay={i * 60}>
                  <Link
                    to={`/events/${e.id}`}
                    className="premium-card overflow-hidden group h-full flex flex-col card-stack border-glow"
                  >
                    {e.image_url ? (
                      <div className="overflow-hidden relative h-52">
                        <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${catColor(e.category || "General")} border border-white/20 backdrop-blur-sm shadow-sm`}>
                            {e.category || "General"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-primary/5 via-secondary/8 to-primary/3 flex items-center justify-center relative overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-[0.04]"
                          style={{ backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${catColor(e.category || "General")} border border-current/10`}>
                            {e.category || "General"}
                          </span>
                        </div>
                        <ImageIcon className="w-14 h-14 text-muted-foreground/15" />
                      </div>
                    )}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        {e.event_date && (
                          <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 flex-1">{e.title}</h3>
                      {e.description && (
                        <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{parseGallery(e.description).text}</p>
                      )}
                      <div className="mt-4 flex items-center text-xs font-body font-semibold text-primary gap-1">
                        Open Event Page <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="font-display text-lg font-semibold text-muted-foreground">No events found</p>
              <p className="font-body text-sm text-muted-foreground/60 mt-1">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
