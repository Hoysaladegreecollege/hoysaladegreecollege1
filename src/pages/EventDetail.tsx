import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setActiveIndex(idx);
  }, []);

  const goNext = useCallback(() => {
    if (allImages.length <= 1) return;
    goTo((activeIndex + 1) % allImages.length, 1);
  }, [activeIndex, allImages.length, goTo]);

  const goPrev = useCallback(() => {
    if (allImages.length <= 1) return;
    goTo(activeIndex === 0 ? allImages.length - 1 : activeIndex - 1, -1);
  }, [activeIndex, allImages.length, goTo]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (allImages.length <= 1) return;
    timerRef.current = setInterval(goNext, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext, allImages.length]);

  // Reset on new event
  useEffect(() => {
    setActiveIndex(0);
    setDirection(0);
  }, [event?.id]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-10 space-y-5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-[60vh] w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
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
            <ArrowLeft className="w-4 h-4" /> Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${event.title} | Hoysala Events`}
        description={parsed.text || "Event details and gallery from Hoysala Degree College."}
        canonical={`/events/${event.id}`}
      />

      {/* Back button */}
      <div className="container px-4 pt-6 pb-2">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-body font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
      </div>

      {/* Full-width image carousel */}
      <section className="relative w-full h-[55vh] sm:h-[70vh] bg-black overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={`${allImages[activeIndex]}-${activeIndex}`}
            src={allImages[activeIndex] || "/placeholder.svg"}
            alt={`${event.title} - Image ${activeIndex + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />
        </AnimatePresence>

        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Nav arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                className={`rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-7 h-2.5 bg-white"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <span className="absolute top-4 right-4 text-xs font-body font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full z-10">
            {activeIndex + 1} / {allImages.length}
          </span>
        )}
      </section>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="container px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {allImages.map((url, idx) => (
              <button
                key={`${url}-${idx}`}
                onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === activeIndex
                    ? "border-primary shadow-md scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-16 h-12 sm:w-20 sm:h-14 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Event details below images */}
      <section className="container px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto space-y-5">
          <header className="space-y-3">
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground leading-tight">
              {event.title}
            </h1>
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

          <div className="bg-card border border-border/40 rounded-2xl p-5 sm:p-7">
            <h2 className="font-display text-lg font-bold text-foreground mb-3">Event Details</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {parsed.text || "No description available for this event yet."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
