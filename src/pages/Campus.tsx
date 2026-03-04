import { Building, Eye, Download } from "lucide-react";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";

export default function Campus() {
  const [showPreview, setShowPreview] = useState(false);
  const pdfUrl = "/downloads/campus.pdf";

  return (
    <>
      <SEOHead title="Campus | Hoysala Degree College" description="Explore the modern campus facilities of Hoysala Degree College." />

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowPreview(false)} />
          <div className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden border border-border/40 shadow-2xl bg-card animate-in zoom-in-95 duration-300">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <a href={pdfUrl} download className="px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-primary/20">
                <Download className="w-4 h-4" /> Download
              </a>
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-xl bg-card/80 backdrop-blur-sm border border-border/40 text-foreground/70 hover:text-foreground hover:bg-card transition-all duration-300 flex items-center justify-center text-lg font-medium">
                ✕
              </button>
            </div>
            <iframe src={pdfUrl} className="w-full h-full" title="Campus Brochure" />
          </div>
        </div>
      )}

      <div className="min-h-screen py-16 sm:py-24">
        <div className="container px-4 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Building className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Campus</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4">
              Explore Our <span className="text-primary">Campus</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Take a virtual tour of our state-of-the-art campus designed to inspire learning, creativity, and growth.
            </p>
          </div>

          {/* PDF Card */}
          <div className="group relative rounded-3xl border border-border/30 bg-card/60 backdrop-blur-sm p-8 sm:p-12 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 overflow-hidden max-w-2xl mx-auto text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Building className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">Campus Brochure</h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed max-w-md mx-auto">
                View our comprehensive campus brochure featuring architecture, interiors, and facility details.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-all duration-300 border border-primary/20 hover:border-primary/30 active:scale-[0.97] text-sm"
                >
                  <Eye className="w-4 h-4" /> View Brochure
                </button>
                <a
                  href={pdfUrl}
                  download
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-card hover:bg-muted text-foreground font-semibold transition-all duration-300 border border-border/40 hover:border-border/60 active:scale-[0.97] text-sm"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
