import { FileText, Download, Eye, GraduationCap, BookOpen, Briefcase } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const offers = [
  {
    title: "BCA – Industry Aligned Courses",
    description: "Bachelor of Computer Applications with placement readiness, data analytics, and career development modules.",
    fee: "₹80,000/-",
    icon: GraduationCap,
    pdf: "/downloads/BCA.pdf",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    title: "BBA – Industry Aligned Courses",
    description: "Bachelor of Business Administration with placement readiness, data analytics, and career development focus.",
    fee: "₹70,000/-",
    icon: Briefcase,
    pdf: "/downloads/BBA.pdf",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    title: "B.Com – Industry Aligned Courses",
    description: "Bachelor of Commerce with industry-aligned semester-wise curriculum, placement training, and data analytics.",
    fee: "₹60,000/-",
    icon: BookOpen,
    pdf: "/downloads/BCOM.pdf",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

export default function Offers() {
  return (
    <>
      <SEOHead title="Offers | Hoysala Degree College" description="Explore industry-aligned course offerings at Hoysala Degree College – BCA, BBA, B.Com with placement support." />

      <div className="min-h-screen py-16 sm:py-24">
        <div className="container px-4 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Course Offerings</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Offers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Explore our industry-aligned degree programs designed to prepare you for a successful career. Click on any course to view the detailed brochure.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {offers.map((offer) => {
              const Icon = offer.icon;
              return (
                <div
                  key={offer.title}
                  className={`group relative rounded-3xl border ${offer.border} bg-card/60 backdrop-blur-sm p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 overflow-hidden`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${offer.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className={`w-7 h-7 ${offer.iconColor}`} strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {offer.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {offer.description}
                    </p>

                    {/* Fee Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                      <span className="text-xs text-muted-foreground font-medium">Annual Fee:</span>
                      <span className="text-sm font-bold text-primary">{offer.fee}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open(offer.pdf, '_blank', 'noopener,noreferrer')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-all duration-300 border border-primary/20 hover:border-primary/30 active:scale-[0.97]"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <a
                        href={offer.pdf}
                        download
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-card hover:bg-muted text-foreground text-sm font-semibold transition-all duration-300 border border-border/40 hover:border-border/60 active:scale-[0.97]"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
