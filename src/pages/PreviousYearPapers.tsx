import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { FileText, Download, Eye, Search, BookOpen, Filter } from "lucide-react";

export default function PreviousYearPapers() {
  const [courseFilter, setCourseFilter] = useState("All");
  const [semFilter, setSemFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: papers = [], isLoading } = useQuery({
    queryKey: ["public-papers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("previous_year_papers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const courses = ["All", ...Array.from(new Set(papers.map((p: any) => p.course)))];
  const semesters = ["All", ...Array.from(new Set(papers.map((p: any) => p.semester?.toString()).filter(Boolean))).sort()];
  const years = ["All", ...Array.from(new Set(papers.map((p: any) => p.year))).sort().reverse()];

  const filtered = papers.filter((p: any) => {
    const matchCourse = courseFilter === "All" || p.course === courseFilter;
    const matchSem = semFilter === "All" || p.semester?.toString() === semFilter;
    const matchYear = yearFilter === "All" || p.year === yearFilter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.subject.toLowerCase().includes(search.toLowerCase());
    return matchCourse && matchSem && matchYear && matchSearch;
  });

  return (
    <div className="page-enter">
      <SEOHead title="Previous Year Papers" description="Download previous year question papers for BCA, BCom, and BBA at Hoysala Degree College. Filter by course, semester, and year." canonical="/previous-year-papers" />
      <PageHeader title="Previous Year Papers" subtitle="Download question papers from previous semesters and exams" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-5xl px-4">
          <SectionHeading title="Question Papers" subtitle="Filter and download papers by course, semester, and year" />

          {/* Filters */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-body text-sm font-semibold text-foreground">Filter Papers</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or subject..."
                className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-body text-xs font-semibold text-muted-foreground block mb-1.5">Course</label>
                <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {courses.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-muted-foreground block mb-1.5">Semester</label>
                <select value={semFilter} onChange={e => setSemFilter(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {semesters.map(s => <option key={s}>{s === "All" ? "All" : `Sem ${s}`}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-muted-foreground block mb-1.5">Year</label>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-muted/50 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-display text-xl font-bold text-foreground">No Papers Found</p>
              <p className="font-body text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p: any, i: number) => (
                <ScrollReveal key={p.id} delay={i * 50}>
                  <div className="premium-card p-5 group h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-bold text-foreground leading-snug line-clamp-2">{p.title}</h3>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">{p.subject}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.course}</span>
                      {p.semester && <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-secondary/15 text-amber-700">Sem {p.semester}</span>}
                      <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.year}</span>
                    </div>
                    <div className="mt-auto flex gap-2">
                      {p.file_url && (
                        <>
                          <a href={p.file_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-muted hover:bg-muted/70 font-body text-xs font-semibold text-foreground transition-colors">
                            <Eye className="w-3.5 h-3.5" /> View
                          </a>
                          <a href={p.file_url} download
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs font-semibold transition-colors">
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
