import SectionHeading from "@/components/SectionHeading";
import { Bell, Calendar, Pin } from "lucide-react";

const notices = [
  { title: "Admission Open for 2026-27 Academic Year", date: "Feb 10, 2026", type: "Admission", pinned: true, content: "Applications are now being accepted for BCA, BCom, and BBA programs. Visit the admissions office or apply online." },
  { title: "Semester End Exam Schedule Released", date: "Feb 5, 2026", type: "Exam", pinned: true, content: "The examination schedule for the current semester has been published. Students can download the timetable from the student portal." },
  { title: "Annual Sports Day – March 15, 2026", date: "Jan 28, 2026", type: "Event", pinned: false, content: "All students are encouraged to participate in the annual sports day. Registration is now open for various athletic events." },
  { title: "Workshop on AI & Machine Learning", date: "Jan 20, 2026", type: "Workshop", pinned: false, content: "A two-day workshop on AI and Machine Learning will be conducted by industry experts. Limited seats available." },
  { title: "Library Hours Extended During Exams", date: "Jan 15, 2026", type: "General", pinned: false, content: "The college library will remain open until 8:00 PM during the examination period for student convenience." },
  { title: "Scholarship Application Deadline", date: "Jan 10, 2026", type: "Scholarship", pinned: false, content: "Students eligible for government and college scholarships must submit their applications before the deadline." },
  { title: "Holiday Notice – Republic Day", date: "Jan 5, 2026", type: "Holiday", pinned: false, content: "The college will remain closed on January 26, 2026 in observance of Republic Day." },
];

export default function Notices() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Notices & Announcements</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Notices</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-3xl">
          <SectionHeading title="Latest Notices" subtitle="Important announcements and updates for students, faculty, and parents" />
          <div className="space-y-4">
            {notices.map((n, i) => (
              <div key={i} className={`bg-card border rounded-xl p-5 transition-shadow hover:shadow-md ${n.pinned ? "border-secondary" : "border-border"}`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {n.pinned && <Pin className="w-3.5 h-3.5 text-secondary" />}
                  <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{n.type}</span>
                  <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {n.date}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{n.title}</h3>
                <p className="font-body text-sm text-muted-foreground mt-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
