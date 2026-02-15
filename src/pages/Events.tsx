import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Calendar, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const fallbackEvents = [
  { id: "1", title: "Annual Sports Day 2026", event_date: "2026-03-15", category: "Sports", description: "Inter-college sports competition.", image_url: "" },
  { id: "2", title: "Tech Fest – InnoVate 2026", event_date: "2026-02-28", category: "Technical", description: "Annual technical festival.", image_url: "" },
  { id: "3", title: "Cultural Night – Utsav", event_date: "2026-04-05", category: "Cultural", description: "A night of dance, music, and art.", image_url: "" },
];

const categories = ["All", "General", "Sports", "Technical", "Cultural", "Workshop", "Academic", "NSS", "Placement", "Seminar"];

export default function Events() {
  const [filter, setFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: dbEvents = [] } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("is_active", true).order("event_date", { ascending: false });
      return data || [];
    },
  });

  const events = dbEvents.length > 0 ? dbEvents : fallbackEvents;
  const filtered = filter === "All" ? events : events.filter((e: any) => e.category === filter);

  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Events & Gallery</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Events</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-background">
        <div className="container px-4">
          <SectionHeading title="College Events" subtitle="Explore our vibrant campus life" />

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`font-body text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 ${
                  filter === c ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((e: any, i: number) => (
              <ScrollReveal key={e.id} delay={i * 80}>
                <div onClick={() => setSelectedEvent(e)} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                  {e.image_url ? (
                    <img src={e.image_url} alt={e.title} className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">{e.category}</span>
                      {e.event_date && (
                        <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">{e.title}</h3>
                    {e.description && <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-3">{e.description}</p>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center font-body text-muted-foreground py-12">No events found for this category.</p>}
        </div>
      </section>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              {selectedEvent.image_url && (
                <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full rounded-xl object-cover max-h-80" />
              )}
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body font-bold px-2.5 py-1 rounded-full bg-secondary/20 text-secondary-foreground">{selectedEvent.category}</span>
                  {selectedEvent.event_date && (
                    <span className="text-sm font-body text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(selectedEvent.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
                {selectedEvent.description && (
                  <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
