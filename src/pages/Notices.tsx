import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Calendar, Pin, Bell, X, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackNotices = [
  { id: "1", title: "Admission Open for 2026-27 Academic Year", date: "Feb 10, 2026", type: "Admission", pinned: true, content: "Applications are now being accepted for BCA, BCom, and BBA programs. Visit the admissions office or apply online through the college portal. Last date to apply is March 31, 2026." },
  { id: "2", title: "Semester End Exam Schedule Released", date: "Feb 5, 2026", type: "Exam", pinned: true, content: "The examination schedule for the current semester has been published. Students are advised to check the timetable carefully and plan their preparation accordingly. Hall tickets will be distributed from Feb 20, 2026." },
  { id: "3", title: "Annual Sports Day – March 15, 2026", date: "Jan 28, 2026", type: "Event", pinned: false, content: "All students are encouraged to participate in the annual sports day celebrations. Events include athletics, cricket, volleyball, and cultural performances. Registration closes on March 5, 2026." },
  { id: "4", title: "Workshop on AI & Machine Learning", date: "Jan 20, 2026", type: "Workshop", pinned: false, content: "A two-day workshop on AI and Machine Learning will be conducted by industry experts on February 8-9, 2026. BCA students are especially encouraged to attend. Registration is free for all college students." },
  { id: "5", title: "Library Hours Extended During Exams", date: "Jan 15, 2026", type: "General", pinned: false, content: "The college library will remain open until 8:00 PM during the examination period (Feb 15 – March 10, 2026). Students can access all study materials and use the reading rooms during extended hours." },
  { id: "6", title: "Scholarship Application Deadline", date: "Jan 10, 2026", type: "Scholarship", pinned: false, content: "Students eligible for government and college scholarships must submit their applications before January 31, 2026. Required documents include income certificate, caste certificate, and previous year marksheets." },
  { id: "7", title: "Holiday Notice – Republic Day", date: "Jan 5, 2026", type: "Holiday", pinned: false, content: "The college will remain closed on January 26, 2026 in observance of Republic Day. All classes, exams, and office work are suspended for the day. The flag hoisting ceremony will be held at 9:00 AM." },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  Admission: { bg: "bg-secondary/15", text: "text-amber-700", border: "border-secondary/30" },
  Exam: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  Event: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  Workshop: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  General: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
  Scholarship: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  Holiday: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
};

export default function Notices() {
  const [filter, setFilter] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const { data: dbNotices = [] } = useQuery({
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
  const filtered = filter === "All" ? notices : notices.filter((n: any) => n.type === filter);

  return (
    <div className="page-enter">
      <PageHeader title="Notices & Announcements" subtitle="Important updates for students, faculty, and parents" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-3xl px-4">
          <SectionHeading title="Latest Notices" />

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {types.map((t: any) => (
              <button key={t} onClick={() => setFilter(t)}
                className={`font-body text-xs px-4 py-2 rounded-full transition-all duration-300 font-semibold ${
                  filter === t
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted hover:scale-105"
                }`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((n: any, i: number) => {
              const tc = typeColors[n.type] || typeColors.General;
              return (
                <ScrollReveal key={n.id || i} delay={i * 60}>
                  <div
                    onClick={() => setSelectedNotice(n)}
                    className={`premium-card p-5 sm:p-6 group cursor-pointer ${n.pinned ? "border-secondary/30 ring-1 ring-secondary/10" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          {n.pinned && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-amber-700">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                          <span className={`text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>{n.type}</span>
                          <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {n.date}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">{n.title}</h3>
                        <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{n.content}</p>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors mt-1">
                        <ExternalLink className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notice Detail Dialog */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedNotice(null)}>
          <div className="bg-card rounded-3xl border border-border w-full max-w-lg shadow-2xl animate-scale-bounce" onClick={(e) => e.stopPropagation()}>
            {/* Dialog Header */}
            <div className="p-6 border-b border-border flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {selectedNotice.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-amber-700">
                      <Pin className="w-2.5 h-2.5" /> Pinned
                    </span>
                  )}
                  <span className={`text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full ${(typeColors[selectedNotice.type] || typeColors.General).bg} ${(typeColors[selectedNotice.type] || typeColors.General).text}`}>
                    {selectedNotice.type}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground leading-snug">{selectedNotice.title}</h3>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0 mt-1">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {selectedNotice.date}
                </span>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed">{selectedNotice.content}</p>
            </div>

            <div className="p-5 pt-0">
              <button onClick={() => setSelectedNotice(null)} className="w-full py-3 rounded-2xl border-2 border-border font-body text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
