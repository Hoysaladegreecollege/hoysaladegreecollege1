import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function parseGallery(description: string | null): { text: string; gallery: string[] } {
  if (!description) return { text: "", gallery: [] };
  const parts = description.split("---gallery---");
  return {
    text: parts[0]?.trim() || "",
    gallery: parts[1]?.trim().split("\n").filter(Boolean) || [],
  };
}

// Only render thumbnails in a window around the active index for performance
const THUMB_WINDOW = 30;

export default function EventDetail() {
  const { eventId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pinchStateRef = useRef<{ initialDistance: number; initialZoom: number } | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

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
    [event?.image_url, parsed.gallery]
  );

  const goTo = useCallback(
    (idx: number, dir: number) => {
      setDirection(dir);
      setImgLoaded(false);
      setActiveIndex(idx);
    },
    []
  );

  const goNext = useCallback(() => {
    if (allImages.length <= 1) return;
    goTo((activeIndex + 1) % allImages.length, 1);
  }, [activeIndex, allImages.length, goTo]);

  const goPrev = useCallback(() => {
    if (allImages.length <= 1) return;
    goTo(activeIndex === 0 ? allImages.length - 1 : activeIndex - 1, -1);
  }, [activeIndex, allImages.length, goTo]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxZoom(1);
    pinchStateRef.current = null;
  }, []);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (allImages.length <= 1 || lightboxOpen) return;
    timerRef.current = setInterval(goNext, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext, allImages.length, lightboxOpen]);

  useEffect(() => {
    setActiveIndex(0);
    setDirection(0);
    setImgLoaded(false);
  }, [event?.id]);

  // Auto-scroll thumbnail strip - use scrollLeft for perf with many thumbs
  useEffect(() => {
    if (!thumbStripRef.current) return;
    const container = thumbStripRef.current;
    const thumbWidth = 88; // ~w-20 + gap
    const scrollTarget = activeIndex * thumbWidth - container.clientWidth / 2 + thumbWidth / 2;
    container.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, [activeIndex]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightboxIndex((p) => (p + 1) % allImages.length);
      if (e.key === "ArrowLeft") setLightboxIndex((p) => (p === 0 ? allImages.length - 1 : p - 1));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [closeLightbox, lightboxOpen, allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    setLightboxZoom(1);
    pinchStateRef.current = null;
  }, [lightboxIndex, lightboxOpen]);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxZoom(1);
    pinchStateRef.current = null;
    setLightboxOpen(true);
  }, []);

  const changeLightboxZoom = useCallback((delta: number) => {
    setLightboxZoom((prev) => Math.max(1, Math.min(4, Number((prev + delta).toFixed(2)))));
  }, []);

  const handleLightboxWheel = useCallback(
    (e: any) => {
      e.preventDefault();
      changeLightboxZoom(e.deltaY < 0 ? 0.2 : -0.2);
    },
    [changeLightboxZoom]
  );

  const handleLightboxTouchStart = useCallback(
    (e: any) => {
      if (e.touches.length !== 2) return;
      const [a, b] = e.touches;
      pinchStateRef.current = {
        initialDistance: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY),
        initialZoom: lightboxZoom,
      };
    },
    [lightboxZoom]
  );

  const handleLightboxTouchMove = useCallback((e: any) => {
    if (e.touches.length !== 2 || !pinchStateRef.current) return;
    e.preventDefault();
    const [a, b] = e.touches;
    const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    if (!pinchStateRef.current.initialDistance) return;
    const nextZoom = Math.max(
      1,
      Math.min(4, Number((pinchStateRef.current.initialZoom * (distance / pinchStateRef.current.initialDistance)).toFixed(2)))
    );
    setLightboxZoom(nextZoom);
  }, []);

  const handleLightboxTouchEnd = useCallback((e: any) => {
    if (e.touches.length < 2) pinchStateRef.current = null;
  }, []);

  // Compute visible thumbnail window
  const thumbStart = Math.max(0, activeIndex - THUMB_WINDOW);
  const thumbEnd = Math.min(allImages.length, activeIndex + THUMB_WINDOW);

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

      {/* Full-width image carousel - NO AnimatePresence for perf with 650 images */}
      <section className="relative w-full h-[55vh] sm:h-[70vh] bg-black overflow-hidden">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-[1]">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
            </div>
          )}
          <img
            key={allImages[activeIndex]}
            src={allImages[activeIndex] || "/placeholder.svg"}
            alt={`${event.title} - Image ${activeIndex + 1}`}
            className={`w-full h-full object-contain transition-opacity duration-300 cursor-pointer ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onClick={() => openLightbox(activeIndex)}
          />
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => openLightbox(activeIndex)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
          aria-label="View fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

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

        {/* Image counter */}
        {allImages.length > 1 && (
          <span className="absolute top-4 right-4 text-xs font-body font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full z-10">
            {activeIndex + 1} / {allImages.length}
          </span>
        )}
      </section>

      {/* Thumbnail strip - virtualized: only render nearby thumbs */}
      {allImages.length > 1 && (
        <div className="container px-4 py-3">
          <div
            ref={thumbStripRef}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {/* Spacer for items before window */}
            {thumbStart > 0 && <div style={{ minWidth: thumbStart * 88, flexShrink: 0 }} />}
            {allImages.slice(thumbStart, thumbEnd).map((url, i) => {
              const idx = thumbStart + i;
              return (
                <button
                  key={`thumb-${idx}`}
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
              );
            })}
            {/* Spacer for items after window */}
            {thumbEnd < allImages.length && <div style={{ minWidth: (allImages.length - thumbEnd) * 88, flexShrink: 0 }} />}
          </div>
        </div>
      )}

      {/* Event details below images */}
      <section className="container px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto space-y-5">
          <header className="space-y-3">
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground leading-tight">{event.title}</h1>
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

      {/* Fullscreen Lightbox */}
      {createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>

              {allImages.length > 1 && (
                <span className="absolute top-4 left-4 text-sm font-body font-semibold text-white/80 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full z-20">
                  {lightboxIndex + 1} / {allImages.length}
                </span>
              )}

              {/* Zoom controls */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); changeLightboxZoom(-0.2); }}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors touch-manipulation"
                >
                  −
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxZoom(1); }}
                  className="px-3 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 text-xs font-body font-semibold hover:bg-white/20 transition-colors touch-manipulation"
                >
                  {Math.round(lightboxZoom * 100)}%
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); changeLightboxZoom(0.2); }}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors touch-manipulation"
                >
                  +
                </button>
              </div>

              {/* Main lightbox image */}
              <div
                className="relative max-w-full max-h-full overflow-hidden touch-manipulation"
                onClick={(e) => e.stopPropagation()}
                onWheel={handleLightboxWheel}
                onTouchStart={handleLightboxTouchStart}
                onTouchMove={handleLightboxTouchMove}
                onTouchEnd={handleLightboxTouchEnd}
                style={{ touchAction: lightboxZoom > 1 ? "none" : "pan-y" }}
              >
                <motion.img
                  key={`lb-img-${lightboxIndex}`}
                  src={allImages[lightboxIndex]}
                  alt={`${event.title} - Fullscreen ${lightboxIndex + 1}`}
                  className="max-w-[90vw] max-h-[80vh] object-contain select-none touch-manipulation cursor-grab active:cursor-grabbing"
                  draggable={false}
                  style={{ transform: `scale(${lightboxZoom})`, transition: "transform 0.15s ease-out" }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setLightboxZoom((z) => (z === 1 ? 2 : 1));
                  }}
                  drag={lightboxZoom === 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_e, info) => {
                    if (lightboxZoom > 1 || allImages.length <= 1) return;
                    if (info.offset.x < -80) setLightboxIndex((p) => (p + 1) % allImages.length);
                    else if (info.offset.x > 80) setLightboxIndex((p) => (p === 0 ? allImages.length - 1 : p - 1));
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Lightbox nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((p) => (p === 0 ? allImages.length - 1 : p - 1));
                    }}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((p) => (p + 1) % allImages.length);
                    }}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Lightbox thumbnail strip - also virtualized */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 max-w-[90vw] overflow-x-auto pb-1">
                  {allImages
                    .slice(Math.max(0, lightboxIndex - 15), Math.min(allImages.length, lightboxIndex + 15))
                    .map((url, i) => {
                      const idx = Math.max(0, lightboxIndex - 15) + i;
                      return (
                        <button
                          key={`lb-${idx}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(idx);
                          }}
                          className={`shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                            idx === lightboxIndex ? "border-white shadow-lg scale-110" : "border-transparent opacity-50 hover:opacity-80"
                          }`}
                        >
                          <img src={url} alt={`Thumb ${idx + 1}`} className="w-14 h-10 sm:w-16 sm:h-12 object-cover" loading="lazy" />
                        </button>
                      );
                    })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
