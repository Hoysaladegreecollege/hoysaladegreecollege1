import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Calendar, Pin, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackNotices = [
  { title: "Admission Open for 2026-27 Academic Year", date: "Feb 10, 2026", type: "Admission", pinned: true, content: "Applications are now being accepted for BCA, BCom, and BBA programs." },
  { title: "Semester End Exam Schedule Released", date: "Feb 5, 2026", type: "Exam", pinned: true, content: "The examination schedule for the current semester has been published." },
  { title: "Annual Sports Day – March 15, 2026", date: "Jan 28, 2026", type: "Event", pinned: false, content: "All students are encouraged to participate in the annual sports day." },
  { title: "Workshop on AI & Machine Learning", date: "Jan 20, 2026", type: "Workshop", pinned: false, content: "A two-day workshop on AI and Machine Learning will be conducted by industry experts." },
  { title: "Library Hours Extended During Exams", date: "Jan 15, 2026", type: "General", pinned: false, content: "The college library will remain open until 8:00 PM during the examination period." },
  { title: "Scholarship Application Deadline", date: "Jan 10, 2026", type: "Scholarship", pinned: false, content: "Students eligible for government and college scholarships must submit their applications before the deadline." },
  { title: "Holiday Notice – Republic Day", date: "Jan 5, 2026", type: "Holiday", pinned: false, content: "The college will remain closed on January 26, 2026 in observance of Republic Day." },
];

const typeColors: Record<string, string> = {
  Admission: "bg-secondary/15 text-secondary-foreground",
  Exam: "bg-destructive/10 text-destructive",
  Event: "bg-primary/10 text-primary",
  Workshop: "bg-primary/10 text-primary",
  General: "bg-muted text-muted-foreground",
  Scholarship: "bg-secondary/15 text-secondary-foreground",
  Holiday: "bg-destructive/10 text-destructive",
};

export default function Notices() {
  const [filter, setFilter] = useState("All");

  const { data: dbNotices = [] } = useQuery({
    queryKey: ["public-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("*").eq("is_active", true).order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const notices = dbNotices.length > 0
    ? dbNotices.map((n: any) => ({ title: n.title, date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), type: n.type, pinned: n.is_pinned, content: n.content }))
    : fallbackNotices;

  const types = ["All", ...new Set(notices.map((n: any) => n.type))];
  const filtered = filter === "All" ? notices : notices.filter((n: any) => n.type === filter);

  return (
    <div className="page-enter">
      <PageHeader title="Notices & Announcements" subtitle="Important updates for students, faculty, and parents" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-3xl px-4">
          <SectionHeading title="Latest Notices" />

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {types.map((t: any) => (
              <button key={t} onClick={() => setFilter(t)}
                className={`font-body text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
                  filter === t ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((n: any, i: number) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className={`premium-card p-5 sm:p-6 group ${n.pinned ? "border-secondary/30" : ""}`}>
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    {n.pinned && <Pin className="w-3.5 h-3.5 text-secondary" />}
                    <span className={`text-[10px] font-body font-bold px-2.5 py-0.5 rounded-full ${typeColors[n.type] || "bg-muted text-muted-foreground"}`}>{n.type}</span>
                    <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {n.date}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{n.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">{n.content}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
