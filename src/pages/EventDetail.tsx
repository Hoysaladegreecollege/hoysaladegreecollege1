import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Image as ImageIcon, Tag } from "lucide-react";

function parseGallery(description: string | null): { text: string; gallery: string[] } {
  if (!description) return { text: "", gallery: [] };
  const parts = description.split("---gallery---");
  return {
    text: parts[0]?.trim() || "",
    gallery: parts[1]?.trim().split("\n").filter(Boolean) || [],
  };
}

export default function EventDetail() {
  const { eventId } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: event, isLoading } = useQuery({
    queryKey: ["public-event", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("is_active", true)
        .maybeSingle();
      return data;
    },
    enabled: !!eventId,
  });

  const parsed = useMemo(() => parseGallery(event?.description || null), [event?.description]);
  const allImages = useMemo(
    () => [event?.image_url, ...parsed.gallery].filter(Boolean) as string[],
    [event?.image_url, parsed.gallery],
  );

  useEffect(() => {
    setActiveImageIndex(0);
  }, [event?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-10 sm:py-14 space-y-5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-[340px] sm:h-[520px] w-full rounded-3xl" />
          <div className="grid sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Event Not Found" description="The requested event could not be found." canonical="/events" />
        <div className="container px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Event not found</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">This event is unavailable or no longer active.</p>
          <Link to="/events" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const showImage = allImages[activeImageIndex];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${event.title} | Hoysala Events`}
        description={parsed.text || "Event details and gallery from Hoysala Degree College."}
        canonical={`/events/${event.id}`}
      />

      <section className="py-8 sm:py-12">
        <div className="container px-4 space-y-6 sm:space-y-8">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-body font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to events
          </Link>

          <header className="space-y-3">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground leading-tight">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-xs font-semibold">
                <Tag className="w-3.5 h-3.5" /> {event.category || "General"}
              </span>
              {event.event_date && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground font-body text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
          </header>

          <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
            <article className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card min-h-[260px] sm:min-h-[520px] flex items-center justify-center">
                {showImage ? (
                  <img src={showImage} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground py-20">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <p className="font-body text-sm">No event image uploaded</p>
                  </div>
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 border border-border/60 flex items-center justify-center hover:bg-card transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 border border-border/60 flex items-center justify-center hover:bg-card transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                  {allImages.map((url, idx) => (
                    <button
                      key={`${url}-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`rounded-xl overflow-hidden border transition-all ${idx === activeImageIndex ? "border-primary shadow-md" : "border-border/40 hover:border-border"}`}
                    >
                      <img src={url} alt={`${event.title} ${idx + 1}`} className="w-full h-16 sm:h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </article>

            <aside className="bg-card border border-border/40 rounded-3xl p-6 h-fit">
              <h2 className="font-display text-lg font-bold text-foreground mb-3">Event Details</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {parsed.text || "No description available for this event yet."}
              </p>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
