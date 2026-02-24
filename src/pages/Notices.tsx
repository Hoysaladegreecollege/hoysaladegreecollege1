import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Calendar, Pin, Bell, X, ExternalLink, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackNotices = [
  { id: "1", title: "Admission Open for 2026-27 Academic Year", date: "Feb 10, 2026", type: "Admission", pinned: true, content: "Applications are now being accepted for BCA, BCom, and BBA programs. Visit the admissions office or apply online through the college portal. Last date to apply is March 31, 2026." },
  { id: "2", title: "Semester End Exam Schedule Released", date: "Feb 5, 2026", type: "Exam", pinned: true, content: "The examination schedule for the current semester has been published. Students are advised to check the timetable carefully and plan their preparation accordingly. Hall tickets will be distributed from Feb 20, 2026." },
  { id: "3", title: "Annual Sports Day – March 15, 2026", date: "Jan 28, 2026", type: "Event", pinned: false, content: "All students are encouraged to participate in the annual sports day celebrations. Events include athletics, cricket, volleyball, and cultural performances. Registration closes on March 5, 2026." },
  { id: "4", title: "Workshop on AI & Machine Learning", date: "Jan 20, 2026", type: "Workshop", pinned: false, content: "A two-day workshop on AI and Machine Learning will be conducted by industry experts on February 8-9, 2026. BCA students are especially encouraged to attend. Registration is free for all college students." },
  { id: "5", title: "Library Hours Extended During Exams", date: "Jan 15, 2026", type: "General", pinned: false, content: "The college library will remain open until 8:00 PM during the examination period (Feb 15 – March 10, 2026). Students can access all study materials and use the reading rooms during extended hours." },
  { id: "6", title: "Scholarship Application Deadline", date: "Jan 10, 2026", type: "Scholarship", pinned: false, content: "Students eligible for government and college scholarships must submit their applications before January 31, 2026. Required documents include income certificate, caste certificate, and previous year marksheets." },
  { id: "7", title: "Holiday Notice – Republic Day", date: "Jan 5, 2026", type: "Holiday", pinned: false, content: "The college will remain closed on January 26, 2026 in observance of Republic Day. All classes, exams, and office work are suspended for the day. The flag hoisting ceremony will be held at 9:00 AM." },
];

const typeColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Admission: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
  Exam:       { bg: "bg-red-50",  text: "text-red-700",   border: "border-red-200",   dot: "bg-red-400" },
  Event:      { bg: "bg-blue-50", text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-400" },
  Workshop:   { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-400" },
  General:    { bg: "bg-muted",   text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" },
  Scholarship:{ bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  Holiday:    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-400" },
};

export default function Notices() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const { data: dbNotices = [], isLoading } = useQuery({
    queryKey: ["public-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("*").eq("is_active", true).order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const notices = dbNotices.length > 0
    ? dbNotices.map((n: any) => ({ id: n.id, title: n.title, date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), type: n.type, pinned: n.is_pinned, content: n.content }))
    : fallbackNotices;

  const types = ["All", ...Array.from(new Set(notices.map((n: any) => n.type)))];
  const filtered = notices.filter((n: any) => {
    const matchesType = filter === "All" || n.type === filter;
    const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const pinnedCount = notices.filter((n: any) => n.pinned).length;

  return (
    <div className="page-enter">
      <PageHeader title="Notices & Announcements" subtitle="Important updates for students, faculty, and parents" />

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container max-w-3xl px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Latest Notices" />
          </ScrollReveal>

          {/* Summary strip */}
          {!isLoading && (
            <ScrollReveal delay={100}>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Total", count: notices.length, color: "from-primary/8 to-primary/3", dot: "bg-primary" },
                  { label: "Pinned", count: pinnedCount, color: "from-secondary/12 to-secondary/4", dot: "bg-secondary" },
                  { label: "Showing", count: filtered.length, color: "from-emerald-500/8 to-emerald-500/3", dot: "bg-emerald-500" },
                ].map((s) => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} border border-border rounded-2xl p-3 text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">{s.count}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Search + Filter */}
          <ScrollReveal delay={120}>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notices..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {types.map((t: any) => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`font-body text-xs px-4 py-2 rounded-full transition-all duration-300 font-semibold border ${
                    filter === t
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary"
                      : "bg-card border-border text-muted-foreground hover:bg-muted hover:scale-105 hover:border-primary/30"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded" />
                      </div>
                      <Skeleton className="h-5 w-3/4 rounded" />
                      <Skeleton className="h-3 w-full rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((n: any, i: number) => {
                const tc = typeColors[n.type] || typeColors.General;
                return (
                  <ScrollReveal key={n.id || i} delay={i * 40}>
                    <div
                      onClick={() => setSelectedNotice(n)}
                      className={`relative overflow-hidden premium-card p-5 sm:p-6 group cursor-pointer border-glow card-stack ${n.pinned ? "ring-1 ring-secondary/20" : ""}`}
                    >
                      {/* Left accent bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 ${n.pinned ? "bg-secondary/60" : "bg-primary/10 group-hover:bg-primary/30"}`} />
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 to-secondary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      {/* Top shimmer on hover */}
                      <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative pl-3 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {n.pinned && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-amber-700 border border-secondary/25">
                                <Pin className="w-2.5 h-2.5" /> Pinned
                              </span>
                            )}
                            <span className={`text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
                              {n.type}
                            </span>
                            <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {n.date}
                            </span>
                          </div>
                          <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">{n.title}</h3>
                          <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{n.content}</p>
                        </div>
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/5 group-hover:bg-primary/12 flex items-center justify-center transition-all duration-300 group-hover:scale-110 mt-1 border border-border/50 group-hover:border-primary/20">
                          <ExternalLink className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="font-display text-lg font-semibold text-muted-foreground">No notices found</p>
              <p className="font-body text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Notice Detail Dialog */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in" onClick={() => setSelectedNotice(null)}>
          <div className="bg-card sm:rounded-3xl rounded-t-3xl border border-border w-full max-w-lg shadow-2xl animate-scale-bounce overflow-hidden max-h-[95vh] sm:max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Dialog Header */}
            <div className="relative p-6 border-b border-border bg-gradient-to-br from-primary/4 to-secondary/3 overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/8 rounded-full blur-2xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {selectedNotice.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-amber-700 border border-secondary/25">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                    <span className={`text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full border ${(typeColors[selectedNotice.type] || typeColors.General).bg} ${(typeColors[selectedNotice.type] || typeColors.General).text} ${(typeColors[selectedNotice.type] || typeColors.General).border}`}>
                      {selectedNotice.type}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground leading-snug">{selectedNotice.title}</h3>
                </div>
                <button onClick={() => setSelectedNotice(null)} className="p-2 rounded-xl hover:bg-muted transition-all duration-200 hover:scale-110 shrink-0 mt-1">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-muted/50 border border-border/50">
                <Bell className="w-4 h-4 text-primary shrink-0" />
                <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Posted on {selectedNotice.date}
                </span>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">{selectedNotice.content}</p>
            </div>

            <div className="p-5 pt-0">
              <button onClick={() => setSelectedNotice(null)}
                className="w-full py-3 rounded-2xl border-2 border-border font-body text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all duration-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
