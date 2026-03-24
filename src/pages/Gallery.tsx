import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Camera, ChevronLeft, ChevronRight, X, Maximize2, FolderOpen, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import galleryCampus from "@/assets/gallery-campus.jpg";
import galleryLab from "@/assets/gallery-lab.jpg";
import galleryLibrary from "@/assets/gallery-library.jpg";
import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryEvents from "@/assets/gallery-events.jpg";
import gallerySports from "@/assets/gallery-sports.jpg";

const fallbackImages = [
  { id: "f1", title: "Campus Building", category: "Campus", image_url: galleryCampus, album_name: null },
  { id: "f2", title: "Computer Lab", category: "Facilities", image_url: galleryLab, album_name: null },
  { id: "f3", title: "Library", category: "Facilities", image_url: galleryLibrary, album_name: null },
  { id: "f4", title: "Classroom", category: "Academics", image_url: galleryClassroom, album_name: null },
  { id: "f5", title: "Annual Day", category: "Events", image_url: galleryEvents, album_name: null },
  { id: "f6", title: "Sports Ground", category: "Sports", image_url: gallerySports, album_name: null },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);

  const { data: dbImages = [], isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").eq("is_active", true).order("sort_order").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const images = dbImages.length > 0 ? dbImages : fallbackImages;

  // Derive albums
  const albums = Array.from(new Set(images.filter((img: any) => img.album_name).map((img: any) => img.album_name))) as string[];
  const albumCovers = albums.map(name => {
    const albumImages = images.filter((img: any) => img.album_name === name);
    return { name, cover: albumImages[0]?.image_url, count: albumImages.length };
  });

  // Filter logic
  const displayImages = activeAlbum
    ? images.filter((img: any) => img.album_name === activeAlbum)
    : filter === "All"
      ? images
      : images.filter((img: any) => img.category === filter);

  const categories = ["All", ...Array.from(new Set(images.map((img: any) => img.category)))];

  const openLightbox = useCallback((index: number) => {
    setLightboxIdx(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
    document.body.style.overflow = "";
  }, []);

  const goNext = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % displayImages.length);
  }, [lightboxIdx, displayImages.length]);

  const goPrev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + displayImages.length) % displayImages.length);
  }, [lightboxIdx, displayImages.length]);

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

  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="page-enter">
      <SEOHead title="Campus Gallery" description="Explore Hoysala Degree College campus through photos – classrooms, labs, library, sports, events, and campus life." canonical="/gallery" />
      <PageHeader title="Campus Gallery" subtitle="Explore our world-class facilities and campus life through photos" />

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Photo Gallery" subtitle="A glimpse into life at Hoysala Degree College" />
          </ScrollReveal>

          {/* Album Folders */}
          {!activeAlbum && albums.length > 0 && (
            <ScrollReveal delay={50}>
              <div className="mb-10">
                <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" /> Albums
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {albumCovers.map((album, i) => (
                    <div
                      key={album.name}
                      onClick={() => { setActiveAlbum(album.name); setFilter("All"); }}
                      className="relative group cursor-pointer rounded-2xl overflow-hidden border border-border/40 aspect-[4/3] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FolderOpen className="w-3.5 h-3.5 text-secondary" />
                          <span className="font-body text-[10px] text-white/70">{album.count} photos</span>
                        </div>
                        <p className="font-display text-sm sm:text-base font-bold text-white leading-tight">{album.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Back from album */}
          {activeAlbum && (
            <ScrollReveal>
              <button onClick={() => setActiveAlbum(null)} className="flex items-center gap-2 mb-6 font-body text-sm font-semibold text-primary hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Gallery
              </button>
              <h3 className="font-display text-lg font-bold text-foreground mb-6">{activeAlbum}</h3>
            </ScrollReveal>
          )}

          {/* Category filter (only when not viewing album) */}
          {!activeAlbum && (
            <ScrollReveal delay={100}>
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                {categories.map((c: any) => (
                  <button key={c} onClick={() => setFilter(c)}
                    className={`font-body text-xs px-5 py-2.5 rounded-full transition-all duration-400 font-semibold border backdrop-blur-sm ${
                      filter === c
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary"
                        : "bg-card/80 border-border text-muted-foreground hover:bg-muted hover:scale-105 hover:border-primary/30 hover:shadow-md"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {displayImages.map((img: any, i: number) => (
                <ScrollReveal key={img.id} delay={i * 60}>
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-border/40 aspect-[4/3] active:scale-[0.97] touch-manipulation"
                    style={{
                      transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onClick={() => openLightbox(i)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-8px) scale(1.02)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 64px -16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    }}
                  >
                    <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms]" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full bg-secondary/90 text-primary-foreground font-body font-bold mb-1.5 backdrop-blur-sm">{img.category}</span>
                      <p className="font-display text-sm sm:text-base font-bold text-white">{img.title}</p>
                    </div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/10 group-hover:scale-110">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full-screen Lightbox */}
      {lightboxIdx !== null && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          role="dialog" aria-modal="true" aria-label="Image lightbox"
        >
          <div
            className="relative flex flex-col items-center justify-center w-[92vw] sm:max-w-[80vw] max-h-[100dvh] px-2 py-14 sm:py-8"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const diff = e.changedTouches[0].clientX - touchStartX;
              if (Math.abs(diff) > 50) { diff > 0 ? goPrev() : goNext(); }
              setTouchStartX(null);
            }}
          >
            <button
              className="fixed top-4 right-4 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-[10000] shadow-lg border border-white/10"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <button className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-20 border border-white/10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous image">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-20 border border-white/10"
              onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next image">
              <ChevronRight className="w-5 h-5" />
            </button>

            <img
              src={(displayImages[lightboxIdx] as any).image_url}
              alt={(displayImages[lightboxIdx] as any).title}
              className="w-full max-h-[65dvh] sm:max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-scale-bounce"
              key={lightboxIdx}
            />
            <div className="mt-4 text-center bg-white/[0.06] backdrop-blur-xl px-6 py-3.5 rounded-xl border border-white/[0.08]">
              <p className="font-display text-base sm:text-lg font-bold text-white">{(displayImages[lightboxIdx] as any).title}</p>
              <p className="font-body text-xs text-white/40 mt-1">{(displayImages[lightboxIdx] as any).category} • {lightboxIdx + 1} / {displayImages.length}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
