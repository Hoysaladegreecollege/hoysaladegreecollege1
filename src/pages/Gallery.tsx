import { useState, useEffect, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import galleryCampus from "@/assets/gallery-campus.jpg";
import galleryLab from "@/assets/gallery-lab.jpg";
import galleryLibrary from "@/assets/gallery-library.jpg";
import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryEvents from "@/assets/gallery-events.jpg";
import gallerySports from "@/assets/gallery-sports.jpg";

const fallbackImages = [
  { id: "f1", title: "Campus Building", category: "Campus", image_url: galleryCampus },
  { id: "f2", title: "Computer Lab", category: "Facilities", image_url: galleryLab },
  { id: "f3", title: "Library", category: "Facilities", image_url: galleryLibrary },
  { id: "f4", title: "Classroom", category: "Academics", image_url: galleryClassroom },
  { id: "f5", title: "Annual Day", category: "Events", image_url: galleryEvents },
  { id: "f6", title: "Sports Ground", category: "Sports", image_url: gallerySports },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const { data: dbImages = [], isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").eq("is_active", true).order("sort_order").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const images = dbImages.length > 0 ? dbImages : fallbackImages;
  const categories = ["All", ...Array.from(new Set(images.map((img: any) => img.category)))];
  const filtered = filter === "All" ? images : images.filter((img: any) => img.category === filter);

  const openLightbox = useCallback((index: number) => {
    setLightboxIdx(index);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow");
  }, []);

  // Cleanup on unmount to ensure scroll is always restored
  useEffect(() => {
    return () => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, []);

  const goNext = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  }, [lightboxIdx, filtered.length]);

  const goPrev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  }, [lightboxIdx, filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, closeLightbox, goNext, goPrev]);

  return (
    <div className="page-enter">
      <SEOHead title="Campus Gallery" description="Explore Hoysala Degree College campus through photos – classrooms, labs, library, sports, events, and campus life." canonical="/gallery" />
      <PageHeader title="Campus Gallery" subtitle="Explore our world-class facilities and campus life through photos" />

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Photo Gallery" subtitle="A glimpse into life at Hoysala Degree College" />
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((c: any) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`font-body text-xs px-4 py-2 rounded-full transition-all duration-300 font-semibold border ${
                    filter === c
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary"
                      : "bg-card border-border text-muted-foreground hover:bg-muted hover:scale-105 hover:border-primary/30"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filtered.map((img: any, i: number) => (
                <ScrollReveal key={img.id} delay={i * 60}>
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-2xl border border-border aspect-[4/3] hover:shadow-2xl transition-all duration-500"
                    onClick={() => openLightbox(i)}
                  >
                    <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-secondary/90 text-primary-foreground font-body font-bold mb-1">{img.category}</span>
                      <p className="font-display text-sm sm:text-base font-bold text-white">{img.title}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full-screen Lightbox - viewport centered */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Image container with relative close button */}
          <div
            className="relative flex flex-col items-center max-w-[90vw] sm:max-w-[80vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const diff = e.changedTouches[0].clientX - touchStartX;
              if (Math.abs(diff) > 50) {
                diff > 0 ? goPrev() : goNext();
              }
              setTouchStartX(null);
            }}
          >
            {/* Close button - positioned at top-right of image */}
            <button
              className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20 shadow-lg border border-white/10"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nav buttons */}
            <button
              className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image */}
            <img
              src={(filtered[lightboxIdx] as any).image_url}
              alt={(filtered[lightboxIdx] as any).title}
              className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl animate-scale-bounce"
              key={lightboxIdx}
            />
            {/* Caption */}
            <div className="mt-4 text-center bg-black/40 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
              <p className="font-display text-base sm:text-lg font-bold text-white">{(filtered[lightboxIdx] as any).title}</p>
              <p className="font-body text-xs text-white/60 mt-1">{(filtered[lightboxIdx] as any).category} • {lightboxIdx + 1} / {filtered.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
